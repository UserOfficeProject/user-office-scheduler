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
import { ProposalBookingStatusCore } from '../../generated/sdk';
import { ProposalBooking } from './ProposalBooking';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "primaryKey")')
export class Proposal {
  @Directive('@external')
  @Field(() => Int)
  primaryKey: number;
}

@InputType()
export class ProposalProposalBookingFilter {
  @Field(() => [ProposalBookingStatusCore], { nullable: true })
  status?: ProposalBookingStatusCore[] | null;
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
      proposal.primaryKey,
      filter
    );
  }
}
