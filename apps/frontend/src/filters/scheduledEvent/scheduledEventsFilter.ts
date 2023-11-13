import moment from 'moment';
import { View } from 'react-big-calendar';

import { ScheduledEventFilter } from 'generated/sdk';
import { toTzLessDateTime } from 'utils/date';

export default function generateScheduledEventFilter(
  instrumentIds: number[],
  localContactIds: number[],
  startsAt: Date,
  activeView: View,
  callId?: number | null
): ScheduledEventFilter {
  const newStartsAt = moment(startsAt);
  let newEndsAt = moment(startsAt);

  switch (activeView) {
    case 'day': {
      newEndsAt = newEndsAt.add(1, 'day');

      break;
    }
    case 'week': {
      newEndsAt = newEndsAt.add(1, 'week');

      break;
    }
    case 'month': {
      newEndsAt = newEndsAt.add(1, 'month');

      break;
    }
    default:
      console.warn('activeView not implemented:', activeView);
      newEndsAt = newEndsAt.add(1, 'week');

      break;
  }

  return {
    startsAt: toTzLessDateTime(newStartsAt),
    endsAt: toTzLessDateTime(newEndsAt),
    instrumentIds,
    localContactIds,
    callId,
  };
}
