import { ResolverContext } from '../context';
import { ScheduledEventDataSource } from '../datasources/ScheduledEventDataSource';
import Authorized from '../decorators/Authorized';
import { ScheduledEvent } from '../models/ScheduledEvent';
import { ScheduledEventFilter } from '../resolvers/queries/ScheduledEventQuery';

export default class ScheduledEventQueries {
  constructor(private scheduledEventDataSource: ScheduledEventDataSource) {}

  @Authorized([])
  scheduledEvent(
    ctx: ResolverContext,
    id: number
  ): Promise<ScheduledEvent | null> {
    return this.scheduledEventDataSource.scheduledEvent(id);
  }

  @Authorized([])
  scheduledEvents(
    ctx: ResolverContext,
    filter: ScheduledEventFilter
  ): Promise<ScheduledEvent[]> {
    return this.scheduledEventDataSource.scheduledEvents(filter);
  }

  @Authorized([])
  proposalBookingScheduledEvents(
    ctx: ResolverContext,
    id: number
  ): Promise<ScheduledEvent[]> {
    return this.scheduledEventDataSource.proposalBookingScheduledEvents(id);
  }
}
