import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Resolver,
} from 'type-graphql';

import { ResolverContext } from '../../context';
import {
  ScheduledEvent as ScheduledEventBase,
  ScheduledEventBookingType,
} from '../../models/ScheduledEvent';
import { TzLessDateTime } from '../CustomScalars';
import {
  ScheduledEventResponseWrap,
  ScheduledEventsResponseWrap,
} from '../types/wrappers';
import { wrapResponse } from '../wrapResponse';

@InputType()
export class NewScheduledEventInput implements Partial<ScheduledEventBase> {
  @Field(() => ScheduledEventBookingType)
  bookingType: ScheduledEventBookingType;

  @Field(() => TzLessDateTime)
  startsAt: Date;

  @Field(() => TzLessDateTime)
  endsAt: Date;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => Int)
  instrumentId: number;
}

@InputType()
export class SimpleScheduledEventInput {
  @Field(() => Int)
  id: number;

  @Field(() => TzLessDateTime)
  startsAt: Date;

  @Field(() => TzLessDateTime)
  endsAt: Date;

  @Field(() => Boolean, { nullable: true })
  newlyCreated?: boolean;
}

@InputType()
export class BulkUpsertScheduledEventsInput {
  @Field(() => Int)
  proposalBookingId: number;

  @Field(() => [SimpleScheduledEventInput])
  scheduledEvents: SimpleScheduledEventInput[];
}

@Resolver()
export class ScheduledEventMutation {
  @Mutation(() => ScheduledEventResponseWrap)
  createScheduledEvent(
    @Ctx() ctx: ResolverContext,
    @Arg('newScheduledEvent', () => NewScheduledEventInput)
    newScheduledEvent: NewScheduledEventInput
  ) {
    return wrapResponse(
      ctx.mutations.scheduledEvent.create(ctx, newScheduledEvent),
      ScheduledEventResponseWrap
    );
  }

  @Mutation(() => ScheduledEventsResponseWrap)
  bulkUpsertScheduledEvents(
    @Ctx() ctx: ResolverContext,
    @Arg('bulkUpsertScheduledEvents', () => BulkUpsertScheduledEventsInput)
    bulkUpsertScheduledEvents: BulkUpsertScheduledEventsInput
  ) {
    return wrapResponse(
      ctx.mutations.scheduledEvent.bulkUpsert(ctx, bulkUpsertScheduledEvents),
      ScheduledEventResponseWrap
    );
  }
}
