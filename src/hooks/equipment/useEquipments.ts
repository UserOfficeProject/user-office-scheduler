import { useState, useEffect, useCallback } from 'react';

import { Equipment } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export default function useEquipments() {
  const [loading, setLoading] = useState(true);
  const [equipments, setEquipments] = useState<
    Pick<
      Equipment,
      'id' | 'name' | 'maintenanceStartsAt' | 'maintenanceEndsAt' | 'autoAccept'
    >[]
  >([]);

  // may look stupid, but basically lets us provide a refresh option
  // and we won't get a warning when the component gets unmounted while
  // the promise still pending
  const [counter, setCounter] = useState<number>(0);

  const api = useDataApi();

  const refresh = useCallback(() => {
    setCounter((prev) => prev + 1);
  }, [setCounter]);

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
  }, [counter, api]);

  return { loading, equipments, refresh } as const;
}
