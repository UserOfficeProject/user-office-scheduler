import { getSdk } from '../generated/sdk';
import LostTimeMutations from '../mutations/LostTimeMutations';
import ProposalBookingMutations from '../mutations/ProposalBookingMutations';
import ScheduledEventMutations from '../mutations/ScheduledEventMutations';
import SystemMutations from '../mutations/SystemMutations';
import LostTimeQueries from '../queries/LostTimeQueries';
import ProposalBookingQueries from '../queries/ProposalBookingQueries';
import ScheduledEventQueries from '../queries/ScheduledEventQueries';
import SystemQueries from '../queries/SystemQueries';
import { Rejection } from '../rejection';
import { User, Role } from '../types/shared';

interface ResolverContextMutations {
  lostTime: LostTimeMutations;
  proposalBooking: ProposalBookingMutations;
  scheduledEvent: ScheduledEventMutations;
  system: SystemMutations;
}

interface ResolverContextQueries {
  lostTime: LostTimeQueries;
  proposalBooking: ProposalBookingQueries;
  scheduledEvent: ScheduledEventQueries;
  system: SystemQueries;
}

export interface BasicResolverContext {
  queries: ResolverContextQueries;
  mutations: ResolverContextMutations;
  user?: User;
  roles?: Role[];
  clients: {
    userOffice: () => ReturnType<typeof getSdk>;
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ResolverContext extends BasicResolverContext {}
