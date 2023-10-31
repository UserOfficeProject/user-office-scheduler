import { Add as AddIcon, Info as InfoIcon } from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import moment from 'moment';
import React, { Dispatch, SetStateAction } from 'react';
import { useHistory } from 'react-router';

import ProposalBookingTree from 'components/proposalBooking/ProposalBookingTree';
import useInstrumentCalls from 'hooks/call/useInstrumentCalls';
import { useQuery } from 'hooks/common/useQuery';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';
import { getArrayOfIdsFromQuery } from 'utils/common';
import { TZ_LESS_DATE_TIME_FORMAT } from 'utils/date';

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

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(2),
    },
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

export default function CalendarTodoBox({
  onNewSimpleEvent,
  refreshCalendar,
  setDraggedEvent,
  proposalBookings,
}: CalendarTodoBoxProps) {
  const classes = useStyles();
  const query = useQuery();
  const history = useHistory();
  const queryInstrument = query.get('instrument');
  const callId = query.get('call');

  const { calls, loading } = useInstrumentCalls(
    getArrayOfIdsFromQuery(queryInstrument)
  );

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
            query.set(
              'callStartCycle',
              moment(call.startCycle).format(TZ_LESS_DATE_TIME_FORMAT)
            );
            query.set(
              'callEndCycle',
              moment(call.endCycle).format(TZ_LESS_DATE_TIME_FORMAT)
            );
          } else {
            query.delete('call');
            query.delete('callStartCycle');
            query.delete('callEndCycle');
            query.get('viewPeriod') === 'cycle' &&
              query.set('viewPeriod', 'week');
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
