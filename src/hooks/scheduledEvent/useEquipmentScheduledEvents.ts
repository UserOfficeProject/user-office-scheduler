import { useState, useEffect } from 'react';

import { ScheduledEvent } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type EquipmentScheduledEvent = Pick<
  ScheduledEvent,
  'id' | 'startsAt' | 'endsAt' | 'equipmentAssignmentStatus'
>;

export default function useEquipmentScheduledEvents(equipmentId: string) {
  const [loading, setLoading] = useState(true);
  const [scheduledEvents, setScheduledEvents] = useState<
    EquipmentScheduledEvent[]
  >([]);

  const api = useDataApi();

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    api()
      .getEquipmentScheduledEvents({ equipmentId })
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
  }, [equipmentId, api]);

  return { loading, scheduledEvents } as const;
}
