import { Field, ObjectType } from 'type-graphql';

import { Equipment } from './Equipment';
import { LostTime } from './LostTime';
import { ProposalBooking } from './ProposalBooking';
import { Rejection } from './Rejection';
import { ScheduledEvent } from './ScheduledEvent';
import { ScheduledEventWithRejection } from './ScheduledEventWithRejection';
import { Response } from '../Decorators';

@ObjectType()
export class ResponseWrapBase {
  @Field(() => String, { nullable: true })
  error: string;
}

@ObjectType()
export class SchedulerSuccessResponseWrap extends ResponseWrapBase {
  @Response()
  @Field(() => Boolean, { nullable: true })
  public isSuccess: boolean;
}

@ObjectType()
export class ScheduledEventResponseWrap extends ResponseWrapBase {
  @Response()
  @Field(() => ScheduledEvent, { nullable: true })
  scheduledEvent: ScheduledEvent;
}

@ObjectType()
export class ScheduledEventsResponseWrap extends ResponseWrapBase {
  @Response()
  @Field(() => [ScheduledEventWithRejection])
  scheduledEvents: (ScheduledEvent | Rejection)[];
}

@ObjectType()
export class LostTimesResponseWrap extends ResponseWrapBase {
  @Response()
  @Field(() => [LostTime], { nullable: true })
  lostTime: LostTime[];
}

@ObjectType()
export class LostTimeResponseWrap extends ResponseWrapBase {
  @Response()
  @Field(() => LostTime, { nullable: true })
  lostTime: LostTime;
}

@ObjectType()
export class ProposalBookingResponseWrap extends ResponseWrapBase {
  @Response()
  @Field(() => ProposalBooking, { nullable: true })
  proposalBooking: ProposalBooking;
}

@ObjectType()
export class EquipmentResponseWrap extends ResponseWrapBase {
  @Response()
  @Field(() => Equipment, { nullable: true })
  equipment: Equipment;
}
