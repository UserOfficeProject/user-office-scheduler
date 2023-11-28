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
