import { Arg, Ctx, Field, InputType, Int, Query, Resolver } from 'type-graphql';

import { ResolverContext } from '../../context';
import { TzLessDateTime } from '../CustomScalars';
import { ScheduledEvent } from '../types/ScheduledEvent';

@InputType()
export class ScheduledEventFilter {
  @Field(() => TzLessDateTime)
  startsAt: Date | null;

  @Field(() => TzLessDateTime)
  endsAt: Date | null;

  @Field(() => [Int])
  instrumentIds: number[];

  @Field(() => [Int])
  localContactIds: number[];
}

@Resolver()
export class ScheduledEventQuery {
  @Query(() => [ScheduledEvent])
  scheduledEvents(
    @Ctx() ctx: ResolverContext,
    @Arg('filter', () => ScheduledEventFilter)
    filter: ScheduledEventFilter
  ) {
    return ctx.queries.scheduledEvent.scheduledEvents(ctx, filter);
  }

  @Query(() => ScheduledEvent, { nullable: true })
  scheduledEvent(
    @Ctx() ctx: ResolverContext,
    @Arg('id', () => Int)
    id: number
  ): Promise<ScheduledEvent | null> {
    return ctx.queries.scheduledEvent.scheduledEvent(ctx, id);
  }

  @Query(() => [ScheduledEvent])
  proposalBookingScheduledEvents(
    @Ctx() ctx: ResolverContext,
    @Arg('proposalBookingId', () => Int) proposalBookingId: number
  ): Promise<ScheduledEvent[]> {
    return ctx.queries.scheduledEvent.proposalBookingScheduledEvents(
      ctx,
      proposalBookingId
    );
  }

  @Query(() => ScheduledEvent, { nullable: true })
  proposalBookingScheduledEvent(
    @Ctx() ctx: ResolverContext,
    @Arg('proposalBookingId', () => Int) proposalBookingId: number,
    @Arg('scheduledEventId', () => Int) scheduledEventId: number
  ): Promise<ScheduledEvent | null> {
    return ctx.queries.scheduledEvent.proposalBookingScheduledEvent(
      ctx,
      proposalBookingId,
      scheduledEventId
    );
  }
}
