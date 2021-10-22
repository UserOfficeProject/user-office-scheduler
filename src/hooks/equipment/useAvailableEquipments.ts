import { useState, useEffect } from 'react';

import { Equipment } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type EquipmentPartial = Pick<
  Equipment,
  | 'id'
  | 'name'
  | 'description'
  | 'maintenanceStartsAt'
  | 'maintenanceEndsAt'
  | 'autoAccept'
>;

export default function useAvailableEquipments(scheduledEventId: number) {
  const [loading, setLoading] = useState(true);
  const [equipments, setEquipments] = useState<EquipmentPartial[]>([]);

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
