import { registerEnumType } from 'type-graphql';

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
};
