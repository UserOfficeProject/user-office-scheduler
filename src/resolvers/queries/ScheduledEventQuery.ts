import {
  Arg,
  Ctx,
  Field,
  ID,
  InputType,
  Query,
  Resolver,
  Int,
} from 'type-graphql';

import { ResolverContext } from '../../context';
import { TzLessDateTime } from '../CustomScalars';
import { EquipmentScheduledEvent } from '../types/EquipmentScheduledEvent';
import { ScheduledEvent } from '../types/ScheduledEvent';

@InputType()
export class ScheduledEventFilter {
  @Field(() => TzLessDateTime, { nullable: true })
  startsAt?: Date | null;

  @Field(() => TzLessDateTime, { nullable: true })
  endsAt?: Date | null;

  @Field(() => ID, { nullable: true })
  instrumentId?: number | null;
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
    @Arg('id', () => ID)
    id: number
  ): Promise<ScheduledEvent | null> {
    return ctx.queries.scheduledEvent.scheduledEvent(ctx, id);
  }

  @Query(() => [ScheduledEvent])
  proposalBookingScheduledEvents(
    @Ctx() ctx: ResolverContext,
    @Arg('proposalBookingId', () => ID) proposalBookingId: number
  ): Promise<ScheduledEvent[]> {
    return ctx.queries.scheduledEvent.proposalBookingScheduledEvents(
      ctx,
      proposalBookingId
    );
  }

  @Query(() => ScheduledEvent, { nullable: true })
  proposalBookingScheduledEvent(
    @Ctx() ctx: ResolverContext,
    @Arg('proposalBookingId', () => ID) proposalBookingId: number,
    @Arg('scheduledEventId', () => ID) scheduledEventId: number
  ): Promise<ScheduledEvent | null> {
    return ctx.queries.scheduledEvent.proposalBookingScheduledEvent(
      ctx,
      proposalBookingId,
      scheduledEventId
    );
  }

  @Query(() => [EquipmentScheduledEvent])
  equipmentScheduledEvents(
    @Ctx() ctx: ResolverContext,
    @Arg('equipmentIds', () => [Int]) equipmentIds: number[],
    @Arg('startsAt', () => TzLessDateTime) startsAt: Date,
    @Arg('endsAt', () => TzLessDateTime) endsAt: Date
  ): Promise<ScheduledEvent[]> {
    return ctx.queries.scheduledEvent.equipmentScheduledEvents(
      ctx,
      equipmentIds,
      startsAt,
      endsAt
    );
  }
}
