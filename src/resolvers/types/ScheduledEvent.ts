import { Type } from 'class-transformer';
import { Field, ID, ObjectType } from 'type-graphql';

import {
  ScheduledEvent as ScheduledEventBase,
  ScheduledEventBookingType,
} from '../../models/ScheduledEvent';
import { TzLessDateTime } from '../CustomScalars';
import { User } from './User';

@ObjectType()
export class ScheduledEvent implements Partial<ScheduledEventBase> {
  @Field(() => ID)
  public id: number;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;

  @Field(() => ScheduledEventBookingType)
  public bookingType: ScheduledEventBookingType;

  @Field(() => TzLessDateTime)
  public startsAt: Date;

  @Field(() => TzLessDateTime)
  public endsAt: Date;

  // external type
  @Type(() => User)
  @Field()
  public scheduledBy: User;

  @Field(() => String, { nullable: true })
  public description: string;
}
