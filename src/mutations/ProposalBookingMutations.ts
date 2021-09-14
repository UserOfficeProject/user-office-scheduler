import { logger } from '@esss-swap/duo-logger';
import {
  activateBookingValidationSchema,
  finalizeBookingValidationSchema,
} from '@esss-swap/duo-validation';

import { ResolverContext } from '../context';
import { EquipmentDataSource } from '../datasources/EquipmentDataSource';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import { ScheduledEventDataSource } from '../datasources/ScheduledEventDataSource';
import Authorized from '../decorators/Authorized';
import ValidateArgs from '../decorators/ValidateArgs';
import { instrumentScientistHasAccess } from '../helpers/permissionHelpers';
import { EquipmentAssignmentStatus } from '../models/Equipment';
import {
  ProposalBooking,
  ProposalBookingFinalizeAction,
  ProposalBookingStatus,
} from '../models/ProposalBooking';
import { Rejection, rejection } from '../rejection';
import { Roles } from '../types/shared';

export default class ProposalBookingMutations {
  constructor(
    private proposalBookingDataSource: ProposalBookingDataSource,
    private equipmentDataSource: EquipmentDataSource,
    private scheduledEventDataSource: ScheduledEventDataSource
  ) {}

  @ValidateArgs(finalizeBookingValidationSchema)
  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async finalize(
    ctx: ResolverContext,
    { action, id }: { action: ProposalBookingFinalizeAction; id: number }
  ): Promise<ProposalBooking | Rejection> {
    const proposalBooking = await this.proposalBookingDataSource.get(id);

    if (!proposalBooking) {
      return rejection('NOT_FOUND');
    }

    if (!(await instrumentScientistHasAccess(ctx, proposalBooking))) {
      return rejection('NOT_ALLOWED');
    }

    const result = await this.proposalBookingDataSource
      .finalize(action, id)
      .catch((error: Error) => {
        logger.logException('ProposalBooking finalize failed', error);

        return rejection('INTERNAL_ERROR');
      });

    if (result instanceof ProposalBooking) {
      const allScheduledEvents =
        await this.scheduledEventDataSource.proposalBookingScheduledEvents(
          proposalBooking.id
        );

      await Promise.all(
        allScheduledEvents
          .filter((event) => event.status !== ProposalBookingStatus.COMPLETED)
          .map(
            async (scheduledEvent) =>
              await this.scheduledEventDataSource.finalize(
                scheduledEvent.id,
                action
              )
          )
      );
    }

    return result;
  }

  @ValidateArgs(activateBookingValidationSchema)
  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async activate(
    ctx: ResolverContext,
    { id }: { id: number }
  ): Promise<ProposalBooking | Rejection> {
    const proposalBooking = await this.proposalBookingDataSource.get(id);
    const allProposalBookingEquipmentEvents =
      await this.equipmentDataSource.equipmentEventsByProposalBookingId(id);

    const allEquipmentsAccepted = allProposalBookingEquipmentEvents.every(
      (event) => event.status === EquipmentAssignmentStatus.ACCEPTED
    );

    if (!proposalBooking) {
      return rejection('NOT_FOUND');
    }

    if (!allEquipmentsAccepted) {
      return rejection('NOT_ALLOWED');
    }

    if (!(await instrumentScientistHasAccess(ctx, proposalBooking))) {
      return rejection('NOT_ALLOWED');
    }

    const result = await this.proposalBookingDataSource
      .activate(id)
      .catch((error: Error) => {
        logger.logException('ProposalBooking activate failed', error);

        return rejection('INTERNAL_ERROR');
      });

    if (result instanceof ProposalBooking) {
      const allScheduledEvents =
        await this.scheduledEventDataSource.proposalBookingScheduledEvents(
          proposalBooking.id
        );

      await Promise.all(
        allScheduledEvents.map(
          async (scheduledEvent) =>
            await this.scheduledEventDataSource.activate(scheduledEvent.id)
        )
      );
    }

    return result;
  }
}
