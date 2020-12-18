import { logger } from '@esss-swap/duo-logger';
import { createScheduledEventValidationSchema } from '@esss-swap/duo-validation';

import { ResolverContext } from '../context';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import { ScheduledEventDataSource } from '../datasources/ScheduledEventDataSource';
import Authorized from '../decorators/Authorized';
import ValidateArgs from '../decorators/ValidateArgs';
import {
  helperInstrumentScientistHasAccess,
  helperInstrumentScientistHasInstrument,
} from '../helpers/instrumentHelpers';
import { ProposalBookingStatus } from '../models/ProposalBooking';
import {
  ScheduledEvent,
  CalendarExplicitBookableTypes,
} from '../models/ScheduledEvent';
import { rejection, Rejection } from '../rejection';
import {
  BulkUpsertScheduledEventsInput,
  NewScheduledEventInput,
} from '../resolvers/mutations/ScheduledEventMutation';
import { Roles } from '../types/shared';
import { bulkUpsertScheduledEventsValidationSchema } from '../validation/scheduledEvent';

export default class ScheduledEventMutations {
  constructor(
    private scheduledEventDataSource: ScheduledEventDataSource,
    private proposalBookingDataSource: ProposalBookingDataSource
  ) {}

  @ValidateArgs(
    createScheduledEventValidationSchema(CalendarExplicitBookableTypes)
  )
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
      .create(+ctx.user?.id!, newScheduledEvent)
      .catch(error => {
        logger.logException('Could not create scheduled event', error, {
          newScheduledEvent,
        });

        return rejection('INTERNAL_ERROR');
      });
  }

  @ValidateArgs(bulkUpsertScheduledEventsValidationSchema)
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
      .bulkUpsert(
        +ctx.user?.id!,
        proposalBooking.instrument.id,
        bulkUpsertScheduledEvents
      )
      .catch(error => {
        logger.logException('ScheduledEvent bulkUpsert failed', error, {
          bulkUpsertScheduledEvents,
        });

        return rejection('INTERNAL_ERROR');
      });
  }
}
