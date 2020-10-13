import { useState, useEffect, useCallback } from 'react';

import { ScheduledEvent, ScheduledEventFilter } from 'generated/sdk';
import { useUnauthorizedApi } from 'hooks/common/useDataApi';

export default function useScheduledEvents(filter: ScheduledEventFilter) {
  const [loading, setLoading] = useState(true);
  const [scheduledEvents, setScheduledEvents] = useState<
    Pick<
      ScheduledEvent,
      'id' | 'bookingType' | 'startsAt' | 'endsAt' | 'description'
    >[]
  >([]);

  const unauthorizedApi = useUnauthorizedApi();

  const refresh = useCallback(() => {
    setLoading(true);
    unauthorizedApi()
      .scheduledEvents({ filter })
      .then(data => {
        if (data.scheduledEvents) {
          setScheduledEvents(data.scheduledEvents);
        }

        setLoading(false);
      });
  }, [filter, unauthorizedApi]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { loading, scheduledEvents, refresh } as const;
}
