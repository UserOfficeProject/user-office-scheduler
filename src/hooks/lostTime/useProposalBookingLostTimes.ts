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

  const unauthorizedApi = useDataApi();

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    unauthorizedApi()
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
  }, [proposalBookingId, unauthorizedApi]);

  return { loading, lostTimes } as const;
}
