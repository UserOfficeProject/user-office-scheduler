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

  const instrumentIdsArray = instrumentIds?.flatMap((instrumentId) =>
    instrumentId ? [instrumentId] : []
  );

  const [selectedInstruments, setSelectedInstruments] = useState<
    number[] | undefined
  >(instrumentIdsArray);
  // may look stupid, but basically lets us provide a refresh option
  // and we won't get a warning when the component gets unmounted while
  // the promise still pending
  const [counter, setCounter] = useState<number>(0);

  const api = useDataApi();

  const refresh = useCallback(() => {
    setCounter((prev) => prev + 1);
  }, [setCounter]);

  useEffect(() => {
    let unmount = false;

    setLoading(true);

    if (!selectedInstruments?.length) {
      setScheduledEvents([]);
      setLoading(false);

      return;
    }

    api()
      .getScheduledEvents({
        filter: { startsAt, endsAt, instrumentIds: selectedInstruments },
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
  }, [counter, startsAt, endsAt, selectedInstruments, api]);

  return {
    loading,
    scheduledEvents,
    refresh,
    selectedInstruments,
    setSelectedInstruments,
  } as const;
}
