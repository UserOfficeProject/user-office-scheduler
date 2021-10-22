import { useState, useEffect } from 'react';

import { LostTime } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type ProposalBookingLostTime = Pick<
  LostTime,
  'id' | 'startsAt' | 'endsAt' | 'scheduledEventId'
>;

export default function useProposalBookingLostTimes(
  proposalBookingId?: number,
  scheduledEventId?: number
) {
  const [loading, setLoading] = useState(true);
  const [lostTimes, setLostTimes] = useState<ProposalBookingLostTime[]>([]);

  const api = useDataApi();

  useEffect(() => {
    let unmount = false;

    if (!proposalBookingId) {
      return;
    }

    setLoading(true);
    api()
      .getProposalBookingLostTimes({ proposalBookingId, scheduledEventId })
      .then((data) => {
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
  }, [proposalBookingId, scheduledEventId, api]);

  return { loading, lostTimes, setLostTimes } as const;
}
