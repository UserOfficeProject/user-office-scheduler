import moment from 'moment';
import { View } from 'react-big-calendar';

import { ScheduledEventFilter } from 'generated/sdk';
import { toTzLessDateTime } from 'utils/date';

export default function generateScheduledEventFilter(
  instrumentIds: number[],
  localContactIds: number[],
  startsAt: Date,
  activeView: View
): ScheduledEventFilter {
  switch (activeView) {
    case 'day': {
      const newStartsAt = moment(startsAt);

      return {
        instrumentIds,
        localContactIds,
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(1, 'day')),
      };
    }
    case 'week': {
      const newStartsAt = moment(startsAt);

      return {
        instrumentIds,
        localContactIds,
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(1, 'week')),
      };
    }
    case 'month': {
      const newStartsAt = moment(startsAt);

      return {
        instrumentIds,
        localContactIds,
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(1, 'month')),
      };
    }
    default:
      console.warn('activeView not implemented:', activeView);
      const newStartsAt = moment(startsAt);

      return {
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(1, 'week')),
        instrumentIds,
        localContactIds,
      };
  }
}
