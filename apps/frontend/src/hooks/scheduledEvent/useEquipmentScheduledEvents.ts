import { useState, useEffect, useCallback } from 'react';

import { GetEquipmentScheduledEventsQuery, Scalars } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export default function useEquipmentScheduledEvents({
  equipmentIds,
  startsAt,
  endsAt,
  shouldGetAll = false,
}: {
  startsAt: Scalars['TzLessDateTime']['input'];
  endsAt: Scalars['TzLessDateTime']['input'];
  equipmentIds: number[];
  shouldGetAll?: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [scheduledEvents, setScheduledEvents] = useState<
    GetEquipmentScheduledEventsQuery['equipments']
  >([]);
  const [counter, setCounter] = useState<number>(0);
  // NOTE: We need to stringify the ids array before we pass it to the useEffect dependency array because of its comparison.
  const equipmentIdsStringified = JSON.stringify(equipmentIds);

  const api = useDataApi();

  const refresh = useCallback(() => {
    setCounter((prev) => prev + 1);
  }, [setCounter]);

  useEffect(() => {
    const equipmentIdsArray = JSON.parse(equipmentIdsStringified);
    setLoading(true);

    if (!equipmentIdsArray?.length && !shouldGetAll) {
      setScheduledEvents([]);
      setLoading(false);

      return;
    }

    let unmounted = false;

    api()
      .getEquipmentScheduledEvents({
        equipmentIds: equipmentIdsArray,
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
  }, [equipmentIdsStringified, shouldGetAll, api, startsAt, endsAt, counter]);

  return {
    loading,
    scheduledEvents,
    setScheduledEvents,
    refresh,
  } as const;
}
