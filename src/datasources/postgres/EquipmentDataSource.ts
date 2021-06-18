import {
  Equipment,
  EquipmentAssignmentStatus,
  EquipmentResponsible,
} from '../../models/Equipment';
import { ScheduledEvent } from '../../models/ScheduledEvent';
import {
  EquipmentInput,
  AssignEquipmentsToScheduledEventInput,
  DeleteEquipmentAssignmentInput,
  ConfirmEquipmentAssignmentInput,
  EquipmentResponsibleInput,
} from '../../resolvers/mutations/EquipmentMutation';
import { EquipmentDataSource } from '../EquipmentDataSource';
import database, { UNIQUE_CONSTRAINT_VIOLATION } from './database';
import {
  EquipmentRecord,
  createEquipmentObject,
  EquipmentsScheduledEventsRecord,
  EquipmentResponsibleRecord,
  createEquipmentResponsibleObject,
} from './records';

export default class PostgresEquipmentDataSource
  implements EquipmentDataSource
{
  readonly tableName = 'equipments';
  readonly scheduledEventsTable = 'scheduled_events';
  readonly scheduledEventsEquipmentsTable = 'scheduled_events_equipments';
  readonly equipmentResponsibleTable = 'equipment_responsible';

  async create(userId: number, input: EquipmentInput): Promise<Equipment> {
    const [equipmentRecord] = await database<EquipmentRecord>(this.tableName)
      .insert({
        owner_id: userId,
        name: input.name,
        maintenance_starts_at: input.maintenanceStartsAt,
        maintenance_ends_at: input.maintenanceEndsAt,
        auto_accept: input.autoAccept,
      })
      .returning('*');

    return createEquipmentObject(equipmentRecord);
  }

  async update(id: number, input: EquipmentInput): Promise<Equipment | null> {
    const [equipmentRecord] = await database<EquipmentRecord>(this.tableName)
      .update({
        name: input.name,
        maintenance_starts_at: input.maintenanceStartsAt,
        maintenance_ends_at: input.maintenanceEndsAt,
        auto_accept: input.autoAccept,
      })
      .where('equipment_id', id)
      .returning('*');

    return equipmentRecord ? createEquipmentObject(equipmentRecord) : null;
  }

  async get(id: number): Promise<Equipment | null> {
    const equipmentRecord = await database<EquipmentRecord>(this.tableName)
      .select('*')
      .where('equipment_id', id)
      .first();

    return equipmentRecord ? createEquipmentObject(equipmentRecord) : null;
  }

  async getAll(equipmentIds?: number[]): Promise<Equipment[]> {
    const equipmentRecords = await database<EquipmentRecord>(this.tableName)
      .select('*')
      .orderBy('name', 'asc')
      .modify((qb) => {
        if (equipmentIds?.length) {
          qb.whereIn('equipment_id', equipmentIds);
        }
      });

    return equipmentRecords.map(createEquipmentObject);
  }

  async getAllUserEquipments(
    userId: string,
    equipmentIds?: number[]
  ): Promise<Equipment[]> {
    const equipmentRecords = await database<EquipmentRecord>(this.tableName)
      .select('*')
      .orderBy('name', 'asc')
      .join(
        this.equipmentResponsibleTable,
        `${this.tableName}.equipment_id`,
        `${this.equipmentResponsibleTable}.equipment_id`
      )
      .where('owner_id', userId)
      .orWhere(`${this.equipmentResponsibleTable}.user_id`, userId)
      .modify((qb) => {
        if (equipmentIds?.length) {
          qb.whereIn(`${this.tableName}.equipment_id`, equipmentIds);
        }
      });

    return equipmentRecords.map(createEquipmentObject);
  }

  async getEquipmentResponsible(
    equipmentId: number
  ): Promise<EquipmentResponsible[]> {
    const equipmentResponsibleRecords =
      await database<EquipmentResponsibleRecord>(this.equipmentResponsibleTable)
        .select('*')
        .where('equipment_id', equipmentId);

    return equipmentResponsibleRecords.map(createEquipmentResponsibleObject);
  }

  async availableEquipments(
    scheduledEvent: ScheduledEvent
  ): Promise<Equipment[]> {
    /**
     * This queries tries to find every available equipments by checking:
     *  - the equipment is not under scheduled maintenance:
     *    * maintenance_starts_at is NULL
     *    * maintenance_starts_at is not NULL but maintenance_ends_at is NULL, under maintenance indefinitely
     *    * maintenance_starts_at and maintenance_ends_at overlaps with the scheduled event
     *  - we have no relationship between the scheduled vent and the equipment
     *  - the scheduled event doesn't overlap with other assigned scheduled events
     */
    const equipmentRecords = await database<EquipmentRecord>(this.tableName)
      .select<EquipmentRecord[]>(`${this.tableName}.*`)
      .whereRaw(
        // TODO: see if we can use knex QB instead of raw
        `equipment_id NOT IN (
          SELECT eq.equipment_id 
          FROM ${this.tableName} eq 
          INNER JOIN ${this.scheduledEventsEquipmentsTable} see ON see.equipment_id = eq.equipment_id 
          INNER JOIN ${this.scheduledEventsTable} se ON se.scheduled_event_id = see.scheduled_event_id 
          WHERE see.scheduled_event_id = :scheduledEventId
          OR
          (
            (se.starts_at >= :startsAt AND se.ends_at <= :endsAt) OR
            (se.starts_at < :endsAt AND se.ends_at > :startsAt)
          )
        )
      `,
        {
          scheduledEventId: scheduledEvent.id,
          startsAt: scheduledEvent.startsAt,
          endsAt: scheduledEvent.endsAt,
        }
      )
      .where((qb) => {
        // available, not under maintenance
        qb.where('maintenance_starts_at', null);
        qb.orWhere((qb) => {
          // scheduled for maintenance indefinitely with a start date
          qb.whereNot('maintenance_starts_at', null);
          qb.where('maintenance_ends_at', null);
          qb.where('maintenance_starts_at', '>=', scheduledEvent.endsAt);
        });
        qb.orWhere((qb) => {
          qb.whereNot('maintenance_starts_at', null);
          qb.whereNot('maintenance_ends_at', null);
          qb.whereNot((qb) => {
            // checking overlap
            qb.where('maintenance_starts_at', '>=', scheduledEvent.startsAt);
            qb.andWhere('maintenance_ends_at', '<=', scheduledEvent.endsAt);
            qb.orWhere('maintenance_starts_at', '<', scheduledEvent.endsAt);
            qb.andWhere('maintenance_ends_at', '>', scheduledEvent.startsAt);
          });
        });
      })
      .orderBy('name', 'asc');

    return equipmentRecords.map(createEquipmentObject);
  }

  async scheduledEventEquipments(
    scheduledEventId: number
  ): Promise<Array<Equipment & { status: EquipmentAssignmentStatus }>> {
    const equipmentRecords = await database<EquipmentRecord>(this.tableName)
      .select<Array<EquipmentRecord & { status: EquipmentAssignmentStatus }>>(
        `${this.tableName}.*`,
        `${this.scheduledEventsEquipmentsTable}.status`
      )
      .join(
        this.scheduledEventsEquipmentsTable,
        `${this.tableName}.equipment_id`,
        `${this.scheduledEventsEquipmentsTable}.equipment_id`
      )
      .where(
        `${this.scheduledEventsEquipmentsTable}.scheduled_event_id`,
        scheduledEventId
      );

    return equipmentRecords.map((record) => ({
      ...createEquipmentObject(record),
      status: record.status,
    }));
  }

  async equipmentAssignmentStatus(
    scheduledEventId: number,
    equipmentId?: number
  ): Promise<EquipmentAssignmentStatus | null> {
    const equipmentAssignmentRecord =
      await database<EquipmentsScheduledEventsRecord>(
        this.scheduledEventsEquipmentsTable
      )
        .select<Pick<EquipmentsScheduledEventsRecord, 'status'>>('status')
        .where('scheduled_event_id', scheduledEventId)
        .where('equipment_id', equipmentId)
        .first();

    return (
      (equipmentAssignmentRecord?.status as EquipmentAssignmentStatus) ?? null
    );
  }

  async assign(input: AssignEquipmentsToScheduledEventInput): Promise<boolean> {
    try {
      const equipments = await database<EquipmentRecord>(this.tableName)
        .select('equipment_id', 'auto_accept')
        .whereIn('equipment_id', input.equipmentIds);

      const records = await database<EquipmentsScheduledEventsRecord>(
        this.scheduledEventsEquipmentsTable
      )
        .insert(
          input.equipmentIds.map((equipmentId) => ({
            equipment_id: equipmentId,
            scheduled_event_id: input.scheduledEventId,
            status: equipments.find(
              (equipment) => equipment.equipment_id === +equipmentId
            )?.auto_accept
              ? EquipmentAssignmentStatus.ACCEPTED
              : EquipmentAssignmentStatus.PENDING,
          }))
        )
        .returning('*');

      return records.length === input.equipmentIds.length;
    } catch (e) {
      if ('code' in e && e.code === UNIQUE_CONSTRAINT_VIOLATION) {
        return false;
      }

      throw e;
    }
  }

  async deleteAssignment(
    input: DeleteEquipmentAssignmentInput
  ): Promise<boolean> {
    const deletedRecords = await database<EquipmentsScheduledEventsRecord>(
      this.scheduledEventsEquipmentsTable
    )
      .del()
      .where('equipment_id', input.equipmentId)
      .where('scheduled_event_id', input.scheduledEventId)
      .returning('*');

    return deletedRecords.length === 1;
  }

  async confirmAssignment(
    input: ConfirmEquipmentAssignmentInput
  ): Promise<boolean> {
    const deletedRecords = await database<EquipmentsScheduledEventsRecord>(
      this.scheduledEventsEquipmentsTable
    )
      .update({ status: input.newStatus })
      .where('equipment_id', input.equipmentId)
      .where('scheduled_event_id', input.scheduledEventId)
      .where('status', EquipmentAssignmentStatus.PENDING)
      .returning('*');

    return deletedRecords.length === 1;
  }
  async addEquipmentResponsible(
    input: EquipmentResponsibleInput
  ): Promise<boolean> {
    const dataToInsert = input.userIds.map((userId) => ({
      user_id: userId,
      equipment_id: input.equipmentId,
    }));

    const equipmentResponsibleRecords =
      await database<EquipmentResponsibleRecord>(this.equipmentResponsibleTable)
        .insert(dataToInsert)
        .returning('*');

    return equipmentResponsibleRecords.length === dataToInsert.length;
  }
}
