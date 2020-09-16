import { registerEnumType } from 'type-graphql';

import { ScheduledEventBookingType } from '../models/ScheduledEvent';

export const registerEnums = () => {
  registerEnumType(ScheduledEventBookingType, {
    name: 'ScheduledEventBookingType',
  });
};
