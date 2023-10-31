import { useState, useEffect } from 'react';

import { GetCallsQuery } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type PartialCall = NonNullable<GetCallsQuery['calls']>[0];

export default function useInstrumentCalls(instrumentIds: number[]) {
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState<PartialCall[]>([]);

  const instrumentIdsStringified = JSON.stringify(instrumentIds);

  const api = useDataApi();

  useEffect(() => {
    const instrumentIdsArray = JSON.parse(instrumentIdsStringified);

    setLoading(true);

    if (!instrumentIdsArray?.length) {
      setCalls([]);
      setLoading(false);

      return;
    }

    let unmount = false;

    setLoading(true);
    api()
      .getCalls({ filter: { instrumentIds: instrumentIdsArray } })
      .then((data) => {
        if (unmount) {
          return;
        }

        if (data.calls) {
          setCalls(data.calls);
        }

        setLoading(false);
      });

    return () => {
      unmount = true;
    };
  }, [api, instrumentIdsStringified]);

  return { loading, calls } as const;
}
