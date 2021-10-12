import { Arg, Ctx, Int, Query, Resolver } from 'type-graphql';

import { ResolverContext } from '../../context';
import { ProposalBooking } from '../types/ProposalBooking';

@Resolver()
export class ProposalBookingQuery {
  @Query(() => [ProposalBooking])
  instrumentProposalBookings(
    @Ctx() ctx: ResolverContext,
    @Arg('instrumentIds', () => [Int]) instrumentIds: number[]
  ) {
    return ctx.queries.proposalBooking.instrumentProposalBookings(
      ctx,
      instrumentIds
    );
  }

  @Query(() => ProposalBooking, { nullable: true })
  proposalBooking(
    @Ctx() ctx: ResolverContext,
    @Arg('id', () => Int) id: number
  ) {
    return ctx.queries.proposalBooking.get(ctx, id);
  }
}
