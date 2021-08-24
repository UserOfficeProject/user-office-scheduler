import { Arg, Ctx, Int, Query, Resolver } from 'type-graphql';

import { ResolverContext } from '../../context';
import { LostTime } from '../types/LostTime';

@Resolver()
export class LostTimeQuery {
  @Query(() => [LostTime])
  proposalBookingLostTimes(
    @Ctx() ctx: ResolverContext,
    @Arg('proposalBookingId', () => Int) proposalBookingId: number
  ) {
    return ctx.queries.lostTime.proposalBookingLostTimes(
      ctx,
      proposalBookingId
    );
  }
}
