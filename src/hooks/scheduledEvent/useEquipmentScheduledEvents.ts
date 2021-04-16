import { useState, useEffect } from 'react';

import { ScheduledEvent } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type EquipmentScheduledEvent = Pick<
  ScheduledEvent,
  'id' | 'startsAt' | 'endsAt'
>;

export default function useEquipmentScheduledEvents(
  equipmentIds: number[] | null | undefined
) {
  const [loading, setLoading] = useState(true);
  const [scheduledEvents, setScheduledEvents] = useState<
    EquipmentScheduledEvent[]
  >([]);

  const api = useDataApi();

  useEffect(() => {
    let unmount = false;
    if (!equipmentIds) {
      setScheduledEvents([]);

      return;
    }
    setLoading(true);
    api()
      .getEquipmentScheduledEvents({ equipmentIds })
      .then(data => {
        if (unmount) {
          return;
        }

        if (data.equipmentScheduledEvents) {
          setScheduledEvents(data.equipmentScheduledEvents);
        }

        setLoading(false);
      })
      .catch(console.error);

    return () => {
      unmount = true;
    };
  }, [equipmentIds, api]);

  return { loading, scheduledEvents } as const;
}
