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
  | 'instrument'
> & {
  call: Pick<
    Call,
    'id' | 'shortCode' | 'startCycle' | 'endCycle' | 'cycleComment'
  >;
} & {
  proposal: Pick<Proposal, 'primaryKey' | 'title' | 'proposalId'>;
};

export default function useInstrumentProposalBookings(
  instrumentIds: number[] | null | undefined
) {
  const [loading, setLoading] = useState(false);
  const [proposalBookings, setProposalBookings] = useState<
    InstrumentProposalBooking[]
  >([]);

  const instrumentIdsArray = instrumentIds?.flatMap((instrumentId) =>
    instrumentId ? [instrumentId] : []
  );

  const [selectedInstruments, setSelectedInstruments] = useState<
    number[] | undefined
  >(instrumentIdsArray);

  const [counter, setCounter] = useState<number>(0);

  const refresh = useCallback(() => {
    setCounter((prev) => prev + 1);
  }, [setCounter]);

  const api = useDataApi();

  useEffect(() => {
    setLoading(true);

    if (!selectedInstruments?.length) {
      setProposalBookings([]);
      setLoading(false);

      return;
    }
    let unmount = false;

    api()
      .getInstrumentProposalBookings({
        instrumentIds: selectedInstruments,
        filter: {},
      })
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
  }, [selectedInstruments, api, counter]);

  return {
    loading,
    proposalBookings,
    refresh,
    setSelectedInstruments,
    selectedInstruments,
  } as const;
}
