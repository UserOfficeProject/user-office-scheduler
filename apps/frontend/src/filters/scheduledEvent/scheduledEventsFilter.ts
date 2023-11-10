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
  let endsAt: moment.Moment;
  const newStartsAt = moment(startsAt);

  switch (activeView) {
    case 'day': {
      endsAt = newStartsAt.add(1, 'day');
      break;
    }
    case 'week': {
      endsAt = newStartsAt.add(1, 'week');
      break;
    }
    case 'month': {
      endsAt = newStartsAt.add(1, 'month');
      break;
    }
    default:
      console.warn('activeView not implemented:', activeView);

      endsAt = newStartsAt.add(1, 'week');

      break;
  }

  return {
    instrumentIds,
    localContactIds,
    startsAt: toTzLessDateTime(newStartsAt),
    endsAt: toTzLessDateTime(endsAt),
    callId,
  };
}
