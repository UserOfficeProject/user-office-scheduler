import { makeStyles } from '@material-ui/core';
import React from 'react';

import { BasicProposalBooking } from 'components/calendar/Event';

const useStyles = makeStyles(() => ({
  container: {
    padding: '10px 5px 5px 5px ',
  },

  shortCode: {
    fontSize: 12,
    fontWeight: 'bold',
    padding: '5px 0',
  },
  title: {
    fontSize: 15,
    padding: '5px 0',
  },
  proposer: {
    fontSize: 12,
    padding: '5px 0',
    fontStyle: 'italic',
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
      <div className={classes.title}>
        <span className={classes.shortCode}>{proposal.shortCode}</span>:
        {proposal.title}
      </div>
      <div className={classes.proposer}>
        {`${proposal.proposer?.firstname} ${proposal.proposer?.lastname}`}
      </div>
    </div>
  );
}

export default ProposalBookingInfo;
