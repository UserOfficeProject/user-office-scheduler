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

  const api = useDataApi();

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    api()
      .getInstrumentProposalBookings({ instrumentId })
      .then(data => {
        if (unmount) {
          return;
        }

        if (data.instrumentProposalBookings) {
          const filtered = data.instrumentProposalBookings.filter(
            ({ call, proposal }) => call && proposal
          ) as InstrumentProposalBooking[];

          setProposalBookings(filtered);
        }

        setLoading(false);
      })
      .catch(console.error);

    return () => {
      unmount = true;
    };
  }, [instrumentId, api]);

  return { loading, proposalBookings } as const;
}
