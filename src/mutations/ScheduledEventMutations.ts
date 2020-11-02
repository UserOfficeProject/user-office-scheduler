import { logger } from '@esss-swap/duo-logger';

import { ResolverContext } from '../context';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import { ScheduledEventDataSource } from '../datasources/ScheduledEventDataSource';
import Authorized from '../decorators/Authorized';
import {
  helperInstrumentScientistHasAccess,
  helperInstrumentScientistHasInstrument,
} from '../helpers/instrumentHelpers';
import { ProposalBookingStatus } from '../models/ProposalBooking';
import { ScheduledEvent } from '../models/ScheduledEvent';
import { rejection, Rejection } from '../rejection';
import {
  BulkUpsertScheduledEventsInput,
  NewScheduledEventInput,
} from '../resolvers/mutations/ScheduledEventMutation';
import { Roles } from '../types/shared';

export default class ScheduledEventMutations {
  constructor(
    private scheduledEventDataSource: ScheduledEventDataSource,
    private proposalBookingDataSource: ProposalBookingDataSource
  ) {}

  // TODO: validate input fields

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async create(
    ctx: ResolverContext,
    newScheduledEvent: NewScheduledEventInput
  ): Promise<ScheduledEvent | Rejection> {
    await helperInstrumentScientistHasInstrument(
      ctx,
      newScheduledEvent.instrumentId
    );

    return this.scheduledEventDataSource
      .create(newScheduledEvent)
      .catch(error => {
        logger.logException('Could not create scheduled event', error, {
          newScheduledEvent,
        });

        return rejection('INTERNAL_ERROR');
      });
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async bulkUpsert(
    ctx: ResolverContext,
    bulkUpsertScheduledEvents: BulkUpsertScheduledEventsInput
  ): Promise<ScheduledEvent[] | Rejection> {
    const proposalBooking = await this.proposalBookingDataSource.get(
      bulkUpsertScheduledEvents.proposalBookingId
    );

    if (
      !proposalBooking ||
      proposalBooking.status !== ProposalBookingStatus.DRAFT
    ) {
      return rejection('NOT_FOUND');
    }

    await helperInstrumentScientistHasAccess(ctx, proposalBooking);

    return this.scheduledEventDataSource
      .bulkUpsert(proposalBooking.instrument.id, bulkUpsertScheduledEvents)
      .catch(error => {
        logger.logException('ScheduledEvent bulkUpsert failed', error, {
          bulkUpsertScheduledEvents,
        });

        return rejection('INTERNAL_ERROR');
      });
  }
}
