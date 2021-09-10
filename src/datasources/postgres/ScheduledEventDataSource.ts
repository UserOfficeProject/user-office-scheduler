import {
  ProposalBookingFinalizeAction,
  ProposalBookingStatus,
} from '../../models/ProposalBooking';
import {
  ScheduledEvent,
  ScheduledEventBookingType,
} from '../../models/ScheduledEvent';
import {
  BulkUpsertScheduledEventsInput,
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

  // technically we don't update anything
  // we only delete and (re)create
  bulkUpsert(
    scheduledById: number,
    instrumentId: number,
    bulkUpsertScheduledEvents: BulkUpsertScheduledEventsInput
  ): Promise<ScheduledEvent[]> {
    return database.transaction(async (trx) => {
      const { proposalBookingId, scheduledEvents } = bulkUpsertScheduledEvents;

      // delete existing events that weren't included in the upsert
      await trx<ScheduledEventRecord>(this.tableName)
        .where('proposal_booking_id', proposalBookingId)
        .whereNotIn(
          'scheduled_event_id',
          scheduledEvents
            .filter(({ newlyCreated }) => !newlyCreated)
            .map(({ id }) => id)
        )
        .delete();

      // when the insert has empty array as param it
      // returns an object instead of an empty record array
      if (scheduledEvents.length === 0) {
        return [];
      }

      const newlyCreatedRecords = await trx<ScheduledEventRecord>(
        this.tableName
      )
        .insert(
          scheduledEvents.map((newObj) => ({
            scheduled_event_id: newObj.newlyCreated ? this.nextId : newObj.id,
            proposal_booking_id: proposalBookingId,
            booking_type: ScheduledEventBookingType.USER_OPERATIONS,
            scheduled_by: scheduledById,
            starts_at: newObj.startsAt,
            ends_at: newObj.endsAt,
            instrument_id: instrumentId,
          }))
        )
        .onConflict('scheduled_event_id')
        .merge()
        .returning<ScheduledEventRecord[]>(['*']);

      return newlyCreatedRecords.map(createScheduledEventObject);
    });
  }

  async delete(): Promise<null> {
    // TODO: decide if we can delete scheduled events or not (maybe want to treat them as canceled)
    throw new Error('not implemented yet');
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
