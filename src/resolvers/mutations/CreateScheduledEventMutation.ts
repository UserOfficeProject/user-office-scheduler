import {
  Arg,
  Ctx,
  Field,
  ID,
  InputType,
  Mutation,
  Resolver,
} from 'type-graphql';

import { ResolverContext } from '../../context';
import {
  ScheduledEvent as ScheduledEventBase,
  ScheduledEventBookingType,
} from '../../models/ScheduledEvent';
import { TzLessDateTime } from '../CustomScalars';
import { ScheduledEventResponseWrap } from '../types/wrappers';
import { wrapResponse } from '../wrapResponse';

@InputType()
export class NewScheduledEventInput implements Partial<ScheduledEventBase> {
  @Field(() => ScheduledEventBookingType)
  bookingType: ScheduledEventBookingType;

  @Field(() => TzLessDateTime)
  startsAt: Date;

  @Field(() => TzLessDateTime)
  endsAt: Date;

  @Field(() => ID)
  scheduledById: number;

  @Field(() => String, { nullable: true })
  description: string | null;
}

@Resolver()
export class CreateScheduledEventMutation {
  @Mutation(() => ScheduledEventResponseWrap)
  createScheduledEvent(
    @Ctx() ctx: ResolverContext,
    @Arg('newScheduledEvent', () => NewScheduledEventInput)
    newScheduledEvent: NewScheduledEventInput
  ) {
    return wrapResponse(
      ctx.mutations.scheduledEvent.create(newScheduledEvent),
      ScheduledEventResponseWrap
    );
  }
}
