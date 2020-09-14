import SystemMutations from '../mutations/SystemMutations';
import SystemQueries from '../queries/SystemQueries';

interface ResolverContextMutations {
  system: SystemMutations;
}

interface ResolverContextQueries {
  system: SystemQueries;
}

export interface BasicResolverContext {
  queries: ResolverContextQueries;
  mutations: ResolverContextMutations;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ResolverContext extends BasicResolverContext {}
