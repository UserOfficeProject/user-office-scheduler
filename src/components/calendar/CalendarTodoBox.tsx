import { Button, makeStyles } from '@material-ui/core';
import { Add as AddIcon, Info as InfoIcon } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';

import { useQuery } from 'hooks/common/useQuery';

import ProposalBookingTree from '../proposalBooking/ProposalBookingTree';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    marginBottom: theme.spacing(2),
  },
  gray: {
    color: theme.palette.grey[500],
  },
}));

type CalendarTodoBoxProps = {
  onNewSimpleEvent: () => void;
  refreshCalendar: () => void;
};

export default function CalendarTodoBox({
  onNewSimpleEvent,
  refreshCalendar,
}: CalendarTodoBoxProps) {
  const classes = useStyles();
  const query = useQuery();

  const queryInstrument = query.get('instrument');

  if (!queryInstrument) {
    return (
      <div className={clsx(classes.root, classes.centered, classes.gray)}>
        <InfoIcon className={classes.bottomSpacing} fontSize="large" />
        Please select an instrument
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Button
        startIcon={<AddIcon />}
        fullWidth
        variant="contained"
        color="primary"
        className={classes.bottomSpacing}
        onClick={onNewSimpleEvent}
        data-cy="btn-new-event"
      >
        New event
      </Button>

      <ProposalBookingTree
        instrument={queryInstrument}
        refreshCalendar={refreshCalendar}
      />
    </div>
  );
}
