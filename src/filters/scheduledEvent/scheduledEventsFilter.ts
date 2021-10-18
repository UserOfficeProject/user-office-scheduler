import moment from 'moment';

import { ExtendedView } from 'components/calendar/Calendar';
import { ScheduledEventFilter } from 'generated/sdk';
import { toTzLessDateTime } from 'utils/date';

export default function generateScheduledEventFilter(
  instrumentIds: number[],
  startsAt: Date,
  activeView: ExtendedView
): ScheduledEventFilter {
  instrumentIds = instrumentIds?.length ? instrumentIds : [0];

  switch (activeView) {
    case 'day': {
      const newStartsAt = moment(startsAt).startOf('day');

      return {
        instrumentIds,
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(1, 'day')),
      };
    }
    case 'week': {
      const newStartsAt = moment(startsAt).startOf('week');

      return {
        instrumentIds,
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(1, 'week')),
      };
    }
    case 'month': {
      const newStartsAt = moment(startsAt).startOf('month');

      return {
        instrumentIds,
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(1, 'month')),
      };
    }
    case 'quarter': {
      const newStartsAt = moment(startsAt).startOf('month');

      return {
        instrumentIds,
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(3, 'month')),
      };
    }
    case 'half_year': {
      const newStartsAt = moment(startsAt).startOf('month');

      return {
        instrumentIds,
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(6, 'month')),
      };
    }
    default:
      console.warn('activeView not implemented:', activeView);
      const newStartsAt = moment(startsAt).startOf('week');

      return {
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(1, 'week')),
        instrumentIds,
      };
  }
}
