import { DialogContent, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';

import Loader from 'components/common/Loader';
import useProposalBookingLostTimes from 'hooks/lostTime/useProposalBookingLostTimes';
import { DetailedProposalBooking } from 'hooks/proposalBooking/useProposalBooking';
import { parseTzLessDateTime } from 'utils/date';

import TimeTable, { TimeTableRow } from '../TimeTable';

const useStyles = makeStyles(() => ({
  resetFlex: {
    flexShrink: 0,
    flexGrow: 0,
  },
}));

type ClosedStepStepProps = {
  proposalBooking: DetailedProposalBooking;
};

export default function ClosedStep({ proposalBooking }: ClosedStepStepProps) {
  const classes = useStyles();

  const { loading, lostTimes } = useProposalBookingLostTimes(
    proposalBooking.id
  );

  const [rows, setRows] = useState<TimeTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setRows(
        lostTimes.map(({ startsAt, endsAt, ...rest }) => ({
          ...rest,
          startsAt: parseTzLessDateTime(startsAt),
          endsAt: parseTzLessDateTime(endsAt),
        }))
      );

      setIsLoading(false);
    }
  }, [loading, lostTimes]);

  return (
    <>
      {isLoading && <Loader />}
      <DialogContent className={classes.resetFlex}>
        <Alert severity="info">
          Proposal booking is already closed, you can not edit it.
        </Alert>
      </DialogContent>
      <DialogContent>
        <TimeTable
          maxHeight={530}
          rows={rows}
          titleComponent="Logged lost time"
        />
      </DialogContent>
    </>
  );
}
