import {
  Directive,
  Field,
  Int,
  ObjectType,
  FieldResolver,
  Resolver,
  Ctx,
  Root,
  InputType,
  Arg,
} from 'type-graphql';

import { ResolverContext } from '../../context';
import { ProposalBookingStatus } from '../../models/ProposalBooking';
import { ProposalBooking } from './ProposalBooking';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Proposal {
  @Directive('@external')
  @Field(() => Int)
  id: number;
}

@InputType()
export class ProposalProposalBookingFilter {
  @Field(() => [ProposalBookingStatus], { nullable: true })
  status?: ProposalBookingStatus[] | null;
}

@Resolver(() => Proposal)
export class ProposalResolvers {
  @FieldResolver(() => ProposalBooking, { nullable: true })
  proposalBooking(
    @Ctx() ctx: ResolverContext,
    @Root() proposal: Proposal,
    @Arg('filter', () => ProposalProposalBookingFilter, { nullable: true })
    filter?: ProposalProposalBookingFilter
  ) {
    return ctx.queries.proposalBooking.getByProposalPk(
      ctx,
      proposal.id,
      filter
    );
  }
}
