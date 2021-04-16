import { useState, useEffect, useCallback } from 'react';

import { GetScheduledEventsQuery, ScheduledEventFilter } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export default function useScheduledEvents(filter: ScheduledEventFilter) {
  const [loading, setLoading] = useState(true);
  const [scheduledEvents, setScheduledEvents] = useState<
    GetScheduledEventsQuery['scheduledEvents']
  >([]);
  // may look stupid, but basically lets us provide a refresh option
  // and we won't get a warning when the component gets unmounted while
  // the promise still pending
  const [counter, setCounter] = useState<number>(0);

  const api = useDataApi();

  const refresh = useCallback(() => {
    setCounter(prev => prev + 1);
  }, [setCounter]);

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    api()
      .getScheduledEvents({ filter })
      .then(data => {
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
  }, [counter, filter, api]);

  return { loading, scheduledEvents, refresh } as const;
}
