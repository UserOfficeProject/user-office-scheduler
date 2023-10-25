import { Add as AddIcon, Info as InfoIcon } from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React, { Dispatch, SetStateAction } from 'react';
import { useHistory } from 'react-router';

import ProposalBookingTree from 'components/proposalBooking/ProposalBookingTree';
import useInstrumentCalls from 'hooks/call/useInstrumentCalls';
import { useQuery } from 'hooks/common/useQuery';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';

export type DraggingEventType = {
  proposalBookingId: number;
  instrumentId: number;
  timeToAllocate: number;
};

type CalendarTodoBoxProps = {
  onNewSimpleEvent: () => void;
  refreshCalendar: () => void;
  setDraggedEvent: Dispatch<SetStateAction<DraggingEventType | null>>;
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
  const history = useHistory();
  const { calls, loading } = useInstrumentCalls();

  const queryInstrument = query.get('instrument');
  const callId = query.get('call');

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

      <Autocomplete
        id="call-select"
        aria-labelledby="call-select-label"
        loading={loading}
        onChange={(_, call) => {
          if (call) {
            query.set('call', `${call?.id}`);
          } else {
            query.delete('call');
          }
          history.push(`?${query}`);
        }}
        getOptionLabel={(option) => option.shortCode}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        options={calls}
        value={calls.find((v) => v.id.toString() === callId) || null}
        data-cy="call-filter"
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Call" />
        )}
        sx={{ marginBottom: 1 }}
      />

      <ProposalBookingTree
        refreshCalendar={refreshCalendar}
        proposalBookings={proposalBookings}
        setDraggedEvent={setDraggedEvent}
      />
    </div>
  );
}
