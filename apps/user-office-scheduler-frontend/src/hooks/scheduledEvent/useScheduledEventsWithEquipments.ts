import { useState, useEffect, useCallback } from 'react';

import { GetScheduledEventsWithEquipmentsQuery } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export default function useScheduledEventsWithEquipments(
  proposalBookingId: number
) {
  const [loading, setLoading] = useState(true);
  const [scheduledEvents, setScheduledEvents] = useState<
    GetScheduledEventsWithEquipmentsQuery['proposalBookingScheduledEvents']
  >([]);
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
    api()
      .getScheduledEventsWithEquipments({ proposalBookingId })
      .then((data) => {
        if (unmount) {
          return;
        }

        if (data.proposalBookingScheduledEvents) {
          setScheduledEvents(
            data.proposalBookingScheduledEvents.filter(
              ({ equipments }) => equipments.length > 0
            )
          );
        }

        setLoading(false);
      })
      .catch(console.error);

    return () => {
      unmount = true;
    };
  }, [counter, proposalBookingId, api]);

  return { loading, scheduledEvents, refresh } as const;
}
