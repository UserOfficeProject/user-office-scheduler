import { useState, useEffect, useCallback } from 'react';

import { GetInstrumentProposalBookingsQuery } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export type InstrumentProposalBooking =
  GetInstrumentProposalBookingsQuery['instrumentProposalBookings'][0];

export default function useInstrumentProposalBookings(
  instrumentIds: number[],
  callId?: number | null
) {
  const [loading, setLoading] = useState(false);
  const [proposalBookings, setProposalBookings] = useState<
    InstrumentProposalBooking[]
  >([]);

  const [counter, setCounter] = useState<number>(0);
  // NOTE: We need to stringify the ids array before we pass it to the useEffect dependency array because of its comparison.
  const instrumentIdsStringified = JSON.stringify(instrumentIds);

  const refresh = useCallback(() => {
    setCounter((prev) => prev + 1);
  }, [setCounter]);

  const api = useDataApi();

  useEffect(() => {
    const instrumentIdsArray = JSON.parse(instrumentIdsStringified);

    setLoading(true);

    if (!instrumentIdsArray?.length) {
      setProposalBookings([]);
      setLoading(false);

      return;
    }
    let unmount = false;

    api()
      .getInstrumentProposalBookings({
        instrumentIds: instrumentIdsArray,
        callId,
        filter: {},
      })
      .then((data) => {
        if (unmount) {
          return;
        }

        if (data.instrumentProposalBookings) {
          const filtered = data.instrumentProposalBookings.filter(
            ({ call, proposal }) => call && proposal
          );

          setProposalBookings(filtered);
        }

        setLoading(false);
      })
      .catch(console.error);

    return () => {
      unmount = true;
    };
  }, [instrumentIdsStringified, api, callId, counter]);

  return {
    loading,
    proposalBookings,
    refresh,
    setProposalBookings,
  } as const;
}
