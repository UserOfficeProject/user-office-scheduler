import { ResolverContext } from '../context';
import { LostTimeDataSource } from '../datasources/LostTimeDataSource';
import Authorized from '../decorators/Authorized';
import { LostTime } from '../models/LostTime';

export default class LostTimeQueries {
  constructor(private lostTimeDataSource: LostTimeDataSource) {}

  @Authorized([])
  proposalBookingLostTimes(
    ctx: ResolverContext,
    proposalBookingId: number
  ): Promise<LostTime[]> {
    return this.lostTimeDataSource.proposalBookingLostTimes(proposalBookingId);
  }
}
