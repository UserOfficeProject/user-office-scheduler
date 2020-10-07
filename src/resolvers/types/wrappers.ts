import { Field, ObjectType } from 'type-graphql';

import { Response } from '../Decorators';
import { LostTime } from './LostTime';
import { ProposalBooking } from './ProposalBooking';
import { ScheduledEvent } from './ScheduledEvent';

@ObjectType()
export class ResponseWrapBase<T> {
  @Field(() => String, { nullable: true })
  public error: string;
}

@ObjectType()
export class ScheduledEventResponseWrap extends ResponseWrapBase<
  ScheduledEvent
> {
  @Response()
  @Field(() => ScheduledEvent, { nullable: true })
  public scheduledEvent: ScheduledEvent;
}

@ObjectType()
export class ScheduledEventsResponseWrap extends ResponseWrapBase<
  ScheduledEvent
> {
  @Response()
  @Field(() => [ScheduledEvent], { nullable: true })
  public scheduledEvent: ScheduledEvent[];
}

@ObjectType()
export class LostTimesResponseWrap extends ResponseWrapBase<LostTime> {
  @Response()
  @Field(() => [LostTime], { nullable: true })
  public lostTime: LostTime[];
}

@ObjectType()
export class ProposalBookingResponseWrap extends ResponseWrapBase<
  ProposalBooking
> {
  @Response()
  @Field(() => ProposalBooking, { nullable: true })
  public proposalBooking: ProposalBooking;
}
