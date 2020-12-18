import { registerEnumType } from 'type-graphql';

import { EquipmentAssignmentStatus } from '../models/Equipment';
import {
  ProposalBookingStatus,
  ProposalBookingFinalizeAction,
} from '../models/ProposalBooking';
import { ScheduledEventBookingType } from '../models/ScheduledEvent';

export const registerEnums = () => {
  registerEnumType(ScheduledEventBookingType, {
    name: 'ScheduledEventBookingType',
  });

  registerEnumType(ProposalBookingStatus, { name: 'ProposalBookingStatus' });
  registerEnumType(ProposalBookingFinalizeAction, {
    name: 'ProposalBookingFinalizeAction',
  });

  registerEnumType(EquipmentAssignmentStatus, {
    name: 'EquipmentAssignmentStatus',
  });
};
