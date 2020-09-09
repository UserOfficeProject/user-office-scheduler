import { ObjectType, Field } from 'type-graphql';

import { System as SystemBase } from '../../models/System';

@ObjectType()
export class System implements Partial<SystemBase> {
  @Field(() => String)
  public message: string;
}
