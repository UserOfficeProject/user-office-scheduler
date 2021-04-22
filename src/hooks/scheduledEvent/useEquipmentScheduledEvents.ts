import { useState, useEffect } from 'react';

import { GetEquipmentScheduledEventsQuery } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export default function useEquipmentScheduledEvents(equipmentIds: number[]) {
  const [loading, setLoading] = useState(true);
  const [scheduledEvents, setScheduledEvents] = useState<
    GetEquipmentScheduledEventsQuery['equipmentScheduledEvents']
  >([]);
  const [selectedEquipment, setSelectedEquipments] = useState<number[]>(
    equipmentIds
  );
  const api = useDataApi();
  useEffect(() => {
    let unmount = false;
    setLoading(true);
    api()
      .getEquipmentScheduledEvents({ equipmentIds: selectedEquipment })
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
  }, [selectedEquipment, api]);

  return {
    loading,
    scheduledEvents,
    selectedEquipment,
    setSelectedEquipments,
  } as const;
}
