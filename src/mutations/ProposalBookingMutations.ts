import { logger } from '@esss-swap/duo-logger';
import * as Yup from 'yup';

import { ResolverContext } from '../context';
import { EquipmentDataSource } from '../datasources/EquipmentDataSource';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import Authorized from '../decorators/Authorized';
import ValidateArgs from '../decorators/ValidateArgs';
import { instrumentScientistHasAccess } from '../helpers/permissionHelpers';
import { EquipmentAssignmentStatus } from '../models/Equipment';
import {
  ProposalBooking,
  ProposalBookingFinalizeAction,
} from '../models/ProposalBooking';
import { Rejection, rejection } from '../rejection';
import { Roles } from '../types/shared';

const activateBookingValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
});

// NOTE: The action is validated by graphql
const finalizeBookingValidationSchema = Yup.object().shape({
  action: Yup.mixed().required(),
  id: Yup.number().required(),
});

export default class ProposalBookingMutations {
  constructor(
    private proposalBookingDataSource: ProposalBookingDataSource,
    private equipmentDataSource: EquipmentDataSource
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

    return this.proposalBookingDataSource
      .finalize(action, id)
      .catch((error: Error) => {
        logger.logException('ProposalBooking finalize failed', error);

        return rejection('INTERNAL_ERROR');
      });
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

    return this.proposalBookingDataSource.activate(id).catch((error: Error) => {
      logger.logException('ProposalBooking activate failed', error);

      return rejection('INTERNAL_ERROR');
    });
  }
}
