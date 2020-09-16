import { ScheduledEvent } from '../models/ScheduledEvent';
import { NewScheduledEventInput } from '../resolvers/mutations/CreateScheduledEventMutation';
import { ScheduledEventFilter } from '../resolvers/queries/ScheduledEventsQuery';

export enum ScheduledEventDataSourceErrorTypes {
  SCHEDULED_EVENT_OVERLAP = 'SCHEDULED_EVENT_OVERLAP',
}

export class ScheduledEventDataSourceError {
  constructor(public readonly errorCode: ScheduledEventDataSourceErrorTypes) {}
}

export interface ScheduledEventDataSource {
  create(newScheduledEvent: NewScheduledEventInput): Promise<ScheduledEvent>;
  delete(): Promise<null>;

  scheduledEvent(id: number): Promise<ScheduledEvent | null>;
  scheduledEvents(filter?: ScheduledEventFilter): Promise<ScheduledEvent[]>;
}
