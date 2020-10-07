import { logger } from '@esss-swap/duo-logger';

import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import {
  ProposalBooking,
  ProposalBookingFinalizeAction,
} from '../models/ProposalBooking';
import { Rejection, rejection } from '../rejection';

export default class ProposalBookingMutations {
  constructor(private proposalBookingDataSource: ProposalBookingDataSource) {}

  finalize(
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

  activate(id: number): Promise<ProposalBooking | Rejection> {
    return this.proposalBookingDataSource.activate(id).catch((error: Error) => {
      logger.logException('ProposalBooking activate failed', error);

      return rejection('INTERNAL_ERROR');
    });
  }
}
