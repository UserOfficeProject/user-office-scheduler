import { useState, useEffect } from 'react';

import { GetAvailableEquipmentsQuery } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export default function useAvailableEquipments(scheduledEventId: number) {
  const [loading, setLoading] = useState(true);
  const [equipments, setEquipments] = useState<
    GetAvailableEquipmentsQuery['availableEquipments']
  >([]);

  const api = useDataApi();

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    api()
      .getAvailableEquipments({ scheduledEventId })
      .then((data) => {
        if (unmount) {
          return;
        }

        if (data.availableEquipments) {
          setEquipments(data.availableEquipments);
        }

        setLoading(false);
      });

    return () => {
      unmount = true;
    };
  }, [scheduledEventId, api]);

  return { loading, equipments } as const;
}
