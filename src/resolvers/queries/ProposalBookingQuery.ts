import { Arg, Ctx, ID, Query, Resolver } from 'type-graphql';

import { ResolverContext } from '../../context';
import { ProposalBooking } from '../types/ProposalBooking';

@Resolver()
export class ProposalBookingQuery {
  @Query(() => [ProposalBooking])
  instrumentProposalBookings(
    @Ctx() ctx: ResolverContext,
    @Arg('instrumentId', () => ID) instrumentId: number
  ) {
    return ctx.queries.proposalBooking.instrumentProposalBookings(instrumentId);
  }

  @Query(() => ProposalBooking, { nullable: true })
  proposalBooking(
    @Ctx() ctx: ResolverContext,
    @Arg('id', () => ID) id: number
  ) {
    return ctx.queries.proposalBooking.get(id);
  }
}
