import { logger } from '@esss-swap/duo-logger';
import {
  createScheduledEventValidationSchema,
  updateScheduledEventValidationSchema,
  activateBookingValidationSchema,
  finalizeBookingValidationSchema,
} from '@esss-swap/duo-validation';

import { ResolverContext } from '../context';
import { EquipmentDataSource } from '../datasources/EquipmentDataSource';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import { ScheduledEventDataSource } from '../datasources/ScheduledEventDataSource';
import Authorized from '../decorators/Authorized';
import EventBus from '../decorators/EventBus';
import ValidateArgs from '../decorators/ValidateArgs';
import { Event, ProposalBookingStatusCore } from '../generated/sdk';
import { instrumentScientistHasInstrument } from '../helpers/instrumentHelpers';
import { instrumentScientistHasAccess } from '../helpers/permissionHelpers';
import { EquipmentAssignmentStatus } from '../models/Equipment';
import { ProposalBookingFinalizeAction } from '../models/ProposalBooking';
import {
  ScheduledEvent,
  CalendarExplicitBookableTypes,
} from '../models/ScheduledEvent';
import { rejection, Rejection } from '../rejection';
import {
  ActivateScheduledEventInput,
  DeleteScheduledEventsInput,
  FinalizeScheduledEventInput,
  NewScheduledEventInput,
  UpdateScheduledEventInput,
} from '../resolvers/mutations/ScheduledEventMutation';
import { Roles, User } from '../types/shared';

export default class ScheduledEventMutations {
  constructor(
    private scheduledEventDataSource: ScheduledEventDataSource,
    private proposalBookingDataSource: ProposalBookingDataSource,
    private equipmentDataSource: EquipmentDataSource
  ) {}

  @EventBus(Event.PROPOSAL_BOOKING_TIME_SLOT_ADDED)
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

  @EventBus(Event.PROPOSAL_BOOKING_TIME_SLOTS_REMOVED)
  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async delete(
    ctx: ResolverContext,
    deleteScheduledEvents: DeleteScheduledEventsInput
  ): Promise<ScheduledEvent[] | Rejection> {
    const hasInstrument = await instrumentScientistHasInstrument(
      ctx,
      deleteScheduledEvents.instrumentId
    );
    if (!hasInstrument) {
      return rejection('NOT_ALLOWED');
    }

    return this.scheduledEventDataSource
      .delete(deleteScheduledEvents)
      .catch((error) => {
        logger.logException('Could not delete scheduled event', error, {
          deleteScheduledEvents,
        });

        return rejection('INTERNAL_ERROR');
      });
  }

  @EventBus(Event.PROPOSAL_BOOKING_TIME_UPDATED)
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
      scheduledEvent.status !== ProposalBookingStatusCore.DRAFT ||
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

    const allProposalBookingEventsAreActive = scheduledEvents.every(
      (scheduledEventItem) =>
        scheduledEventItem.status === ProposalBookingStatusCore.ACTIVE
    );

    const allProposalBookingEventsAreCompleted = scheduledEvents.every(
      (scheduledEventItem) =>
        scheduledEventItem.status === ProposalBookingStatusCore.COMPLETED
    );

    const allProposalBookingEventsNotDraft = scheduledEvents.every(
      (scheduledEventItem) =>
        scheduledEventItem.status !== ProposalBookingStatusCore.DRAFT
    );

    if (allProposalBookingEventsAreCompleted) {
      await this.proposalBookingDataSource.finalize(
        ProposalBookingFinalizeAction.COMPLETE,
        proposalBookingId
      );
    } else if (allProposalBookingEventsAreActive) {
      await this.proposalBookingDataSource.activate(proposalBookingId);
    } else if (action && action === ProposalBookingFinalizeAction.RESTART) {
      await this.proposalBookingDataSource.finalize(
        ProposalBookingFinalizeAction.RESTART,
        proposalBookingId
      );
    } else if (allProposalBookingEventsNotDraft) {
      await this.proposalBookingDataSource.activate(proposalBookingId);
    }
  }

  @EventBus(Event.PROPOSAL_BOOKING_TIME_ACTIVATED)
  @ValidateArgs(activateBookingValidationSchema)
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

    if (!scheduledEvent || !scheduledEvent.proposalBookingId) {
      return rejection('NOT_FOUND');
    }

    if (!allEquipmentsAccepted) {
      return rejection('NOT_ALLOWED');
    }

    if (
      !(await instrumentScientistHasAccess(
        ctx,
        scheduledEvent.proposalBookingId
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
      scheduledEvent.proposalBookingId
    );

    return result;
  }

  @EventBus(Event.PROPOSAL_BOOKING_TIME_COMPLETED)
  @ValidateArgs(finalizeBookingValidationSchema)
  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async finalize(
    ctx: ResolverContext,
    { action, id }: FinalizeScheduledEventInput
  ): Promise<ScheduledEvent | Rejection> {
    const scheduledEvent = await this.scheduledEventDataSource.get(id);

    if (!scheduledEvent || !scheduledEvent.proposalBookingId) {
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

    const result = await this.scheduledEventDataSource
      .finalize(id, action)
      .catch((error: Error) => {
        logger.logException('Scheduled event finalize failed', error);

        return rejection('INTERNAL_ERROR');
      });

    await this.handleProposalBookingStatusChange(
      scheduledEvent.proposalBookingId,
      action
    );

    return result;
  }

  @EventBus(Event.PROPOSAL_BOOKING_TIME_REOPENED)
  @ValidateArgs(activateBookingValidationSchema)
  @Authorized([Roles.USER_OFFICER])
  async reopen(
    ctx: ResolverContext,
    { id }: ActivateScheduledEventInput
  ): Promise<ScheduledEvent | Rejection> {
    const scheduledEvent = await this.scheduledEventDataSource.get(id);
    if (!scheduledEvent) {
      return rejection('NOT_FOUND');
    }

    if (!scheduledEvent || !scheduledEvent.proposalBookingId) {
      return rejection('NOT_FOUND');
    }

    const proposalBooking = await this.proposalBookingDataSource.get(
      scheduledEvent.proposalBookingId
    );

    if (!proposalBooking) {
      return rejection('NOT_FOUND');
    }

    const result = await this.scheduledEventDataSource
      .reopen(id)
      .catch((error: Error) => {
        logger.logException('Scheduled event re-opening failed', error);

        return rejection('INTERNAL_ERROR');
      });

    if (proposalBooking.status === ProposalBookingStatusCore.COMPLETED) {
      await this.proposalBookingDataSource.reopen(
        scheduledEvent.proposalBookingId
      );
    }

    return result;
  }
}
