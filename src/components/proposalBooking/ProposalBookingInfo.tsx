import { makeStyles } from '@material-ui/core';
import React from 'react';

import {
  BasicProposalBooking,
  isDraftEvent,
  isClosedEvent,
} from 'components/calendar/Event';

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: '3px',
    display: 'flex',
    flexWrap: 'wrap',
  },

  proposalId: {
    fontSize: 12,
    fontWeight: 'bold',
    minWidth: '100%',
    flexGrow: 1,
  },
  title: {
    fontSize: 12,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '1px 2px 0 0',
  },
  proposer: {
    fontSize: 12,
    fontStyle: 'italic',
    padding: '1px 2px 0 0',
  },
}));

interface ProposalBookingInfoProps {
  booking?: BasicProposalBooking;
}
function ProposalBookingInfo({ booking }: ProposalBookingInfoProps) {
  const classes = useStyles();
  const proposal = booking?.proposal;

  if (!proposal) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div className={classes.proposalId}>
        {isDraftEvent(booking) ? '[Draft] - ' : ''}
        {isClosedEvent(booking) ? '[Closed] - ' : ''}
        {proposal.proposalId}
      </div>
      <div className={classes.title}>{proposal.title}</div>
      <div className={classes.proposer}>
        {`${proposal.proposer?.firstname} ${proposal.proposer?.lastname}`}
      </div>
    </div>
  );
}

export default ProposalBookingInfo;
