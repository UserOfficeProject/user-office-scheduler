import { Type } from 'class-transformer';
import {
  Field,
  Int,
  ObjectType,
  Resolver,
  FieldResolver,
  Root,
  Ctx,
  Arg,
  InputType,
} from 'type-graphql';

import { ResolverContext } from '../../context';
import {
  ProposalBooking as ProposalBookingBase,
  ProposalBookingStatus,
} from '../../models/ProposalBooking';
import { ScheduledEventBookingType } from '../../models/ScheduledEvent';
import { TzLessDateTime } from '../CustomScalars';
import { Call } from './Call';
import { Instrument } from './Instrument';
import { Proposal } from './Proposal';
import { ScheduledEvent } from './ScheduledEvent';

@ObjectType()
export class ProposalBooking implements Partial<ProposalBookingBase> {
  @Field(() => Int)
  id: number;

  @Type(() => Call)
  @Field({ nullable: true })
  call?: Call;

  @Type(() => Proposal)
  @Field({ nullable: true })
  proposal?: Proposal;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => ProposalBookingStatus)
  status: ProposalBookingStatus;

  @Field(() => Int)
  allocatedTime: number;

  @Type(() => Instrument)
  @Field({ nullable: true })
  instrument?: Instrument;
}

@InputType()
export class ProposalBookingScheduledEventFilter {
  @Field(() => ScheduledEventBookingType, { nullable: true })
  bookingType?: ScheduledEventBookingType | null;

  @Field(() => TzLessDateTime, { nullable: true })
  endsAfter?: Date;

  @Field(() => TzLessDateTime, { nullable: true })
  endsBefore?: Date;
}

@Resolver(() => ProposalBooking)
export class ProposalBookingResolvers {
  @FieldResolver(() => [ScheduledEvent])
  scheduledEvents(
    @Ctx() ctx: ResolverContext,
    @Root() proposalBooking: ProposalBooking,
    @Arg('filter') filter: ProposalBookingScheduledEventFilter
  ): Promise<ScheduledEvent[]> {
    return ctx.queries.scheduledEvent.proposalBookingScheduledEvents(
      ctx,
      proposalBooking.id,
      {
        ...filter,
        bookingType:
          filter.bookingType ?? ScheduledEventBookingType.USER_OPERATIONS,
      }
    );
  }
}
