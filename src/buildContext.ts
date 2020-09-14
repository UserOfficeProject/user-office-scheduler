import { BasicResolverContext } from './context';
// Site specific imports (only ESS atm)
import { systemDataSource } from './datasources';
import SystemMutations from './mutations/SystemMutations';
import SystemQueries from './queries/SystemQueries';

// From this point nothing is site-specific
const systemQueries = new SystemQueries(systemDataSource);
const systemMutations = new SystemMutations(systemDataSource);

const context: BasicResolverContext = {
  queries: {
    system: systemQueries,
  },
  mutations: {
    system: systemMutations,
  },
};

export default context;
