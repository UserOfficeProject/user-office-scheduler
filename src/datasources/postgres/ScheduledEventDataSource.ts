import database from './database';
import {
  ScheduledEventRecord,
  createScheduledEventObject,
  MetaFields,
} from './records';
import { ProposalBookingStatusCore } from '../../generated/sdk';
import { ProposalBookingFinalizeAction } from '../../models/ProposalBooking';
import {
  ScheduledEvent,
  ScheduledEventBookingType,
} from '../../models/ScheduledEvent';
import {
  DeleteScheduledEventsInput,
  NewScheduledEventInput,
  UpdateScheduledEventInput,
} from '../../resolvers/mutations/ScheduledEventMutation';
import { ScheduledEventFilter } from '../../resolvers/queries/ScheduledEventQuery';
import { ProposalBookingScheduledEventFilter } from '../../resolvers/types/ProposalBooking';
import { isSetAndPopulated } from '../../utils/helperFunctions';
import { ScheduledEventDataSource } from '../ScheduledEventDataSource';

type CreateFields = Omit<
  ScheduledEventRecord,
  'scheduled_event_id' | MetaFields
>;

export default class PostgreScheduledEventDataSource
  implements ScheduledEventDataSource
{
  readonly tableName = 'scheduled_events';
  readonly equipmentsTableName = 'equipments';
  readonly equipSchdEvTableName = 'scheduled_events_equipments';
  readonly equipmentResponsibleTableName = 'equipment_responsible';
  // eslint-disable-next-line quotes
  readonly nextId = database.raw("nextval('equipments_equipment_id_seq')");

  async create(
    scheduledById: number,
    newScheduledEvent: NewScheduledEventInput
  ): Promise<ScheduledEvent> {
    const isUserOperationsEvent =
      newScheduledEvent.bookingType ===
      ScheduledEventBookingType.USER_OPERATIONS;

    const [scheduledEvent] = await database<CreateFields>(this.tableName)
      .insert({
        booking_type: newScheduledEvent.bookingType,
        starts_at: newScheduledEvent.startsAt,
        ends_at: newScheduledEvent.endsAt,
        proposal_booking_id: newScheduledEvent.proposalBookingId,
        scheduled_by: scheduledById,
        description: newScheduledEvent.description,
        instrument_id: newScheduledEvent.instrumentId,
        status: isUserOperationsEvent
          ? ProposalBookingStatusCore.DRAFT
          : ProposalBookingStatusCore.ACTIVE,
      })
      .returning<ScheduledEventRecord[]>(['*']);

    return createScheduledEventObject(scheduledEvent);
  }

  async update(
    updateScheduledEvent: UpdateScheduledEventInput
  ): Promise<ScheduledEvent> {
    const [updatedRecord] = await database<ScheduledEventRecord>(this.tableName)
      .update({
        starts_at: updateScheduledEvent.startsAt,
        ends_at: updateScheduledEvent.endsAt,
        local_contact: updateScheduledEvent.localContact,
      })
      .where('scheduled_event_id', updateScheduledEvent.scheduledEventId)
      .returning<ScheduledEventRecord[]>(['*']);

    if (!updatedRecord) {
      throw new Error(
        `Failed to update scheduled event '${updateScheduledEvent}'`
      );
    }

    return createScheduledEventObject(updatedRecord);
  }

  async activate(id: number): Promise<ScheduledEvent> {
    const [updatedRecord] = await database<ScheduledEventRecord>(this.tableName)
      .update('status', ProposalBookingStatusCore.ACTIVE)
      .where('scheduled_event_id', id)
      .where('status', ProposalBookingStatusCore.DRAFT)
      .returning<ScheduledEventRecord[]>(['*']);

    if (!updatedRecord) {
      throw new Error(`Failed to activate proposal scheduled event '${id}'`);
    }

    return createScheduledEventObject(updatedRecord);
  }

  async reopen(id: number): Promise<ScheduledEvent> {
    const [updatedRecord] = await database<ScheduledEventRecord>(this.tableName)
      .update('status', ProposalBookingStatusCore.ACTIVE)
      .where('scheduled_event_id', id)
      .where('status', ProposalBookingStatusCore.COMPLETED)
      .returning<ScheduledEventRecord[]>(['*']);

    if (!updatedRecord) {
      throw new Error(`Failed to re-open proposal scheduled event '${id}'`);
    }

    return createScheduledEventObject(updatedRecord);
  }

  async finalize(
    id: number,
    action: ProposalBookingFinalizeAction
  ): Promise<ScheduledEvent> {
    const [updatedRecord] = await database<ScheduledEventRecord>(this.tableName)
      .update(
        'status',
        action === ProposalBookingFinalizeAction.COMPLETE
          ? ProposalBookingStatusCore.COMPLETED
          : ProposalBookingStatusCore.DRAFT
      )
      .where('scheduled_event_id', id)
      .whereIn('status', [
        ProposalBookingStatusCore.ACTIVE,
        ProposalBookingStatusCore.DRAFT,
      ])
      .returning<ScheduledEventRecord[]>(['*']);

    if (!updatedRecord) {
      throw new Error(`Failed to finalize scheduled event '${id}'`);
    }

    return createScheduledEventObject(updatedRecord);
  }

  async delete(
    deleteScheduledEvents: DeleteScheduledEventsInput
  ): Promise<ScheduledEvent[]> {
    const deletedRecord = await database<ScheduledEventRecord>(this.tableName)
      .del()
      .whereIn('scheduled_event_id', deleteScheduledEvents.ids)
      .andWhere('proposal_booking_id', deleteScheduledEvents.proposalBookingId)
      .andWhere('instrument_id', deleteScheduledEvents.instrumentId)
      .returning('*');

    if (!deletedRecord.length) {
      throw new Error(
        `Scheduled event ${deleteScheduledEvents.ids.join(
          ', '
        )} could not be removed`
      );
    }

    return deletedRecord.map(createScheduledEventObject);
  }

  async get(id: number): Promise<ScheduledEvent | null> {
    const scheduledEvent = await database<ScheduledEventRecord>(this.tableName)
      .select()
      .where('scheduled_event_id', id)
      .first();

    return scheduledEvent ? createScheduledEventObject(scheduledEvent) : null;
  }

  async getAll(filter: ScheduledEventFilter): Promise<ScheduledEvent[]> {
    const scheduledEventRecords: ScheduledEventRecord[] =
      await database<ScheduledEventRecord>(this.tableName)
        .select()
        .modify((query) => {
          if (filter.startsAt && filter.endsAt) {
            query
              .where('starts_at', '<=', filter.endsAt)
              .andWhere('ends_at', '>=', filter.startsAt);
          }

          if (
            isSetAndPopulated(filter.instrumentIds) &&
            isSetAndPopulated(filter.localContactIds)
          ) {
            query.where((qb) => {
              qb.whereIn('instrument_id', filter.instrumentIds).orWhereIn(
                'local_contact',
                filter.localContactIds
              );
            });
          } else if (isSetAndPopulated(filter.instrumentIds)) {
            query.whereIn('instrument_id', filter.instrumentIds);
          } else if (isSetAndPopulated(filter.localContactIds)) {
            query.whereIn('local_contact', filter.localContactIds);
          }
        })
        .orderBy('starts_at');

    return scheduledEventRecords.map(createScheduledEventObject);
  }

  async proposalBookingScheduledEvents(
    proposalBookingId: number,
    filter?: ProposalBookingScheduledEventFilter
  ): Promise<ScheduledEvent[]> {
    const scheduledEventRecords = await database<ScheduledEventRecord>(
      this.tableName
    )
      .select()
      .where('proposal_booking_id', proposalBookingId)
      .orderBy('starts_at', 'asc')
      .modify((qb) => {
        if (filter?.bookingType) {
          qb.where('booking_type', filter.bookingType);
        }

        if (filter?.endsAfter !== undefined && filter?.endsAfter !== null) {
          qb.where('ends_at', '>=', filter.endsAfter);
        }

        if (filter?.endsBefore !== undefined && filter.endsBefore !== null) {
          qb.where('ends_at', '<=', filter.endsBefore);
        }
      });

    return scheduledEventRecords.map(createScheduledEventObject);
  }

  async proposalBookingScheduledEvent(
    proposalBookingId: number,
    scheduledEventId: number
  ): Promise<ScheduledEvent | null> {
    const scheduledEventRecord = await database<ScheduledEventRecord>(
      this.tableName
    )
      .select()
      .where('scheduled_event_id', scheduledEventId)
      .andWhere('proposal_booking_id', proposalBookingId)
      .first();

    return scheduledEventRecord
      ? createScheduledEventObject(scheduledEventRecord)
      : null;
  }

  async equipmentScheduledEvents(
    equipmentIds: number[],
    startsAt: Date,
    endsAt: Date,
    userId?: number | null
  ): Promise<ScheduledEvent[]> {
    const scheduledEventRecords = await database<
      ScheduledEventRecord & { scheduledEventStatus: ProposalBookingStatusCore }
    >(this.tableName)
      .select<
        (ScheduledEventRecord & {
          scheduledEventStatus: ProposalBookingStatusCore;
          equipmentId: number;
        })[]
      >([
        `${this.tableName}.*`,
        `${this.tableName}.status as scheduledEventStatus`,
        `${this.equipSchdEvTableName}.equipment_id`,
        `${this.equipmentResponsibleTableName}.user_id`,
        `${this.equipmentsTableName}.owner_id`,
      ])
      .join(
        this.equipSchdEvTableName,
        `${this.tableName}.scheduled_event_id`,
        `${this.equipSchdEvTableName}.scheduled_event_id`
      )
      .join(
        this.equipmentsTableName,
        `${this.equipSchdEvTableName}.equipment_id`,
        `${this.equipmentsTableName}.equipment_id`
      )
      .leftJoin(
        this.equipmentResponsibleTableName,
        `${this.equipSchdEvTableName}.equipment_id`,
        `${this.equipmentResponsibleTableName}.equipment_id`
      )
      .whereIn(`${this.equipSchdEvTableName}.equipment_id`, equipmentIds)
      .where('starts_at', '<=', endsAt)
      .andWhere('ends_at', '>=', startsAt)
      .andWhere((query) => {
        if (userId) {
          query
            .where(`${this.equipmentResponsibleTableName}.user_id`, userId)
            .orWhere(`${this.equipmentsTableName}.owner_id`, userId);
        }
      })
      .distinctOn('scheduled_event_id');

    return scheduledEventRecords.map((scheduledEventRecord) =>
      createScheduledEventObject({
        ...scheduledEventRecord,
        status: scheduledEventRecord.scheduledEventStatus,
      })
    );
  }
}
