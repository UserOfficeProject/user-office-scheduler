import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

import { BasicProposalBooking } from 'components/calendar/common/Event';
import { ScheduledEventStatusMap } from 'components/scheduledEvent/ScheduledEventForm';
import { ProposalBookingStatusCore } from 'generated/sdk';
import { getFullUserName } from 'utils/user';

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
  scheduledEventStatus: ProposalBookingStatusCore;
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
        {getFullUserName(proposal.proposer)}
      </div>
    </div>
  );
}

export default ProposalBookingInfo;
