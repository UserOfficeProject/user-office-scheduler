import { Directive, Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Directive('@external')
  @Field(() => Int)
  public id: number;
}
