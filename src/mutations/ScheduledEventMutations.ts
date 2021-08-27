import { logger } from '@esss-swap/duo-logger';
import { createScheduledEventValidationSchema } from '@esss-swap/duo-validation';

import { ResolverContext } from '../context';
import { EquipmentDataSource } from '../datasources/EquipmentDataSource';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import { ScheduledEventDataSource } from '../datasources/ScheduledEventDataSource';
import Authorized from '../decorators/Authorized';
import ValidateArgs from '../decorators/ValidateArgs';
import { instrumentScientistHasInstrument } from '../helpers/instrumentHelpers';
import { instrumentScientistHasAccess } from '../helpers/permissionHelpers';
import { EquipmentAssignmentStatus } from '../models/Equipment';
import {
  ProposalBookingFinalizeAction,
  ProposalBookingStatus,
} from '../models/ProposalBooking';
import {
  ScheduledEvent,
  CalendarExplicitBookableTypes,
} from '../models/ScheduledEvent';
import { rejection, Rejection } from '../rejection';
import {
  ActivateScheduledEventInput,
  BulkUpsertScheduledEventsInput,
  FinalizeScheduledEventInput,
  NewScheduledEventInput,
  UpdateScheduledEventInput,
} from '../resolvers/mutations/ScheduledEventMutation';
import { Roles, User } from '../types/shared';
import {
  bulkUpsertScheduledEventsValidationSchema,
  updateScheduledEventValidationSchema,
} from '../validation/scheduledEvent';

export default class ScheduledEventMutations {
  constructor(
    private scheduledEventDataSource: ScheduledEventDataSource,
    private proposalBookingDataSource: ProposalBookingDataSource,
    private equipmentDataSource: EquipmentDataSource
  ) {}

  @ValidateArgs(
    createScheduledEventValidationSchema(CalendarExplicitBookableTypes)
  )
  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async create(
    ctx: ResolverContext,
    newScheduledEvent: NewScheduledEventInput
  ): Promise<ScheduledEvent | Rejection> {
    const hasInstrument = await instrumentScientistHasInstrument(
      ctx,
      newScheduledEvent.instrumentId
    );
    if (!hasInstrument) {
      return rejection('NOT_ALLOWED');
    }

    return this.scheduledEventDataSource
      .create(+(ctx.user as User).id, newScheduledEvent)
      .catch((error) => {
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
      +bulkUpsertScheduledEvents.proposalBookingId
    );

    if (
      !proposalBooking ||
      proposalBooking.status !== ProposalBookingStatus.DRAFT
    ) {
      return rejection('NOT_FOUND');
    }

    if (!(await instrumentScientistHasAccess(ctx, proposalBooking))) {
      return rejection('NOT_ALLOWED');
    }

    return this.scheduledEventDataSource
      .bulkUpsert(
        +(ctx.user as User).id,
        proposalBooking.instrument.id,
        bulkUpsertScheduledEvents
      )
      .catch((error) => {
        logger.logException('ScheduledEvent bulkUpsert failed', error, {
          bulkUpsertScheduledEvents,
        });

        return rejection('INTERNAL_ERROR');
      });
  }

  @ValidateArgs(updateScheduledEventValidationSchema)
  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async update(
    ctx: ResolverContext,
    updateScheduledEvent: UpdateScheduledEventInput
  ): Promise<ScheduledEvent | Rejection> {
    const scheduledEvent = await this.scheduledEventDataSource.get(
      updateScheduledEvent.scheduledEventId
    );

    if (
      !scheduledEvent ||
      scheduledEvent.status !== ProposalBookingStatus.DRAFT ||
      !scheduledEvent.proposalBookingId
    ) {
      return rejection('NOT_FOUND');
    }

    if (
      !(await instrumentScientistHasAccess(
        ctx,
        scheduledEvent.proposalBookingId
      ))
    ) {
      return rejection('NOT_ALLOWED');
    }

    return this.scheduledEventDataSource
      .update(updateScheduledEvent)
      .catch((error) => {
        logger.logException('ScheduledEvent update failed', error, {
          updateScheduledEvent,
        });

        return rejection('INTERNAL_ERROR');
      });
  }

  async handleProposalBookingStatusChange(
    proposalBookingId: number,
    action?: ProposalBookingFinalizeAction
  ) {
    const scheduledEvents =
      await this.scheduledEventDataSource.proposalBookingScheduledEvents(
        proposalBookingId
      );

    const allProposalBookingEventsAreBooked = scheduledEvents.every(
      (scheduledEventItem) =>
        scheduledEventItem.status === ProposalBookingStatus.BOOKED
    );

    const allProposalBookingEventsAreClosed = scheduledEvents.every(
      (scheduledEventItem) =>
        scheduledEventItem.status === ProposalBookingStatus.CLOSED
    );

    if (allProposalBookingEventsAreClosed) {
      await this.proposalBookingDataSource.finalize(
        ProposalBookingFinalizeAction.CLOSE,
        proposalBookingId
      );
    } else if (allProposalBookingEventsAreBooked) {
      await this.proposalBookingDataSource.activate(proposalBookingId);
    } else if (action && action === ProposalBookingFinalizeAction.RESTART) {
      await this.proposalBookingDataSource.finalize(
        ProposalBookingFinalizeAction.RESTART,
        proposalBookingId
      );
    }
  }

  // @ValidateArgs(activateBookingValidationSchema)
  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async activate(
    ctx: ResolverContext,
    { id }: ActivateScheduledEventInput
  ): Promise<ScheduledEvent | Rejection> {
    const scheduledEvent = await this.scheduledEventDataSource.get(id);
    if (!scheduledEvent) {
      return rejection('NOT_FOUND');
    }

    const allProposalBookingEquipmentEvents =
      await this.equipmentDataSource.equipmentEventsByScheduledEventId(
        scheduledEvent.id
      );

    const allEquipmentsAccepted = allProposalBookingEquipmentEvents.every(
      (event) => event.status === EquipmentAssignmentStatus.ACCEPTED
    );

    if (!scheduledEvent) {
      return rejection('NOT_FOUND');
    }

    if (!allEquipmentsAccepted) {
      return rejection('NOT_ALLOWED');
    }

    if (
      !(await instrumentScientistHasAccess(
        ctx,
        scheduledEvent.proposalBookingId!
      ))
    ) {
      return rejection('NOT_ALLOWED');
    }

    const result = await this.scheduledEventDataSource
      .activate(id)
      .catch((error: Error) => {
        logger.logException('Scheduled event activate failed', error);

        return rejection('INTERNAL_ERROR');
      });

    await this.handleProposalBookingStatusChange(
      scheduledEvent.proposalBookingId!
    );

    return result;
  }

  // @ValidateArgs(finalizeBookingValidationSchema)
  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async finalize(
    ctx: ResolverContext,
    { action, id }: FinalizeScheduledEventInput
  ): Promise<ScheduledEvent | Rejection> {
    const scheduledEvent = await this.scheduledEventDataSource.get(id);

    if (!scheduledEvent) {
      return rejection('NOT_FOUND');
    }

    if (
      !(await instrumentScientistHasAccess(
        ctx,
        scheduledEvent.proposalBookingId!
      ))
    ) {
      return rejection('NOT_ALLOWED');
    }

    const result = await this.scheduledEventDataSource
      .finalize(id, action)
      .catch((error: Error) => {
        logger.logException('Scheduled event finalize failed', error);

        return rejection('INTERNAL_ERROR');
      });

    await this.handleProposalBookingStatusChange(
      scheduledEvent.proposalBookingId!,
      action
    );

    return result;
  }
}
