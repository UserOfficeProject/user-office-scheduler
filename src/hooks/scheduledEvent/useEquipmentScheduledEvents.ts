import { useState, useEffect } from 'react';

import { GetEquipmentScheduledEventsQuery, Scalars } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export default function useEquipmentScheduledEvents(
  equipmentIds: number[],
  startsAt: Scalars['TzLessDateTime'],
  endsAt: Scalars['TzLessDateTime']
) {
  const [loading, setLoading] = useState(true);
  const [scheduledEvents, setScheduledEvents] = useState<
    GetEquipmentScheduledEventsQuery['equipments']
  >([]);
  const [selectedEquipment, setSelectedEquipments] = useState<number[]>(
    equipmentIds
  );
  const api = useDataApi();
  useEffect(() => {
    let unmount = false;
    setLoading(true);
    api()
      .getEquipmentScheduledEvents({
        equipmentIds: selectedEquipment,
        startsAt,
        endsAt,
      })
      .then(data => {
        if (unmount) {
          return;
        }

        if (data.equipments) {
          setScheduledEvents(data.equipments);
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
