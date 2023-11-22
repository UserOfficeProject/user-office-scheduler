import React from 'react';
import { makeStyles } from 'tss-react/mui';

import {
  isCompletedEvent,
  isDraftEvent,
} from 'components/calendar/common/Event';
import { ProposalBooking } from 'generated/sdk';

const useStyles = makeStyles()(() => ({
  container: {
    paddingTop: '3px',
    display: 'flex',
    flexWrap: 'wrap',
  },
  name: {
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
  bookedBy: {
    fontSize: 12,
    fontStyle: 'italic',
    padding: '1px 2px 0 0',
  },
}));

interface EquipmentBookingInfoProps {
  name: string;
  scheduledBy: string;
  instrument: string;
  proposalBooking?: Pick<ProposalBooking, 'status'> | null;
}
function EquipmentBookingInfo({
  name,
  scheduledBy,
  instrument,
  proposalBooking,
}: EquipmentBookingInfoProps) {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.name}>
        {isDraftEvent(proposalBooking) ? '[Draft] - ' : ''}
        {isCompletedEvent(proposalBooking) ? '[Completed] - ' : ''}
        {name}
      </div>
      <div className={classes.title}>{instrument}</div>
      <div className={classes.bookedBy}>{scheduledBy}</div>
    </div>
  );
}

export default EquipmentBookingInfo;
