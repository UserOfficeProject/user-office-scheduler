import { useState, useEffect } from 'react';

import { LostTime } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type ProposalBookingLostTime = Pick<
  LostTime,
  'id' | 'startsAt' | 'endsAt'
>;

export default function useProposalBookingLostTimes(proposalBookingId: string) {
  const [loading, setLoading] = useState(true);
  const [lostTimes, setLostTimes] = useState<ProposalBookingLostTime[]>([]);

  const api = useDataApi();

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    api()
      .proposalBookingLostTimes({ proposalBookingId })
      .then(data => {
        if (unmount) {
          return;
        }

        if (data.proposalBookingLostTimes) {
          setLostTimes(data.proposalBookingLostTimes);
        }

        setLoading(false);
      })
      .catch(console.error);

    return () => {
      unmount = true;
    };
  }, [proposalBookingId, api]);

  return { loading, lostTimes } as const;
}
