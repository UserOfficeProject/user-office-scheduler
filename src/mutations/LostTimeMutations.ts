import { logger } from '@esss-swap/duo-logger';

import { ResolverContext } from '../context';
import { LostTimeDataSource } from '../datasources/LostTimeDataSource';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import Authorized from '../decorators/Authorized';
import { LostTime } from '../models/LostTime';
import { ProposalBookingStatus } from '../models/ProposalBooking';
import { rejection, Rejection } from '../rejection';
import { BulkUpsertLostTimesInput } from '../resolvers/mutations/LostTimeMutation';

export default class LostTimeMutations {
  constructor(
    private lostTimeDataSource: LostTimeDataSource,
    private proposalBookingDataSource: ProposalBookingDataSource
  ) {}

  @Authorized([])
  async bulkUpsert(
    ctx: ResolverContext,
    bulkUpsertLostTimes: BulkUpsertLostTimesInput
  ): Promise<LostTime[] | Rejection> {
    const proposalBooking = await this.proposalBookingDataSource.get(
      bulkUpsertLostTimes.proposalBookingId
    );

    if (
      !proposalBooking ||
      proposalBooking.status !== ProposalBookingStatus.BOOKED
    ) {
      return rejection('NOT_FOUND');
    }

    return this.lostTimeDataSource
      .bulkUpsert(bulkUpsertLostTimes)
      .catch((error: Error) => {
        logger.logException('LostTime bulkUpsert failed', error);

        return rejection('INTERNAL_ERROR');
      });
  }
}
