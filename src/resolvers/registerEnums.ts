import { registerEnumType } from 'type-graphql';

import { ProposalBookingStatusCore } from '../generated/sdk';
import { EquipmentAssignmentStatus } from '../models/Equipment';
import { ProposalBookingFinalizeAction } from '../models/ProposalBooking';
import { ScheduledEventBookingType } from '../models/ScheduledEvent';

export const registerEnums = () => {
  registerEnumType(ScheduledEventBookingType, {
    name: 'ScheduledEventBookingType',
  });

  registerEnumType(ProposalBookingStatusCore, {
    name: 'ProposalBookingStatusCore',
  });
  registerEnumType(ProposalBookingFinalizeAction, {
    name: 'ProposalBookingFinalizeAction',
  });

  registerEnumType(EquipmentAssignmentStatus, {
    name: 'EquipmentAssignmentStatus',
  });
};
