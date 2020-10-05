import { Arg, Ctx, ID, Query, Resolver } from 'type-graphql';

import { ResolverContext } from '../../context';
import { ProposalBooking } from '../types/ProposalBooking';

@Resolver()
export class ProposalBookingsQuery {
  @Query(() => [ProposalBooking])
  instrumentProposalBookings(
    @Ctx() ctx: ResolverContext,
    @Arg('id', () => ID) id: number
  ) {
    return ctx.queries.proposalBooking.instrumentProposalBookings(id);
  }
}
