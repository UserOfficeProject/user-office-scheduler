import { Button, makeStyles, useMediaQuery } from '@material-ui/core';
import { Add as AddIcon, Info as InfoIcon } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';

import { useQuery } from 'hooks/common/useQuery';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';

import ProposalBookingTree from '../proposalBooking/ProposalBookingTree';

type CalendarTodoBoxProps = {
  onNewSimpleEvent: () => void;
  refreshCalendar: () => void;
  proposalBookings: InstrumentProposalBooking[];
};

export default function CalendarTodoBox({
  onNewSimpleEvent,
  refreshCalendar,
  proposalBookings,
}: CalendarTodoBoxProps) {
  const isTabletOrMobile = useMediaQuery('(max-width: 1224px)');
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      height: '100%',
      flexDirection: 'column',
      paddingTop: isTabletOrMobile ? theme.spacing(5) : theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    textCenter: {
      textAlign: 'center',
    },
    bottomSpacing: {
      marginBottom: theme.spacing(2),
    },
    gray: {
      color: theme.palette.grey[500],
    },
  }));
  const classes = useStyles();
  const query = useQuery();

  const queryInstrument = query.get('instrument');

  if (!queryInstrument) {
    return (
      <div
        className={clsx(
          classes.root,
          classes.centered,
          classes.textCenter,
          classes.gray
        )}
      >
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
        refreshCalendar={refreshCalendar}
        proposalBookings={proposalBookings}
      />
    </div>
  );
}
