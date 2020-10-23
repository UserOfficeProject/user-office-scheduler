import { ResolverContext } from '../context';
import { LostTimeDataSource } from '../datasources/LostTimeDataSource';
import Authorized from '../decorators/Authorized';
import { helperInstrumentScientistHasAccess } from '../helpers/instrumentHelpers';
import { LostTime } from '../models/LostTime';
import { Roles } from '../types/shared';

export default class LostTimeQueries {
  constructor(private lostTimeDataSource: LostTimeDataSource) {}

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async proposalBookingLostTimes(
    ctx: ResolverContext,
    proposalBookingId: number
  ): Promise<LostTime[]> {
    await helperInstrumentScientistHasAccess(ctx, proposalBookingId);

    return this.lostTimeDataSource.proposalBookingLostTimes(proposalBookingId);
  }
}
