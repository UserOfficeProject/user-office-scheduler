import { useState, useEffect } from 'react';

import { Call, Proposal, ProposalBooking } from 'generated/sdk';
import { useUnauthorizedApi } from 'hooks/common/useDataApi';

export type InstrumentProposalBooking = Pick<
  ProposalBooking,
  'id' | 'createdAt' | 'updatedAt' | 'status' | 'allocatedTime'
> & {
  call: Pick<
    Call,
    'id' | 'shortCode' | 'startCycle' | 'endCycle' | 'cycleComment'
  >;
} & {
  proposal: Pick<Proposal, 'id' | 'title' | 'shortCode'>;
};

export default function useInstrumentProposalBookings(id: string) {
  const [loading, setLoading] = useState(true);
  const [proposalBookings, setProposalBookings] = useState<
    InstrumentProposalBooking[]
  >([]);

  const unauthorizedApi = useUnauthorizedApi();

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    unauthorizedApi()
      .instrumentProposalBookings({ id })
      .then(data => {
        if (unmount) {
          return;
        }

        if (data.instrumentProposalBookings) {
          setProposalBookings(data.instrumentProposalBookings);
        }

        setLoading(false);
      })
      .catch(console.error);

    return () => {
      unmount = true;
    };
  }, [id, unauthorizedApi]);

  return { loading, proposalBookings } as const;
}
