import { useState, useEffect } from 'react';

import { Call, Proposal, ProposalBooking } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

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

export default function useInstrumentProposalBookings(instrumentId: string) {
  const [loading, setLoading] = useState(true);
  const [proposalBookings, setProposalBookings] = useState<
    InstrumentProposalBooking[]
  >([]);

  const unauthorizedApi = useDataApi();

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    unauthorizedApi()
      .instrumentProposalBookings({ instrumentId })
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
  }, [instrumentId, unauthorizedApi]);

  return { loading, proposalBookings } as const;
}
