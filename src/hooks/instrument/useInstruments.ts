import { useState, useEffect, useCallback } from 'react';

import { Instrument } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export default function useInstruments() {
  const [loading, setLoading] = useState(true);
  const [instruments, setInstruments] = useState<
    Pick<Instrument, 'id' | 'name'>[]
  >([]);
  // may look stupid, but basically lets us provide a refresh option
  // and we won't get a warning when the component gets unmounted while
  // the promise still pending
  const [counter, setCounter] = useState<number>(0);

  const api = useDataApi();

  const refresh = useCallback(() => {
    setCounter(prev => prev + 1);
  }, [setCounter]);

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    api()
      .instruments()
      .then(data => {
        if (unmount) {
          return;
        }

        if (data.instruments?.instruments) {
          setInstruments(data.instruments.instruments);
        }

        setLoading(false);
      });

    return () => {
      unmount = true;
    };
  }, [counter, api]);

  return { loading, instruments, refresh } as const;
}
