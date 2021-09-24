import { makeStyles } from '@material-ui/core';
import React from 'react';

import { BasicProposalBooking } from 'components/calendar/Event';
import { ScheduledEventStatusMap } from 'components/scheduledEvent/ScheduledEventForm';
import { ProposalBookingStatus } from 'generated/sdk';

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
  scheduledEventStatus: ProposalBookingStatus;
}
function ProposalBookingInfo({
  booking,
  scheduledEventStatus,
}: ProposalBookingInfoProps) {
  const classes = useStyles();
  const proposal = booking?.proposal;

  if (!proposal) {
    return null;
  }

  return (
    <div
      className={classes.container}
      data-cy={`proposal-event-${proposal.title}-${proposal.proposalId}`}
    >
      <div className={classes.proposalId}>
        [{ScheduledEventStatusMap[scheduledEventStatus]}] -{' '}
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
