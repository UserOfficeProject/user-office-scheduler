import {
  ProposalBookingFinalizeAction,
  ProposalBookingStatus,
} from '../../models/ProposalBooking';
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
import { ScheduledEventDataSource } from '../ScheduledEventDataSource';
import database from './database';
import {
  ScheduledEventRecord,
  createScheduledEventObject,
  MetaFields,
} from './records';

type CreateFields = Omit<
  ScheduledEventRecord,
  'scheduled_event_id' | MetaFields
>;

export default class PostgreScheduledEventDataSource
  implements ScheduledEventDataSource
{
  readonly tableName = 'scheduled_events';
  readonly equipSchdEvTableName = 'scheduled_events_equipments';
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
          ? ProposalBookingStatus.DRAFT
          : ProposalBookingStatus.ACTIVE,
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
      .update('status', ProposalBookingStatus.ACTIVE)
      .where('scheduled_event_id', id)
      .where('status', ProposalBookingStatus.DRAFT)
      .returning<ScheduledEventRecord[]>(['*']);

    if (!updatedRecord) {
      throw new Error(`Failed to activate proposal scheduled event '${id}'`);
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
          ? ProposalBookingStatus.COMPLETED
          : ProposalBookingStatus.DRAFT
      )
      .where('scheduled_event_id', id)
      .andWhere('status', ProposalBookingStatus.ACTIVE)
      .orWhere('status', ProposalBookingStatus.DRAFT)
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
    if (!filter.instrumentId) {
      return [];
    }

    const qb = database<ScheduledEventRecord>(this.tableName)
      .select()
      .where('instrument_id', filter.instrumentId)
      .orderBy('starts_at');

    if (filter.startsAt && filter.endsAt) {
      qb.where('starts_at', '<=', filter.endsAt).andWhere(
        'ends_at',
        '>=',
        filter.startsAt
      );
    }

    const scheduledEventRecords = await qb;

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
    endsAt: Date
  ): Promise<ScheduledEvent[]> {
    const scheduledEventRecords = await database<
      ScheduledEventRecord & { scheduledEventStatus: ProposalBookingStatus }
    >(this.tableName)
      .select<
        (ScheduledEventRecord & {
          scheduledEventStatus: ProposalBookingStatus;
        })[]
      >(['*', 'scheduled_events.status as scheduledEventStatus'])
      .join(
        this.equipSchdEvTableName,
        `${this.tableName}.scheduled_event_id`,
        `${this.equipSchdEvTableName}.scheduled_event_id`
      )
      .whereIn(`${this.equipSchdEvTableName}.equipment_id`, equipmentIds)
      .where('starts_at', '<=', endsAt)
      .andWhere('ends_at', '>=', startsAt);

    return scheduledEventRecords.map((scheduledEventRecord) =>
      createScheduledEventObject({
        ...scheduledEventRecord,
        status: scheduledEventRecord.scheduledEventStatus,
      })
    );
  }
}
