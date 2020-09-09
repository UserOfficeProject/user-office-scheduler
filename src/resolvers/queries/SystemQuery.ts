import { Resolver, Query, Ctx } from 'type-graphql';

import { ResolverContext } from '../../context';
import { System } from '../types/System';

@Resolver(() => System)
export class SystemQuery {
  @Query(() => System)
  healthCheck(@Ctx() ctx: ResolverContext) {
    return ctx.queries.system.healthCheck();
  }
}
