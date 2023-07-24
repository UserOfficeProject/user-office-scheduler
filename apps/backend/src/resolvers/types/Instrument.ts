import { Directive, Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Instrument {
  @Directive('@external')
  @Field(() => Int)
  id: number;
}
