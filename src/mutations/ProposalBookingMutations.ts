import { logger } from '@esss-swap/duo-logger';
import * as Yup from 'yup';

import { ResolverContext } from '../context';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import Authorized from '../decorators/Authorized';
import ValidateArgs from '../decorators/ValidateArgs';
import { instrumentScientistHasAccess } from '../helpers/permissionHelpers';
import {
  ProposalBooking,
  ProposalBookingFinalizeAction,
} from '../models/ProposalBooking';
import { Rejection, rejection } from '../rejection';
import { Roles } from '../types/shared';

export default class ProposalBookingMutations {
  constructor(private proposalBookingDataSource: ProposalBookingDataSource) {}

  // the action is validated by graphql
  @ValidateArgs(Yup.mixed().required(), Yup.number().required())
  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async finalize(
    ctx: ResolverContext,
    action: ProposalBookingFinalizeAction,
    id: number
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

  @ValidateArgs(Yup.number().required())
  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async activate(
    ctx: ResolverContext,
    id: number
  ): Promise<ProposalBooking | Rejection> {
    const proposalBooking = await this.proposalBookingDataSource.get(id);

    if (!proposalBooking) {
      return rejection('NOT_FOUND');
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
