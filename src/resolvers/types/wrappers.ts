import { Field, ObjectType } from 'type-graphql';

import { Response } from '../Decorators';
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
