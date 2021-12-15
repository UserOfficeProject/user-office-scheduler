import { Directive, Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Directive('@external')
  @Field(() => Int)
  id: number;
}

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class BasicUserDetails {
  @Directive('@external')
  @Field(() => Int)
  id: number;
}
