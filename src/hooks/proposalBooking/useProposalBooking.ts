import { useState, useEffect } from 'react';

import { Call, Proposal, ProposalBooking } from 'generated/sdk';
import { useUnauthorizedApi } from 'hooks/common/useDataApi';

export type DetailedProposalBooking = Pick<
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

export default function useProposalBooking(id: string) {
  const [loading, setLoading] = useState(true);
  const [
    proposalBooking,
    setProposalBooking,
  ] = useState<DetailedProposalBooking | null>(null);

  const unauthorizedApi = useUnauthorizedApi();

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    unauthorizedApi()
      .proposalBooking({ id })
      .then(data => {
        if (unmount) {
          return;
        }

        if (data.proposalBooking) {
          setProposalBooking(data.proposalBooking);
        }

        setLoading(false);
      })
      .catch(console.error);

    return () => {
      unmount = true;
    };
  }, [id, unauthorizedApi]);

  return { loading, proposalBooking } as const;
}
