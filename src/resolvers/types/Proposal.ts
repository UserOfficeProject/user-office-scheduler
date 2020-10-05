import { Directive, Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Proposal {
  @Directive('@external')
  @Field(() => Int)
  public id: number;
}
