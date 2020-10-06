import { ScheduledEvent } from '../models/ScheduledEvent';
import {
  BulkUpsertScheduledEventsInput,
  NewScheduledEventInput,
} from '../resolvers/mutations/CreateScheduledEventMutation';
import { ScheduledEventFilter } from '../resolvers/queries/ScheduledEventsQuery';

export interface ScheduledEventDataSource {
  create(newScheduledEvent: NewScheduledEventInput): Promise<ScheduledEvent>;
  bulkUpsert(
    bulkUpsertScheduledEvents: BulkUpsertScheduledEventsInput
  ): Promise<ScheduledEvent[]>;
  delete(): Promise<null>;

  scheduledEvent(id: number): Promise<ScheduledEvent | null>;
  scheduledEvents(filter?: ScheduledEventFilter): Promise<ScheduledEvent[]>;
}
