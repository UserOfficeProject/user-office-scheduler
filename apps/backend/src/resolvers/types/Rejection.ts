import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Rejection {
  @Field(() => String)
  reason: string;
}
