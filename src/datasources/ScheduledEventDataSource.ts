import { ScheduledEvent } from '../models/ScheduledEvent';
import {
  BulkUpsertScheduledEventsInput,
  NewScheduledEventInput,
} from '../resolvers/mutations/ScheduledEventMutation';
import { ScheduledEventFilter } from '../resolvers/queries/ScheduledEventQuery';

export interface ScheduledEventDataSource {
  create(
    scheduledById: number,
    newScheduledEvent: NewScheduledEventInput
  ): Promise<ScheduledEvent>;
  bulkUpsert(
    scheduledById: number,
    instrumentId: number,
    bulkUpsertScheduledEvents: BulkUpsertScheduledEventsInput
  ): Promise<ScheduledEvent[]>;
  delete(): Promise<null>;
  get(id: number): Promise<ScheduledEvent | null>;
  getAll(filter: ScheduledEventFilter): Promise<ScheduledEvent[]>;
  proposalBookingScheduledEvents(
    proposalBookingId: number
  ): Promise<ScheduledEvent[]>;
  proposalBookingScheduledEvent(
    proposalBookingId: number,
    scheduledEventId: number
  ): Promise<ScheduledEvent | null>;
  equipmentScheduledEvents(equipmentId: number): Promise<ScheduledEvent[]>;
}
