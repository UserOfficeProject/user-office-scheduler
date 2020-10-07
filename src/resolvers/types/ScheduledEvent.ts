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
  id: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => ScheduledEventBookingType)
  bookingType: ScheduledEventBookingType;

  @Field(() => TzLessDateTime)
  startsAt: Date;

  @Field(() => TzLessDateTime)
  endsAt: Date;

  // external type
  @Type(() => User)
  @Field()
  scheduledBy: User;

  @Field(() => String, { nullable: true })
  description: string;
}
