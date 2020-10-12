import { useState, useEffect, useCallback } from 'react';

import { Instrument } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export default function useInstruments() {
  const [loading, setLoading] = useState(true);
  const [instruments, setInstruments] = useState<
    Pick<Instrument, 'id' | 'name'>[]
  >([]);

  const unauthorizedApi = useDataApi();

  const refresh = useCallback(() => {
    setLoading(true);
    unauthorizedApi()
      .instruments()
      .then(data => {
        if (data.instruments?.instruments) {
          setInstruments(data.instruments.instruments);
        }

        setLoading(false);
      });
  }, [unauthorizedApi]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { loading, instruments, refresh } as const;
}
