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
  const filter = {
    startsAt: toTzLessDateTime(newStartsAt),
    endsAt: toTzLessDateTime(newStartsAt.add(1, 'week')),
    instrumentIds,
    localContactIds,
    callId,
  };

  switch (activeView) {
    case 'day': {
      filter.endsAt = toTzLessDateTime(newStartsAt.add(1, 'day'));

      break;
    }
    case 'week': {
      filter.endsAt = toTzLessDateTime(newStartsAt.add(1, 'week'));

      break;
    }
    case 'month': {
      filter.endsAt = toTzLessDateTime(newStartsAt.add(1, 'month'));

      break;
    }
    default:
      console.warn('activeView not implemented:', activeView);
      filter.endsAt = toTzLessDateTime(newStartsAt.add(1, 'week'));

      break;
  }

  return filter;
}
