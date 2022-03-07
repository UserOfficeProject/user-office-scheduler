import { useState, useEffect } from 'react';

import { GetProposalBookingLostTimesQuery } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type ProposalBookingLostTime =
  GetProposalBookingLostTimesQuery['proposalBookingLostTimes'][0];

export default function useProposalBookingLostTimes(
  proposalBookingId?: number,
  scheduledEventId?: number,
  shouldLoadLostTimes = true
) {
  const [loading, setLoading] = useState(true);
  const [lostTimes, setLostTimes] = useState<ProposalBookingLostTime[]>([]);

  const api = useDataApi();

  useEffect(() => {
    let unmount = false;

    if (!proposalBookingId || !shouldLoadLostTimes) {
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
  }, [shouldLoadLostTimes, proposalBookingId, scheduledEventId, api]);

  return { loading, lostTimes, setLostTimes } as const;
}
