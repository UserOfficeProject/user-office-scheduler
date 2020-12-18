import { useState, useEffect } from 'react';

import { Equipment } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export default function useAvailableEquipments(scheduledEventId: string) {
  const [loading, setLoading] = useState(true);
  const [equipments, setEquipments] = useState<
    Pick<
      Equipment,
      'id' | 'name' | 'maintenanceStartsAt' | 'maintenanceEndsAt' | 'autoAccept'
    >[]
  >([]);

  const api = useDataApi();

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    api()
      .getAvailableEquipments({ scheduledEventId })
      .then(data => {
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
