import { makeStyles } from '@material-ui/core';
import React from 'react';

import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';

const useStyles = makeStyles(theme => ({
  heading1: {
    fontSize: '17px',
    fontWeight: 'normal',
    margin: '10px 0 0 0',
    lineHeight: 1.2,
    padding: 0,
  },
  heading2: {
    fontSize: '14px',
    fontWeight: 'normal',
    fontStyle: 'italic',
    margin: 0,
    padding: 0,
    color: '#888',
  },
}));

interface ProposalBookingTreeTitleProps {
  proposalBooking: InstrumentProposalBooking;
}

function ProposalBookingTreeTitle({
  proposalBooking,
}: ProposalBookingTreeTitleProps) {
  const classes = useStyles();

  if (!proposalBooking.proposal) {
    return null;
  }

  return (
    <>
      <h1 className={classes.heading1}>{proposalBooking.proposal.title}</h1>
      <h2 className={classes.heading2}>Allocated/Allocatable</h2>
    </>
  );
}

export default ProposalBookingTreeTitle;
