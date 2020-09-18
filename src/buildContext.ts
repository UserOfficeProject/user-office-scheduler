import { BasicResolverContext } from './context';
// Site specific imports (only ESS atm)
import { systemDataSource, scheduledEventDataSource } from './datasources';
import ScheduledEventMutations from './mutations/ScheduledEventMutations';
import SystemMutations from './mutations/SystemMutations';
import ScheduledEventQueries from './queries/ScheduledEventQueries';
import SystemQueries from './queries/SystemQueries';

// From this point nothing is site-specific
const systemQueries = new SystemQueries(systemDataSource);
const systemMutations = new SystemMutations(systemDataSource);

// From this point nothing is site-specific
const scheduledEventQueries = new ScheduledEventQueries(
  scheduledEventDataSource
);
const scheduledEventMutations = new ScheduledEventMutations(
  scheduledEventDataSource
);

const context: BasicResolverContext = {
  queries: {
    scheduledEvent: scheduledEventQueries,
    system: systemQueries,
  },
  mutations: {
    scheduledEvent: scheduledEventMutations,
    system: systemMutations,
  },
};

export default context;
