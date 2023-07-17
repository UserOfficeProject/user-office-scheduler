import { Add as AddIcon, Info as InfoIcon } from '@mui/icons-material';
import { Button, useMediaQuery } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React, { Dispatch, SetStateAction } from 'react';

import ProposalBookingTree from 'components/proposalBooking/ProposalBookingTree';
import { useQuery } from 'hooks/common/useQuery';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';

type CalendarTodoBoxProps = {
  onNewSimpleEvent: () => void;
  refreshCalendar: () => void;
  setDraggedEvent: Dispatch<
    SetStateAction<{ proposalBookingId: number; instrumentId: number } | null>
  >;
  proposalBookings: InstrumentProposalBooking[];
};

export default function CalendarTodoBox({
  onNewSimpleEvent,
  refreshCalendar,
  setDraggedEvent,
  proposalBookings,
}: CalendarTodoBoxProps) {
  const isTabletOrMobile = useMediaQuery('(max-width: 1224px)');
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      height: '100%',
      flexDirection: 'column',
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      padding: isTabletOrMobile ? theme.spacing(2) : 0,
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
        setDraggedEvent={setDraggedEvent}
      />
    </div>
  );
}
