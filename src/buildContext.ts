import { BasicResolverContext } from './context';
// Site specific imports (only ESS atm)
import {
  lostTimeDataSource,
  proposalBookingDataSource,
  scheduledEventDataSource,
  systemDataSource,
} from './datasources';
import LostTimeMutations from './mutations/LostTimeMutations';
import ProposalBookingMutations from './mutations/ProposalBookingMutations';
import ScheduledEventMutations from './mutations/ScheduledEventMutations';
import SystemMutations from './mutations/SystemMutations';
import LostTimeQueries from './queries/LostTimeQueries';
import ProposalBookingQueries from './queries/ProposalBookingQueries';
import ScheduledEventQueries from './queries/ScheduledEventQueries';
import SystemQueries from './queries/SystemQueries';

const systemQueries = new SystemQueries(systemDataSource);
const systemMutations = new SystemMutations(systemDataSource);

const scheduledEventQueries = new ScheduledEventQueries(
  scheduledEventDataSource
);
const scheduledEventMutations = new ScheduledEventMutations(
  scheduledEventDataSource,
  proposalBookingDataSource
);

const proposalBookingQueries = new ProposalBookingQueries(
  proposalBookingDataSource
);
const proposalBookingMutations = new ProposalBookingMutations(
  proposalBookingDataSource
);

const lostTimeQueries = new LostTimeQueries(lostTimeDataSource);
const lostTimeMutations = new LostTimeMutations(
  lostTimeDataSource,
  proposalBookingDataSource
);

const context: BasicResolverContext = {
  queries: {
    lostTime: lostTimeQueries,
    proposalBooking: proposalBookingQueries,
    scheduledEvent: scheduledEventQueries,
    system: systemQueries,
  },
  mutations: {
    lostTime: lostTimeMutations,
    proposalBooking: proposalBookingMutations,
    scheduledEvent: scheduledEventMutations,
    system: systemMutations,
  },
};

export default context;
