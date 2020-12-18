import { Field, ObjectType } from 'type-graphql';

import { Response } from '../Decorators';
import { Equipment } from './Equipment';
import { LostTime } from './LostTime';
import { ProposalBooking } from './ProposalBooking';
import { ScheduledEvent } from './ScheduledEvent';

@ObjectType()
export class ResponseWrapBase<T> {
  @Field(() => String, { nullable: true })
  error: string;
}

@ObjectType()
export class ScheduledEventResponseWrap extends ResponseWrapBase<
  ScheduledEvent
> {
  @Response()
  @Field(() => ScheduledEvent, { nullable: true })
  scheduledEvent: ScheduledEvent;
}

@ObjectType()
export class ScheduledEventsResponseWrap extends ResponseWrapBase<
  ScheduledEvent
> {
  @Response()
  @Field(() => [ScheduledEvent], { nullable: true })
  scheduledEvent: ScheduledEvent[];
}

@ObjectType()
export class LostTimesResponseWrap extends ResponseWrapBase<LostTime> {
  @Response()
  @Field(() => [LostTime], { nullable: true })
  lostTime: LostTime[];
}

@ObjectType()
export class ProposalBookingResponseWrap extends ResponseWrapBase<
  ProposalBooking
> {
  @Response()
  @Field(() => ProposalBooking, { nullable: true })
  proposalBooking: ProposalBooking;
}

@ObjectType()
export class EquipmentResponseWrap extends ResponseWrapBase<Equipment> {
  @Response()
  @Field(() => Equipment, { nullable: true })
  equipment: Equipment;
}
