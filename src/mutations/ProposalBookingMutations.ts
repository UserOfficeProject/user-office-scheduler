import { logger } from '@esss-swap/duo-logger';

import { ResolverContext } from '../context';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import Authorized from '../decorators/Authorized';
import { helperInstrumentScientistHasAccess } from '../helpers/instrumentHelpers';
import {
  ProposalBooking,
  ProposalBookingFinalizeAction,
} from '../models/ProposalBooking';
import { Rejection, rejection } from '../rejection';
import { Roles } from '../types/shared';

export default class ProposalBookingMutations {
  constructor(private proposalBookingDataSource: ProposalBookingDataSource) {}

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

    await helperInstrumentScientistHasAccess(ctx, proposalBooking);

    return this.proposalBookingDataSource
      .finalize(action, id)
      .catch((error: Error) => {
        logger.logException('ProposalBooking finalize failed', error);

        return rejection('INTERNAL_ERROR');
      });
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async activate(
    ctx: ResolverContext,
    id: number
  ): Promise<ProposalBooking | Rejection> {
    const proposalBooking = await this.proposalBookingDataSource.get(id);

    if (!proposalBooking) {
      return rejection('NOT_FOUND');
    }

    await helperInstrumentScientistHasAccess(ctx, proposalBooking);

    return this.proposalBookingDataSource.activate(id).catch((error: Error) => {
      logger.logException('ProposalBooking activate failed', error);

      return rejection('INTERNAL_ERROR');
    });
  }
}
