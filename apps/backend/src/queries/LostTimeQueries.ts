import { ResolverContext } from '../context';
import { LostTimeDataSource } from '../datasources/LostTimeDataSource';
import Authorized from '../decorators/Authorized';
import {
  instrumentScientistHasAccess,
  isApiToken,
} from '../helpers/permissionHelpers';
import { LostTime } from '../models/LostTime';
import { Roles } from '../types/shared';

export default class LostTimeQueries {
  constructor(private lostTimeDataSource: LostTimeDataSource) {}

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async proposalBookingLostTimes(
    ctx: ResolverContext,
    {
      proposalBookingId,
      scheduledEventId,
    }: {
      proposalBookingId: number;
      scheduledEventId?: number;
    }
  ): Promise<LostTime[]> {
    if (
      !(await instrumentScientistHasAccess(ctx, proposalBookingId)) &&
      !isApiToken(ctx)
    ) {
      return [];
    }

    return this.lostTimeDataSource.proposalBookingLostTimes(
      proposalBookingId,
      scheduledEventId
    );
  }
}
