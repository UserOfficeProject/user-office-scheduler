import { useState, useEffect } from 'react';

import { ScheduledEvent } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type ProposalBookingScheduledEvent = Pick<
  ScheduledEvent,
  'id' | 'startsAt' | 'endsAt'
>;

export default function useProposalBookingScheduledEvents(
  proposalBookingId: string
) {
  const [loading, setLoading] = useState(true);
  const [scheduledEvents, setScheduledEvents] = useState<
    ProposalBookingScheduledEvent[]
  >([]);

  const api = useDataApi();

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    api()
      .getProposalBookingScheduledEvents({ proposalBookingId })
      .then((data) => {
        if (unmount) {
          return;
        }

        if (data.proposalBookingScheduledEvents) {
          setScheduledEvents(data.proposalBookingScheduledEvents);
        }

        setLoading(false);
      })
      .catch(console.error);

    return () => {
      unmount = true;
    };
  }, [proposalBookingId, api]);

  return { loading, scheduledEvents } as const;
}
