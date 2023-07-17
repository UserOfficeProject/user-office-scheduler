import { useState, useEffect } from 'react';

import { GetProposalBookingQuery } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type DetailedProposalBooking = Pick<
  NonNullable<GetProposalBookingQuery['proposalBooking']>,
  | 'id'
  | 'createdAt'
  | 'allocatedTime'
  | 'instrument'
  | 'scheduledEvents'
  | 'status'
  | 'updatedAt'
> & {
  call: NonNullable<
    NonNullable<GetProposalBookingQuery['proposalBooking']>['call']
  >;
} & {
  proposal: NonNullable<
    NonNullable<GetProposalBookingQuery['proposalBooking']>['proposal']
  >;
};

export type DetailedProposalBookingScheduledEvent =
  DetailedProposalBooking['scheduledEvents'][0];

export default function useProposalBooking(id: number) {
  const [loading, setLoading] = useState(true);
  const [proposalBooking, setProposalBooking] =
    useState<GetProposalBookingQuery['proposalBooking']>(null);

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
          setProposalBooking(data.proposalBooking);
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
