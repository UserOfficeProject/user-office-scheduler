import { useState, useEffect, useCallback } from 'react';

import { GetScheduledEventWithEquipmentsQuery } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type ScheduledEventEquipment = NonNullable<
  GetScheduledEventWithEquipmentsQuery['proposalBookingScheduledEvent']
>['equipments'][0];

export default function useScheduledEventWithEquipments({
  proposalBookingId,
  scheduledEventId,
}: {
  proposalBookingId: number;
  scheduledEventId?: number;
}) {
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [scheduledEvent, setScheduledEvent] =
    useState<
      GetScheduledEventWithEquipmentsQuery['proposalBookingScheduledEvent']
    >(null);

  const api = useDataApi();

  const refresh = useCallback(() => {
    setCounter((prev) => prev + 1);
  }, [setCounter]);

  useEffect(() => {
    if (!scheduledEventId) {
      return;
    }
    let unmount = false;

    setLoading(true);
    api()
      .getScheduledEventWithEquipments({
        proposalBookingId,
        scheduledEventId,
        scheduledEventFilter: {},
      })
      .then((data) => {
        if (unmount) {
          return;
        }

        if (data.proposalBookingScheduledEvent) {
          setScheduledEvent(data.proposalBookingScheduledEvent);
        }

        setLoading(false);
      })
      .catch(console.error);

    return () => {
      unmount = true;
    };
  }, [proposalBookingId, scheduledEventId, api, counter]);

  return { loading, scheduledEvent, setScheduledEvent, refresh } as const;
}
