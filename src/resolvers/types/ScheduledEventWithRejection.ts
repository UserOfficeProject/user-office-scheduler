import { createUnionType } from 'type-graphql';

import { Rejection } from './Rejection';
import { ScheduledEvent } from './ScheduledEvent';

export const ScheduledEventWithRejection = createUnionType({
  name: 'ScheduledEventWithRejection',
  types: () => [ScheduledEvent, Rejection],
});
