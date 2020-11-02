import { ResolverContext } from '../context';
import { ScheduledEventDataSource } from '../datasources/ScheduledEventDataSource';
import Authorized from '../decorators/Authorized';
import {
  helperInstrumentScientistHasAccess,
  helperInstrumentScientistHasInstrument,
} from '../helpers/instrumentHelpers';
import { ScheduledEvent } from '../models/ScheduledEvent';
import { ScheduledEventFilter } from '../resolvers/queries/ScheduledEventQuery';
import { Roles } from '../types/shared';

export default class ScheduledEventQueries {
  constructor(private scheduledEventDataSource: ScheduledEventDataSource) {}

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async scheduledEvent(
    ctx: ResolverContext,
    id: number
  ): Promise<ScheduledEvent | null> {
    return this.scheduledEventDataSource.scheduledEvent(id);
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async scheduledEvents(
    ctx: ResolverContext,
    filter: ScheduledEventFilter
  ): Promise<ScheduledEvent[]> {
    if (!filter.instrumentId) {
      return [];
    }

    await helperInstrumentScientistHasInstrument(ctx, filter.instrumentId);

    return this.scheduledEventDataSource.scheduledEvents(filter);
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async proposalBookingScheduledEvents(
    ctx: ResolverContext,
    proposalBookingId: number
  ): Promise<ScheduledEvent[]> {
    await helperInstrumentScientistHasAccess(ctx, proposalBookingId);

    return this.scheduledEventDataSource.proposalBookingScheduledEvents(
      proposalBookingId
    );
  }
}
