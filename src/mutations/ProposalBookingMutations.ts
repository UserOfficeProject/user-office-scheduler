import { logger } from '@esss-swap/duo-logger';

import { ResolverContext } from '../context';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import Authorized from '../decorators/Authorized';
import {
  ProposalBooking,
  ProposalBookingFinalizeAction,
} from '../models/ProposalBooking';
import { Rejection, rejection } from '../rejection';

export default class ProposalBookingMutations {
  constructor(private proposalBookingDataSource: ProposalBookingDataSource) {}

  @Authorized([])
  finalize(
    ctx: ResolverContext,
    action: ProposalBookingFinalizeAction,
    id: number
  ): Promise<ProposalBooking | Rejection> {
    return this.proposalBookingDataSource
      .finalize(action, id)
      .catch((error: Error) => {
        logger.logException('ProposalBooking finalize failed', error);

        return rejection('INTERNAL_ERROR');
      });
  }

  @Authorized([])
  activate(
    ctx: ResolverContext,
    id: number
  ): Promise<ProposalBooking | Rejection> {
    return this.proposalBookingDataSource.activate(id).catch((error: Error) => {
      logger.logException('ProposalBooking activate failed', error);

      return rejection('INTERNAL_ERROR');
    });
  }
}
