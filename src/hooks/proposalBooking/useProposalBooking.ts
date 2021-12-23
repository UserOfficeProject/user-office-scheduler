import { useState, useEffect } from 'react';

import { Call, Proposal, ProposalBooking } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type DetailedProposalBooking = Pick<
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
  proposal: Pick<Proposal, 'primaryKey' | 'title' | 'proposalId' | 'proposer'>;
};

export default function useProposalBooking(id: number) {
  const [loading, setLoading] = useState(true);
  const [proposalBooking, setProposalBooking] =
    useState<DetailedProposalBooking | null>(null);

  const api = useDataApi();

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    api()
      .getProposalBooking({ id, filter: {} })
      .then((data) => {
        if (unmount) {
          return;
        }

        if (
          data.proposalBooking &&
          data.proposalBooking.proposal &&
          data.proposalBooking.call
        ) {
          setProposalBooking(data.proposalBooking as DetailedProposalBooking);
        }

        setLoading(false);
      })
      .catch(console.error);

    return () => {
      unmount = true;
    };
  }, [id, api]);

  return { loading, proposalBooking, setProposalBooking } as const;
}
