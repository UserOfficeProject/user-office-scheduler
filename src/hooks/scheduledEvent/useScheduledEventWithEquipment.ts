import { useState, useEffect, useCallback } from 'react';

import { ScheduledEvent, EquipmentWithAssignmentStatus } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type ScheduledEventEquipment = Pick<
  EquipmentWithAssignmentStatus,
  | 'id'
  | 'name'
  | 'description'
  | 'maintenanceStartsAt'
  | 'maintenanceEndsAt'
  | 'status'
>;

export type ScheduledEventWithEquipments = Pick<
  ScheduledEvent,
  'id' | 'startsAt' | 'endsAt' | 'status' | 'scheduledBy' | 'proposalBooking'
> & {
  equipments: ScheduledEventEquipment[];
};

export default function useScheduledEventWithEquipments({
  proposalBookingId,
  scheduledEventId,
}: {
  proposalBookingId: number;
  scheduledEventId?: number;
}) {
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [scheduledEvent, setScheduledEvent] =
    useState<ScheduledEventWithEquipments | null>(null);

  const api = useDataApi();

  const refresh = useCallback(() => {
    setCounter((prev) => prev + 1);
  }, [setCounter]);

  useEffect(() => {
    if (!scheduledEventId) {
      return;
    }
    let unmount = false;

    setLoading(true);
    api()
      .getScheduledEventWithEquipments({
        proposalBookingId,
        scheduledEventId,
        scheduledEventFilter: {},
      })
      .then((data) => {
        if (unmount) {
          return;
        }

        if (data.proposalBookingScheduledEvent) {
          setScheduledEvent(
            data.proposalBookingScheduledEvent as ScheduledEventWithEquipments
          );
        }

        setLoading(false);
      })
      .catch(console.error);

    return () => {
      unmount = true;
    };
  }, [proposalBookingId, scheduledEventId, api, counter]);

  return { loading, scheduledEvent, setScheduledEvent, refresh } as const;
}
