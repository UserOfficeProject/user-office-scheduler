import { Directive, Field, ObjectType } from 'type-graphql';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "reason")')
export class Rejection {
  @Directive('@external')
  @Field(() => String)
  reason: string;
}
