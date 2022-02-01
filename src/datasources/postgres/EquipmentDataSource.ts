import { logger } from '@user-office-software/duo-logger';
import { ApolloError } from 'apollo-server';

import {
  Equipment,
  EquipmentAssignmentStatus,
  EquipmentInstrument,
  EquipmentResponsible,
} from '../../models/Equipment';
import {
  EquipmentsScheduledEvent,
  ScheduledEvent,
} from '../../models/ScheduledEvent';
import {
  EquipmentInput,
  AssignEquipmentsToScheduledEventInput,
  DeleteEquipmentAssignmentInput,
  ConfirmEquipmentAssignmentInput,
  EquipmentResponsibleInput,
  UpdateEquipmentOwnerInput,
} from '../../resolvers/mutations/EquipmentMutation';
import { isSetAndPopulated } from '../../utils/helperFunctions';
import { EquipmentDataSource } from '../EquipmentDataSource';
import database, { UNIQUE_CONSTRAINT_VIOLATION } from './database';
import {
  EquipmentRecord,
  createEquipmentObject,
  EquipmentsScheduledEventsRecord,
  EquipmentResponsibleRecord,
  createEquipmentResponsibleObject,
  createEquipmentInstrumentObject,
  EquipmentInstrumentRecord,
  ScheduledEventRecord,
} from './records';

export default class PostgresEquipmentDataSource
  implements EquipmentDataSource
{
  readonly tableName = 'equipments';
  readonly scheduledEventsTable = 'scheduled_events';
  readonly scheduledEventsEquipmentsTable = 'scheduled_events_equipments';
  readonly equipmentResponsibleTable = 'equipment_responsible';
  readonly equipmentInstrumentsTable = 'equipment_instruments';

  async create(userId: number, input: EquipmentInput): Promise<Equipment> {
    const equipmentRecord = await database.transaction(async (trx) => {
      const {
        name,
        description,
        color,
        maintenanceStartsAt,
        maintenanceEndsAt,
        autoAccept,
        instrumentIds,
      } = input;

      const [equipmentRecord] = await trx<EquipmentRecord>(this.tableName)
        .insert({
          owner_id: userId,
          name: name,
          description: description,
          color: color,
          maintenance_starts_at: maintenanceStartsAt,
          maintenance_ends_at: maintenanceEndsAt,
          auto_accept: autoAccept,
        })
        .returning('*');

      if (instrumentIds?.length) {
        await trx<EquipmentInstrumentRecord>(this.equipmentInstrumentsTable)
          .insert(
            instrumentIds.map((instrumentId) => ({
              equipment_id: equipmentRecord.equipment_id,
              instrument_id: instrumentId,
            }))
          )
          .returning<EquipmentInstrumentRecord[]>(['*']);
      }

      return equipmentRecord;
    });

    return createEquipmentObject(equipmentRecord);
  }

  async update(id: number, input: EquipmentInput): Promise<Equipment | null> {
    const equipmentRecord = await database
      .transaction(async (trx) => {
        const {
          name,
          description,
          color,
          maintenanceStartsAt,
          maintenanceEndsAt,
          autoAccept,
          instrumentIds,
        } = input;

        // Delete existing equipment instruments
        await trx<EquipmentInstrumentRecord>(this.equipmentInstrumentsTable)
          .where('equipment_id', '=', id)
          .delete();

        if (instrumentIds?.length) {
          // Re-create updated equipment instruments
          await trx<EquipmentInstrumentRecord>(this.equipmentInstrumentsTable)
            .insert(
              instrumentIds.map((instrumentId) => ({
                equipment_id: id,
                instrument_id: instrumentId,
              }))
            )
            .returning<EquipmentInstrumentRecord[]>(['*']);
        }

        // Update equipment itself
        const [equipmentRecord] = await trx<EquipmentRecord>(this.tableName)
          .update({
            name: name,
            description: description,
            color: color,
            maintenance_starts_at: maintenanceStartsAt,
            maintenance_ends_at: maintenanceEndsAt,
            auto_accept: autoAccept,
          })
          .where('equipment_id', id)
          .returning('*');

        return equipmentRecord;
      })
      .catch((error) => {
        logger.logException(
          `Could not update equipment with id '${id}'`,
          error
        );

        throw new Error(error);
      });

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
        if (isSetAndPopulated(equipmentIds)) {
          qb.whereIn('equipment_id', equipmentIds);
        }
      });

    return equipmentRecords.map(createEquipmentObject);
  }

  async getAllUserEquipments(
    userId: string,
    userInstrumentIds: number[],
    equipmentIds?: number[]
  ): Promise<Equipment[]> {
    const equipmentRecords = await database<EquipmentRecord>(this.tableName)
      .select(`${this.tableName}.*`)
      .distinctOn(`${this.tableName}.equipment_id`)
      .leftJoin(
        this.scheduledEventsEquipmentsTable,
        `${this.tableName}.equipment_id`,
        `${this.scheduledEventsEquipmentsTable}.equipment_id`
      )
      .leftJoin(
        this.scheduledEventsTable,
        `${this.scheduledEventsEquipmentsTable}.scheduled_event_id`,
        `${this.scheduledEventsTable}.scheduled_event_id`
      )
      .leftJoin(
        this.equipmentResponsibleTable,
        `${this.tableName}.equipment_id`,
        `${this.equipmentResponsibleTable}.equipment_id`
      )
      .where('owner_id', userId)
      .orWhere(`${this.equipmentResponsibleTable}.user_id`, userId)
      .orWhereIn(
        `${this.scheduledEventsTable}.instrument_id`,
        userInstrumentIds
      )
      .modify((qb) => {
        if (isSetAndPopulated(equipmentIds)) {
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

  async getEquipmentInstruments(
    equipmentId: number
  ): Promise<EquipmentInstrument[]> {
    const equipmentInstrumentsRecords =
      await database<EquipmentInstrumentRecord>(this.equipmentInstrumentsTable)
        .select('*')
        .where('equipment_id', equipmentId);

    return equipmentInstrumentsRecords.map(createEquipmentInstrumentObject);
  }

  async availableEquipments(
    scheduledEvent: ScheduledEvent
  ): Promise<Equipment[]> {
    /**
     * This queries tries to find every available equipments by checking:
     *  - the scheduled event instrument is part of equipment instruments
     *  - the equipment is not under scheduled maintenance:
     *    * maintenance_starts_at is NULL
     *    * maintenance_starts_at is not NULL but maintenance_ends_at is NULL, under maintenance indefinitely
     *    * maintenance_starts_at and maintenance_ends_at overlaps with the scheduled event
     *  - we have no relationship between the scheduled event and the equipment
     *  - the scheduled event doesn't overlap with other assigned scheduled events
     */
    const equipmentRecords = await database<EquipmentRecord>(this.tableName)
      .select<EquipmentRecord[]>(`${this.tableName}.*`)
      .join(
        this.equipmentInstrumentsTable,
        `${this.tableName}.equipment_id`,
        `${this.equipmentInstrumentsTable}.equipment_id`
      )
      .where(
        `${this.equipmentInstrumentsTable}.instrument_id`,
        scheduledEvent.instrument.id
      )
      .whereRaw(
        // TODO: see if we can use knex QB instead of raw
        `${this.tableName}.equipment_id NOT IN (
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
      const [scheduledEvent] = await database<ScheduledEventRecord>(
        this.scheduledEventsTable
      )
        .select('instrument_id')
        .where('scheduled_event_id', input.scheduledEventId);

      const equipments = await database<
        EquipmentRecord & EquipmentInstrumentRecord
      >(this.tableName)
        .select(
          `${this.tableName}.equipment_id`,
          'auto_accept',
          'instrument_id'
        )
        .join(
          this.equipmentInstrumentsTable,
          `${this.tableName}.equipment_id`,
          `${this.equipmentInstrumentsTable}.equipment_id`
        )
        .whereIn(`${this.tableName}.equipment_id`, input.equipmentIds)
        .andWhere('instrument_id', scheduledEvent.instrument_id);

      // NOTE: We check to see if all equipments can be used on the scheduled event instrument
      if (equipments.length !== input.equipmentIds.length) {
        throw new ApolloError(
          'Some of the equipments can not be used on scheduled event instrument',
          'NOT_ALLOWED'
        );
      }

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
    } catch (error) {
      // NOTE: We are explicitly casting error to { code: string } type because it is the easiest solution for now and because it's type is a bit difficult to determine because of knexjs not returning typed error message.
      if ((error as { code: string }).code === UNIQUE_CONSTRAINT_VIOLATION) {
        return false;
      }

      throw error;
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

  async updateEquipmentOwner(
    input: UpdateEquipmentOwnerInput
  ): Promise<boolean> {
    const [equipmentRecord] = await database<EquipmentRecord>(this.tableName)
      .update({ owner_id: input.userId })
      .where({ equipment_id: input.equipmentId })
      .returning('*');

    return equipmentRecord.owner_id === input.userId;
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

  async equipmentEventsByProposalBookingId(
    proposalBookingId: number
  ): Promise<Array<EquipmentsScheduledEvent>> {
    const equipmentScheduledEvents = await database<
      EquipmentsScheduledEventsRecord[]
    >(this.scheduledEventsTable)
      .select(
        `${this.scheduledEventsTable}.*`,
        `${this.scheduledEventsEquipmentsTable}.*`
      )
      .join(
        this.scheduledEventsEquipmentsTable,
        `${this.scheduledEventsTable}.scheduled_event_id`,
        `${this.scheduledEventsEquipmentsTable}.scheduled_event_id`
      )
      .where(
        `${this.scheduledEventsTable}.proposal_booking_id`,
        proposalBookingId
      );

    return equipmentScheduledEvents.map(
      (record) =>
        new EquipmentsScheduledEvent(
          record.equipment_id,
          record.scheduled_event_id,
          record.status
        )
    );
  }

  async equipmentEventsByScheduledEventId(
    scheduledEventId: number
  ): Promise<Array<EquipmentsScheduledEvent>> {
    const equipmentScheduledEvents = await database<
      EquipmentsScheduledEventsRecord[]
    >(this.scheduledEventsTable)
      .select(
        `${this.scheduledEventsTable}.*`,
        `${this.scheduledEventsEquipmentsTable}.*`
      )
      .join(
        this.scheduledEventsEquipmentsTable,
        `${this.scheduledEventsTable}.scheduled_event_id`,
        `${this.scheduledEventsEquipmentsTable}.scheduled_event_id`
      )
      .where(
        `${this.scheduledEventsTable}.scheduled_event_id`,
        scheduledEventId
      );

    return equipmentScheduledEvents.map(
      (record) =>
        new EquipmentsScheduledEvent(
          record.equipment_id,
          record.scheduled_event_id,
          record.status
        )
    );
  }
}
