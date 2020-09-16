import ScheduledEventMutations from '../mutations/ScheduledEventMutations';
import SystemMutations from '../mutations/SystemMutations';
import ScheduledEventQueries from '../queries/ScheduledEventQueries';
import SystemQueries from '../queries/SystemQueries';

interface ResolverContextMutations {
  scheduledEvent: ScheduledEventMutations;
  system: SystemMutations;
}

interface ResolverContextQueries {
  scheduledEvent: ScheduledEventQueries;
  system: SystemQueries;
}

export interface BasicResolverContext {
  queries: ResolverContextQueries;
  mutations: ResolverContextMutations;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ResolverContext extends BasicResolverContext {}
