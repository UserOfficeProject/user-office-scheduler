import moment from 'moment';
import { View } from 'react-big-calendar';

import { ScheduledEventFilter } from 'generated/sdk';
import { toTzLessDateTime } from 'utils/date';

export default function generateScheduledEventFilter(
  startsAt: Date,
  activeView: View
): ScheduledEventFilter | undefined {
  switch (activeView) {
    case 'week': {
      const newStartsAt = moment(startsAt).startOf('week');

      return {
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(1, 'week')),
      };
    }
    case 'month': {
      const newStartsAt = moment(startsAt).startOf('month');

      return {
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(1, 'month')),
      };
    }
    default:
      console.warn('activeView not implemented:', activeView);

      return undefined;
  }
}
