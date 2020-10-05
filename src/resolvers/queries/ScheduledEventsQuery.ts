import { Arg, Ctx, Field, ID, InputType, Query, Resolver } from 'type-graphql';

import { ResolverContext } from '../../context';
import { TzLessDateTime } from '../CustomScalars';
import { ScheduledEvent } from '../types/ScheduledEvent';

@InputType()
export class ScheduledEventFilter {
  @Field(() => TzLessDateTime, { nullable: true })
  public startsAt: Date;

  @Field(() => TzLessDateTime, { nullable: true })
  public endsAt: Date;
}

@Resolver()
export class ScheduledEventsQuery {
  @Query(() => [ScheduledEvent])
  scheduledEvents(
    @Ctx() context: ResolverContext,
    @Arg('filter', () => ScheduledEventFilter, { nullable: true })
    filter: ScheduledEventFilter
  ) {
    return context.queries.scheduledEvent.scheduledEvents(filter);
  }

  @Query(() => ScheduledEvent, { nullable: true })
  scheduledEvent(
    @Ctx() context: ResolverContext,
    @Arg('id', () => ID)
    id: number
  ) {
    return context.queries.scheduledEvent.scheduledEvent(id);
  }
}
