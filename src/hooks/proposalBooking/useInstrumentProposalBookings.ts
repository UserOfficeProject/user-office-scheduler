import { useState, useEffect, useCallback } from 'react';

import { Call, Proposal, ProposalBooking } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type InstrumentProposalBooking = Pick<
  ProposalBooking,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'status'
  | 'allocatedTime'
  | 'scheduledEvents'
> & {
  call: Pick<
    Call,
    'id' | 'shortCode' | 'startCycle' | 'endCycle' | 'cycleComment'
  >;
} & {
  proposal: Pick<Proposal, 'id' | 'title' | 'shortCode'>;
};

export default function useInstrumentProposalBookings(
  instrumentId: string | null
) {
  const [loading, setLoading] = useState(false);
  const [proposalBookings, setProposalBookings] = useState<
    InstrumentProposalBooking[]
  >([]);

  const [counter, setCounter] = useState<number>(0);

  const refresh = useCallback(() => {
    setCounter((prev) => prev + 1);
  }, [setCounter]);

  const api = useDataApi();

  useEffect(() => {
    if (!instrumentId) {
      return;
    }
    let unmount = false;

    setLoading(true);
    api()
      .getInstrumentProposalBookings({ instrumentId, filter: {} })
      .then((data) => {
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
  }, [instrumentId, api, counter]);

  return { loading, proposalBookings, refresh } as const;
}
