import { useState, useEffect } from 'react';

import { ScheduledEvent } from 'generated/sdk';
import { useUnauthorizedApi } from 'hooks/common/useDataApi';

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

  const unauthorizedApi = useUnauthorizedApi();

  useEffect(() => {
    let unmount = false;

    setLoading(true);
    unauthorizedApi()
      .proposalBookingScheduledEvents({ proposalBookingId })
      .then(data => {
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
  }, [proposalBookingId, unauthorizedApi]);

  return { loading, scheduledEvents } as const;
}
