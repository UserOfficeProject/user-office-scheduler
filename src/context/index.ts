import { getSdk } from '../generated/sdk';
import EquipmentMutations from '../mutations/EquipmentMutations';
import LostTimeMutations from '../mutations/LostTimeMutations';
import ProposalBookingMutations from '../mutations/ProposalBookingMutations';
import ScheduledEventMutations from '../mutations/ScheduledEventMutations';
import SystemMutations from '../mutations/SystemMutations';
import EquipmentQueries from '../queries/EquipmentQueries';
import LostTimeQueries from '../queries/LostTimeQueries';
import ProposalBookingQueries from '../queries/ProposalBookingQueries';
import ScheduledEventQueries from '../queries/ScheduledEventQueries';
import SystemQueries from '../queries/SystemQueries';
import { User, Role } from '../types/shared';

interface ResolverContextMutations {
  equipment: EquipmentMutations;
  lostTime: LostTimeMutations;
  proposalBooking: ProposalBookingMutations;
  scheduledEvent: ScheduledEventMutations;
  system: SystemMutations;
}

interface ResolverContextQueries {
  equipment: EquipmentQueries;
  lostTime: LostTimeQueries;
  proposalBooking: ProposalBookingQueries;
  scheduledEvent: ScheduledEventQueries;
  system: SystemQueries;
}

export interface BasicResolverContext {
  isContext: true;
  queries: ResolverContextQueries;
  mutations: ResolverContextMutations;
  currentRole?: Role;
  user?: User;
  roles?: Role[];
  clients: {
    userOffice: () => ReturnType<typeof getSdk>;
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ResolverContext extends BasicResolverContext {}
