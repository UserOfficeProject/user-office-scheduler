import { useState, useEffect } from 'react';

import { GetUserInstrumentsQuery } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type PartialInstrument = NonNullable<
  GetUserInstrumentsQuery['userInstruments']
>['instruments'][0];

export default function useUserInstruments() {
  const [loading, setLoading] = useState(true);
  const [instruments, setInstruments] = useState<PartialInstrument[]>([]);

  const api = useDataApi();

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    api()
      .getUserInstruments()
      .then((data) => {
        if (unmount) {
          return;
        }

        if (data.userInstruments?.instruments) {
          setInstruments(data.userInstruments.instruments);
        }

        setLoading(false);
      });

    return () => {
      unmount = true;
    };
  }, [api]);

  return { loading, instruments } as const;
}
