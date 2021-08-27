import { useState, useEffect, useCallback } from 'react';

import { useDataApi } from 'hooks/common/useDataApi';

import { ScheduledEventEquipment } from './useScheduledEventWithEquipment';

export default function useScheduledEventEquipments({
  proposalBookingId,
  scheduledEventId,
}: {
  proposalBookingId: number;
  scheduledEventId: number;
}) {
  const [loading, setLoading] = useState(true);
  const [equipments, setEquipments] = useState<ScheduledEventEquipment[]>([]);

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
      .getScheduledEventEquipments({ proposalBookingId, scheduledEventId })
      .then((data) => {
        if (unmount) {
          return;
        }

        if (data.proposalBookingScheduledEvent?.equipments) {
          setEquipments(data.proposalBookingScheduledEvent.equipments);
        }

        setLoading(false);
      });

    return () => {
      unmount = true;
    };
  }, [counter, scheduledEventId, proposalBookingId, api]);

  return { loading, equipments, refresh } as const;
}
