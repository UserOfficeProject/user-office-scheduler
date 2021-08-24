import { useState, useEffect } from 'react';

import { GetEquipmentScheduledEventsQuery, Scalars } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export default function useEquipmentScheduledEvents({
  equipmentIds,
  startsAt,
  endsAt,
}: {
  startsAt: Scalars['TzLessDateTime'];
  endsAt: Scalars['TzLessDateTime'];
  equipmentIds?: number[];
}) {
  const [loading, setLoading] = useState(true);
  const [scheduledEvents, setScheduledEvents] = useState<
    GetEquipmentScheduledEventsQuery['equipments']
  >([]);
  const equipmentIdsArray = equipmentIds?.flatMap((equipmentId) =>
    equipmentId ? [equipmentId] : []
  );

  const [selectedEquipment, setSelectedEquipments] = useState<
    number[] | undefined
  >(equipmentIdsArray);
  const api = useDataApi();
  useEffect(() => {
    let unmounted = false;
    setLoading(true);

    if (!selectedEquipment) {
      setLoading(false);

      return;
    }
    api()
      .getEquipmentScheduledEvents({
        equipmentIds: selectedEquipment,
        startsAt,
        endsAt,
      })
      .then((data) => {
        if (unmounted) {
          return;
        }

        if (data.equipments) {
          setScheduledEvents(data.equipments);
        }

        setLoading(false);
      })
      .catch(console.error);

    return () => {
      unmounted = true;
    };
  }, [selectedEquipment, api, startsAt, endsAt]);

  return {
    loading,
    scheduledEvents,
    selectedEquipment,
    setSelectedEquipments,
    setScheduledEvents,
  } as const;
}
