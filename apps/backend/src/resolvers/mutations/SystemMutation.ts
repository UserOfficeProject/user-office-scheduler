import { Mutation, Ctx, Arg } from 'type-graphql';

import { ResolverContext } from '../../context';

export class SystemMutations {
  @Mutation(() => String)
  resetSchedulerDb(
    @Ctx() ctx: ResolverContext,
    @Arg('includeSeeds', () => Boolean, { nullable: true })
    includeSeeds?: boolean | null
  ) {
    return ctx.mutations.system.resetDb(ctx, includeSeeds === true);
  }
}
