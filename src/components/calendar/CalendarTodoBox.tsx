import { Button, makeStyles } from '@material-ui/core';
import { Add as AddIcon, Info as InfoIcon } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';

import { useQuery } from 'hooks/common/useQuery';

import ProposalBookingTree from '../proposalBooking/ProposalBookingTree';

const useStyles = makeStyles(theme => ({
  flexBox: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
  },
  containerSpacing: {
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

type CalendarTodoBoxProps = { refreshCalendar: () => void };

export default function CalendarTodoBox({
  refreshCalendar,
}: CalendarTodoBoxProps) {
  const classes = useStyles();
  const query = useQuery();

  const queryInstrument = query.get('instrument');

  if (!queryInstrument) {
    return (
      <div
        className={clsx(
          classes.flexBox,
          classes.centered,
          classes.containerSpacing,
          classes.gray
        )}
      >
        <InfoIcon className={classes.bottomSpacing} fontSize="large" />
        Please select an instrument
      </div>
    );
  }

  return (
    <div className={clsx(classes.flexBox, classes.containerSpacing)}>
      <Button
        startIcon={<AddIcon />}
        fullWidth
        variant="contained"
        color="primary"
        className={classes.bottomSpacing}
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
