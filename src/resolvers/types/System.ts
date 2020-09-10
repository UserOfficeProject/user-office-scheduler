/* eslint-disable @typescript-eslint/no-explicit-any */
/*eslint @typescript-eslint/no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/
import { ObjectType, Field, ID, Directive } from 'type-graphql';

import { ResolverContext } from '../../context';
import {
  System as SystemBase,
  DbStat as DbStatBase,
} from '../../models/System';

@ObjectType()
export class DbStat implements DbStatBase {
  @Field(() => Number)
  public total: number;

  @Field(() => String, { nullable: true })
  public state: string | null;
}

@ObjectType()
// Just for testing
@Directive('@key(fields: "id")')
export class System implements Partial<SystemBase> {
  @Field(() => ID)
  public id: string;

  @Field(() => String)
  public message: string;

  @Field(() => [DbStat])
  public dbStats: DbStat[];
}

// example
export async function resolveSystemReference(
  reference: Pick<System, 'id'>,
  _args: any,
  _ctx: ResolverContext
): Promise<System> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return ([] as System[]).find(s => s.id === reference.id)!;
}
