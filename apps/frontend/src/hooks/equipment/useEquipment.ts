import { useState, useEffect } from 'react';

import { GetEquipmentQuery } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export default function useEquipment(id?: number) {
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] =
    useState<GetEquipmentQuery['equipment']>(null);

  const api = useDataApi();

  useEffect(() => {
    let unmount = false;
    if (id !== undefined) {
      setLoading(true);
      api()
        .getEquipment({ id })
        .then((data) => {
          if (unmount) {
            return;
          }

          if (data.equipment) {
            setEquipment(data.equipment);
          }

          setLoading(false);
        })
        .catch(console.error);
    }

    return () => {
      unmount = true;
    };
  }, [id, api]);

  return { loading, equipment, setEquipment } as const;
}
