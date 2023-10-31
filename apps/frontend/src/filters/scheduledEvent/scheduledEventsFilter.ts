import moment from 'moment';
import { View } from 'react-big-calendar';

import { ScheduledEventFilter } from 'generated/sdk';
import { toTzLessDateTime } from 'utils/date';

export default function generateScheduledEventFilter(
  instrumentIds: number[],
  localContactIds: number[],
  startsAt: Date,
  activeView: View | 'cycle',
  callId?: number | null,
  callEndCycle?: moment.Moment
): ScheduledEventFilter {
  switch (activeView) {
    case 'day': {
      const newStartsAt = moment(startsAt);

      return {
        instrumentIds,
        localContactIds,
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(1, 'day')),
        callId,
      };
    }
    case 'week': {
      const newStartsAt = moment(startsAt);

      return {
        instrumentIds,
        localContactIds,
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(1, 'week')),
        callId,
      };
    }
    case 'month': {
      const newStartsAt = moment(startsAt);

      return {
        instrumentIds,
        localContactIds,
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newStartsAt.add(1, 'month')),
        callId,
      };
    }
    case 'cycle': {
      console.log(callEndCycle, callEndCycle?.isValid());
      const newStartsAt = moment(startsAt);
      if (!callEndCycle?.isValid()) {
        return {
          startsAt: toTzLessDateTime(newStartsAt),
          endsAt: toTzLessDateTime(newStartsAt.add(1, 'week')),
          instrumentIds,
          localContactIds,
          callId,
        };
      }

      const newEndsAt = moment(callEndCycle);

      return {
        instrumentIds,
        localContactIds,
        startsAt: toTzLessDateTime(newStartsAt),
        endsAt: toTzLessDateTime(newEndsAt),
        callId,
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
        callId,
      };
  }
}
