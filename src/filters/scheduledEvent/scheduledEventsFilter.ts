import moment from 'moment';

import { ExtendedView } from 'components/calendar/Calendar';
import { ScheduledEventFilter } from 'generated/sdk';
import { toTzLessDateTime } from 'utils/date';

export default function generateScheduledEventFilter(
  instrumentId: string | null,
  startsAt: Date,
  activeView: ExtendedView
): ScheduledEventFilter {
  instrumentId = instrumentId ?? null;

  switch (activeView) {
    case 'week': {
      const newStartsAt = moment(startsAt).startOf('week');

      return {
        instrumentId,
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(1, 'week')),
      };
    }
    case 'month': {
      const newStartsAt = moment(startsAt).startOf('month');

      return {
        instrumentId,
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(1, 'month')),
      };
    }
    case 'year': {
      const newStartsAt = moment(startsAt).startOf('month');

      return {
        instrumentId,
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(3, 'month')),
      };
    }
    default:
      console.warn('activeView not implemented:', activeView);
      const newStartsAt = moment(startsAt).startOf('week');

      return {
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(1, 'week')),
        instrumentId,
      };
  }
}
