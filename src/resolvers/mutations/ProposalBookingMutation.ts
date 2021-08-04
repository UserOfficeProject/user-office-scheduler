import { Arg, Ctx, ID, Mutation, Resolver } from 'type-graphql';

import { ResolverContext } from '../../context';
import { ProposalBookingFinalizeAction } from '../../models/ProposalBooking';
import { ProposalBookingResponseWrap } from '../types/wrappers';
import { wrapResponse } from '../wrapResponse';

@Resolver()
export class ProposalBookingMutation {
  @Mutation(() => ProposalBookingResponseWrap)
  finalizeProposalBooking(
    @Ctx() ctx: ResolverContext,
    @Arg('action', () => ProposalBookingFinalizeAction)
    action: ProposalBookingFinalizeAction,
    @Arg('id', () => ID) id: number
  ) {
    return wrapResponse(
      ctx.mutations.proposalBooking.finalize(ctx, { action, id }),
      ProposalBookingResponseWrap
    );
  }

  @Mutation(() => ProposalBookingResponseWrap)
  activateProposalBooking(
    @Ctx() ctx: ResolverContext,
    @Arg('id', () => ID) id: number
  ) {
    return wrapResponse(
      ctx.mutations.proposalBooking.activate(ctx, { id }),
      ProposalBookingResponseWrap
    );
  }
}
