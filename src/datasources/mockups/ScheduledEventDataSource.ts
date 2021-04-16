/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

export const dummyScheduledEvents: ScheduledEvent[] = [
  new ScheduledEvent(
    123,
    new Date(),
    new Date(),
    ScheduledEventBookingType.COMMISSIONING,
    new Date(),
    new Date(),
    { id: 0 },
    null,
    { id: 0 },
    1
  ),
  new ScheduledEvent(
    321,
    new Date(),
    new Date(),
    ScheduledEventBookingType.SHUTDOWN,
    new Date(),
    new Date(),
    { id: 0 },
    'dummy',
    { id: 0 },
    2
  ),
];

export default class MockupScheduledEventDataSource
  implements ScheduledEventDataSource {
  async create(
    scheduledById: number,
    newScheduledEvent: NewScheduledEventInput
  ): Promise<ScheduledEvent> {
    return new ScheduledEvent(
      100,
      new Date(),
      new Date(),
      newScheduledEvent.bookingType,
      newScheduledEvent.startsAt,
      newScheduledEvent.endsAt,
      { id: scheduledById },
      newScheduledEvent.description,
      { id: newScheduledEvent.instrumentId },
      1
    );
  }

  bulkUpsert(
    scheduledById: number,
    instrumentId: 0,
    bulkUpsertScheduledEvents: BulkUpsertScheduledEventsInput
  ): Promise<ScheduledEvent[]> {
    throw new Error('Method not implemented.');
  }

  async delete(): Promise<null> {
    throw new Error('Method not implemented.');
  }

  async get(id: number): Promise<ScheduledEvent | null> {
    return dummyScheduledEvents.find(se => se.id === id) ?? null;
  }

  async getAll(filter?: ScheduledEventFilter): Promise<ScheduledEvent[]> {
    return dummyScheduledEvents;
  }

  proposalBookingScheduledEvents(
    proposalBookingId: number
  ): Promise<ScheduledEvent[]> {
    throw new Error('Method not implemented.');
  }

  proposalBookingScheduledEvent(
    proposalBookingId: number,
    scheduledEventId: number
  ): Promise<ScheduledEvent | null> {
    throw new Error('Method not implemented.');
  }
  equipmentScheduledEvents(equipmentId: number): Promise<ScheduledEvent[]> {
    throw new Error('Method not implemented.');
  }
}
