import { makeStyles } from '@material-ui/core';
import humanizeDuration from 'humanize-duration';
import React from 'react';

import { ScheduledEventStatusMap } from 'components/scheduledEvent/ScheduledEventForm';
import { ProposalBookingStatusCore } from 'generated/sdk';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';
import { parseTzLessDateTime } from 'utils/date';
import { getFullUserName } from 'utils/user';

const useStyles = makeStyles((theme) => ({
  heading1: {
    fontSize: '17px',
    fontWeight: 'normal',
    margin: '10px 0 0 0',
    lineHeight: 1.2,
    padding: 0,
  },
  headingCompleted: {
    color: theme.palette.grey[500],
  },
  heading2: {
    fontSize: '14px',
    fontWeight: 'normal',
    fontStyle: 'italic',
    margin: 0,
    padding: 0,
    color: theme.palette.grey[500],
  },
}));

function formatTimeRemaining(seconds: number) {
  if (seconds === 0) {
    return <span style={{ color: 'green' }}>✓ Allocated</span>;
  }
  if (seconds < 0) {
    return <span style={{ color: 'red' }}>Over allocated</span>;
  }

  return `${humanizeDuration(seconds * 1000, { largest: 2 })} left`;
}

interface ProposalBookingTreeTitleProps {
  proposalBooking: InstrumentProposalBooking;
}

function ProposalBookingTreeTitle({
  proposalBooking,
}: ProposalBookingTreeTitleProps) {
  const classes = useStyles();

  const allocated = proposalBooking.scheduledEvents.reduce(
    (total, curr) =>
      total + parseTzLessDateTime(curr.endsAt).diff(curr.startsAt, 'seconds'),
    0
  );

  const allocatable = proposalBooking.allocatedTime - allocated;

  if (!proposalBooking.proposal) {
    return null;
  }

  const isProposalBookingCompleted =
    proposalBooking.status === ProposalBookingStatusCore.COMPLETED;

  return (
    <>
      <h1
        className={`${classes.heading1} ${
          isProposalBookingCompleted ? classes.headingCompleted : ''
        }`}
      >
        {`${getFullUserName(proposalBooking.proposal.proposer)} - (${
          proposalBooking.proposal.proposalId
        })`}{' '}
        {isProposalBookingCompleted
          ? `- [${ScheduledEventStatusMap[proposalBooking.status]}]`
          : ''}
      </h1>
      <h2 className={classes.heading2}>{formatTimeRemaining(allocatable)}</h2>
    </>
  );
}

export default ProposalBookingTreeTitle;
