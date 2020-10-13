import { Field, ID, ObjectType } from 'type-graphql';

import { LostTime as LostTimeBase } from '../../models/LostTime';
import { TzLessDateTime } from '../CustomScalars';

@ObjectType()
export class LostTime implements Partial<LostTimeBase> {
  @Field(() => ID)
  id: number;

  @Field(() => ID)
  proposalBookingId: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => TzLessDateTime)
  startsAt: Date;

  @Field(() => TzLessDateTime)
  endsAt: Date;
}
