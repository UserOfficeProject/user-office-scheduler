import { BasicResolverContext } from './context';
// Site specific imports (only ESS atm)
import {
  systemDataSource,
  scheduledEventDataSource,
  proposalBookingDataSource,
} from './datasources';
import ScheduledEventMutations from './mutations/ScheduledEventMutations';
import SystemMutations from './mutations/SystemMutations';
import ProposalBookingQueries from './queries/ProposalBookingQueries';
import ScheduledEventQueries from './queries/ScheduledEventQueries';
import SystemQueries from './queries/SystemQueries';

const systemQueries = new SystemQueries(systemDataSource);
const systemMutations = new SystemMutations(systemDataSource);

const scheduledEventQueries = new ScheduledEventQueries(
  scheduledEventDataSource
);
const scheduledEventMutations = new ScheduledEventMutations(
  scheduledEventDataSource
);

const proposalBookingQueries = new ProposalBookingQueries(
  proposalBookingDataSource
);

const context: BasicResolverContext = {
  queries: {
    proposalBooking: proposalBookingQueries,
    scheduledEvent: scheduledEventQueries,
    system: systemQueries,
  },
  mutations: {
    scheduledEvent: scheduledEventMutations,
    system: systemMutations,
  },
};

export default context;
