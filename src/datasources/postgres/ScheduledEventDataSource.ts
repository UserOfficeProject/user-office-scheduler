/* eslint-disable @typescript-eslint/camelcase */
import {
  ScheduledEvent,
  ScheduledEventBookingType,
} from '../../models/ScheduledEvent';
import {
  BulkUpsertScheduledEventsInput,
  NewScheduledEventInput,
} from '../../resolvers/mutations/ScheduledEventMutation';
import { ScheduledEventFilter } from '../../resolvers/queries/ScheduledEventQuery';
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

type BulkUpsertFields = Pick<
  ScheduledEventRecord,
  | 'booking_type'
  | 'scheduled_by'
  | 'starts_at'
  | 'ends_at'
  | 'proposal_booking_id'
  | 'instrument_id'
>;

export default class PostgreScheduledEventDataSource
  implements ScheduledEventDataSource {
  readonly tableName = 'scheduled_events';

  async create(
    newScheduledEvent: NewScheduledEventInput
  ): Promise<ScheduledEvent> {
    const [scheduledEvent] = await database<CreateFields>(this.tableName)
      .insert({
        booking_type: newScheduledEvent.bookingType,
        starts_at: newScheduledEvent.startsAt,
        ends_at: newScheduledEvent.endsAt,
        scheduled_by: newScheduledEvent.scheduledById,
        description: newScheduledEvent.description,
        instrument_id: newScheduledEvent.instrumentId,
      })
      .returning<ScheduledEventRecord[]>(['*']);

    return createScheduledEventObject(scheduledEvent);
  }

  // technically we don't update anything
  // we only delete and (re)create
  bulkUpsert(
    scheduledById: number,
    instrumentId: number,
    bulkUpsertScheduledEvents: BulkUpsertScheduledEventsInput
  ): Promise<ScheduledEvent[]> {
    return database.transaction(async trx => {
      const { proposalBookingId, scheduledEvents } = bulkUpsertScheduledEvents;

      // delete existing related events
      await trx<Pick<ScheduledEventRecord, 'proposal_booking_id'>>(
        this.tableName
      )
        .where('proposal_booking_id', '=', proposalBookingId)
        .delete();

      // when the insert has empty array as param it
      // returns an object instead of an empty record array
      if (scheduledEvents.length === 0) {
        return [];
      }

      const newlyCreatedRecords = await trx<BulkUpsertFields>(this.tableName)
        .insert(
          scheduledEvents.map(newObj => ({
            proposal_booking_id: proposalBookingId,
            booking_type: ScheduledEventBookingType.USER_OPERATIONS,
            scheduled_by: scheduledById,
            starts_at: newObj.startsAt,
            ends_at: newObj.endsAt,
            instrument_id: instrumentId,
          }))
        )
        .returning<ScheduledEventRecord[]>(['*']);

      return newlyCreatedRecords.map(createScheduledEventObject);
    });
  }

  async delete(): Promise<null> {
    // TODO: decide if we can delete scheduled events or not (maybe want to treat them as canceled)
    throw new Error('not implemented yet');
  }

  async scheduledEvent(id: number): Promise<ScheduledEvent | null> {
    const scheduledEvent = await database<ScheduledEventRecord>(this.tableName)
      .select()
      .where('scheduled_event_id', id)
      .first();

    return scheduledEvent ? createScheduledEventObject(scheduledEvent) : null;
  }

  async scheduledEvents(
    filter: ScheduledEventFilter
  ): Promise<ScheduledEvent[]> {
    if (!filter.instrumentId) {
      return [];
    }

    const qb = database<ScheduledEventRecord>(this.tableName)
      .select()
      .where('instrument_id', '=', filter.instrumentId);

    if (filter.startsAt) {
      qb.where('starts_at', '>=', filter.startsAt);
    }

    if (filter.endsAt) {
      qb.where('ends_at', '<=', filter.endsAt);
    }

    const scheduledEventRecords = await qb;

    return scheduledEventRecords.map(createScheduledEventObject);
  }

  async proposalBookingScheduledEvents(
    proposalBookingId: number
  ): Promise<ScheduledEvent[]> {
    const scheduledEventRecords = await database<ScheduledEventRecord>(
      this.tableName
    )
      .select()
      .where('proposal_booking_id', '=', proposalBookingId);

    return scheduledEventRecords.map(createScheduledEventObject);
  }
}
