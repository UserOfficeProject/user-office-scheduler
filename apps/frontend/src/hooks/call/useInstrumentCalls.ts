import { useState, useEffect } from 'react';

import { GetCallsQuery } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type PartialCall = NonNullable<GetCallsQuery['calls']>[0];

export default function useInstrumentCalls() {
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState<PartialCall[]>([]);

  const api = useDataApi();

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    api()
      .getCalls()
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
  }, [api]);

  return { loading, calls } as const;
}
