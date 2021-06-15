import { makeStyles } from '@material-ui/core';
import React from 'react';

import { isDraftEvent } from 'components/calendar/Event';
import { ProposalBooking } from 'generated/sdk';

const useStyles = makeStyles(() => ({
  container: {
    padding: '10px 5px 5px 5px ',
  },
  title: {
    fontSize: 15,
    padding: '5px 0',
  },
  bookedBy: {
    fontSize: 12,
    padding: '5px 0',
    fontStyle: 'italic',
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
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <strong>
        {isDraftEvent(proposalBooking) ? '[DRAFT] - ' : ''}
        {name}
      </strong>
      <div className={classes.title}>{instrument}</div>
      <div className={classes.bookedBy}>{scheduledBy}</div>
    </div>
  );
}

export default EquipmentBookingInfo;
