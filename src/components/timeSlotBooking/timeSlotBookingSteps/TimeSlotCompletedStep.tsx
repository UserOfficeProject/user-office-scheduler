import {
  Button,
  DialogActions,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';

import Loader from 'components/common/Loader';
import { ProposalBooking } from 'generated/sdk';
import useProposalBookingLostTimes from 'hooks/lostTime/useProposalBookingLostTimes';
import { parseTzLessDateTime } from 'utils/date';

import TimeTable, { TimeTableRow } from '../../proposalBooking/TimeTable';
import { TimeSlotBookingDialogStepProps } from '../TimeSlotBookingDialog';

const useStyles = makeStyles(() => ({
  resetFlex: {
    flexShrink: 0,
    flexGrow: 0,
  },
}));

export default function TimeSlotCompletedStep({
  scheduledEvent,
  handleCloseDialog,
}: TimeSlotBookingDialogStepProps) {
  const classes = useStyles();
  const proposalBooking = scheduledEvent.proposalBooking as ProposalBooking;

  const { loading, lostTimes } = useProposalBookingLostTimes(
    proposalBooking.id,
    scheduledEvent.id
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
          Time slot booking is already completed, you can not edit it.
        </Alert>
      </DialogContent>
      <DialogContent>
        <TimeTable
          maxHeight={530}
          rows={rows}
          titleComponent="Logged lost time"
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={handleCloseDialog}
          data-cy="btn-close-event-dialog"
        >
          Close
        </Button>
      </DialogActions>
    </>
  );
}
