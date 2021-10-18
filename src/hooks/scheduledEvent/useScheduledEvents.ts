import { useState, useEffect, useCallback } from 'react';

import { GetScheduledEventsQuery, ScheduledEventFilter } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export default function useScheduledEvents({
  endsAt,
  startsAt,
  instrumentIds,
}: ScheduledEventFilter) {
  const [loading, setLoading] = useState(true);
  const [scheduledEvents, setScheduledEvents] = useState<
    GetScheduledEventsQuery['scheduledEvents']
  >([]);
  // may look stupid, but basically lets us provide a refresh option
  // and we won't get a warning when the component gets unmounted while
  // the promise still pending
  const [counter, setCounter] = useState<number>(0);
  // NOTE: We need to stringify the ids array before we pass it to the useEffect dependency array because of its comparison.
  const instrumentIdsStringified = JSON.stringify(instrumentIds);

  const api = useDataApi();

  const refresh = useCallback(() => {
    setCounter((prev) => prev + 1);
  }, [setCounter]);

  useEffect(() => {
    let unmount = false;
    const instrumentIdsArray = JSON.parse(instrumentIdsStringified);

    setLoading(true);

    if (!instrumentIdsArray?.length) {
      setScheduledEvents([]);
      setLoading(false);

      return;
    }

    api()
      .getScheduledEvents({
        filter: { startsAt, endsAt, instrumentIds: instrumentIdsArray },
        scheduledEventFilter: {},
      })
      .then((data) => {
        if (unmount) {
          return;
        }

        if (data.scheduledEvents) {
          setScheduledEvents(data.scheduledEvents);
        }

        setLoading(false);
      });

    return () => {
      unmount = true;
    };
  }, [counter, startsAt, endsAt, instrumentIdsStringified, api]);

  return {
    loading,
    scheduledEvents,
    refresh,
  } as const;
}
