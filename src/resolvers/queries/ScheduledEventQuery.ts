import { Arg, Ctx, ID, Query, Resolver } from 'type-graphql';

import { ResolverContext } from '../../context';
import { ScheduledEvent } from '../types/ScheduledEvent';

@Resolver()
export class ScheduledEventQuery {
  @Query(() => ScheduledEvent, { nullable: true })
  scheduledEvent(
    @Ctx() context: ResolverContext,
    @Arg('id', () => ID)
    id: number
  ) {
    return context.queries.scheduledEvent.scheduledEvent(id);
  }
}
