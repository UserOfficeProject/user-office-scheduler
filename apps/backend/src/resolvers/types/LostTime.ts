import { Field, Int, ObjectType } from 'type-graphql';

import { LostTime as LostTimeBase } from '../../models/LostTime';
import { TzLessDateTime } from '../CustomScalars';

@ObjectType()
export class LostTime implements Partial<LostTimeBase> {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  proposalBookingId: number;

  @Field(() => Int)
  scheduledEventId: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => TzLessDateTime)
  startsAt: Date;

  @Field(() => TzLessDateTime)
  endsAt: Date;
}
