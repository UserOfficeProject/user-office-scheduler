import { useState, useEffect } from 'react';

import { Equipment } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type PartialEquipment = Pick<
  Equipment,
  | 'id'
  | 'name'
  | 'description'
  | 'maintenanceStartsAt'
  | 'maintenanceEndsAt'
  | 'autoAccept'
>;

export default function useEquipments() {
  const [loading, setLoading] = useState(true);
  const [equipments, setEquipments] = useState<PartialEquipment[]>([]);

  const api = useDataApi();

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    api()
      .getEquipments()
      .then((data) => {
        if (unmount) {
          return;
        }

        if (data.equipments) {
          setEquipments(data.equipments);
        }

        setLoading(false);
      });

    return () => {
      unmount = true;
    };
  }, [api]);

  return { loading, equipments } as const;
}
