import { ScheduledEventDataSource } from '../datasources/ScheduledEventDataSource';
import { ScheduledEvent } from '../models/ScheduledEvent';
import { ScheduledEventFilter } from '../resolvers/queries/ScheduledEventQuery';

export default class ScheduledEventQueries {
  constructor(private scheduledEventDataSource: ScheduledEventDataSource) {}

  scheduledEvent(id: number): Promise<ScheduledEvent | null> {
    return this.scheduledEventDataSource.scheduledEvent(id);
  }

  scheduledEvents(filter: ScheduledEventFilter): Promise<ScheduledEvent[]> {
    return this.scheduledEventDataSource.scheduledEvents(filter);
  }

  proposalBookingScheduledEvents(id: number): Promise<ScheduledEvent[]> {
    return this.scheduledEventDataSource.proposalBookingScheduledEvents(id);
  }
}
