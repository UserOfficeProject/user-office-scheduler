import {
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import { useHistory } from 'react-router';

import { useQuery } from 'hooks/common/useQuery';
import { PartialInstrument } from 'hooks/instrument/useUserInstruments';

import { CalendarScheduledEvent, getBookingTypeStyle } from './Event';

enum TimelineViewPeriods {
  MONTH = '1 month',
  QUARTER = '3 months',
  HALF_YEAR = '6 months',
}

type TimeLineViewProps = {
  events: CalendarScheduledEvent[];
  instruments: PartialInstrument[];
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& .react-calendar-timeline .rct-header-root': {
      background: theme.palette.primary.main,
    },
  },
}));

const TimeLineView: React.FC<TimeLineViewProps> = ({ events, instruments }) => {
  const query = useQuery();
  const history = useHistory();
  const classes = useStyles();

  const [timelineViewPeriod, setTimelineViewPeriod] = useState(
    TimelineViewPeriods.MONTH
  );

  const queryInstrument = query.get('instrument');

  const [queryValueInitialized, setQueryValueInitialized] = useState(
    !queryInstrument // if the link has query instrument query value when rendering this component
  );

  const [selectedInstruments, setSelectedInstruments] = useState<
    PartialInstrument[] | undefined
  >([]);

  useEffect(() => {
    if (queryInstrument) {
      const found = instruments.find(({ id }) => `${id}` === queryInstrument);

      console.log(found);

      found && setSelectedInstruments([found]);
      setQueryValueInitialized(true);
    }
  }, [instruments, queryInstrument, setSelectedInstruments]);

  // useEffect(() => {
  //   if (!queryValueInitialized || (!selectedInstruments && !queryInstrument)) {
  //     return;
  //   }

  //   if (!selectedInstruments && queryInstrument) {
  //     query.delete('instrument');
  //   } else if (
  //     selectedInstruments &&
  //     queryInstrument !== `${selectedInstruments[0]?.id}`
  //   ) {
  //     query.set('instrument', `${selectedInstruments[0]?.id}`);
  //   } else {
  //     return;
  //   }

  //   history.push(`?${query}`);
  // }, [
  //   queryValueInitialized,
  //   selectedInstruments,
  //   queryInstrument,
  //   query,
  //   history,
  // ]);

  const onInstrumentSelect = (
    selectedInstruments: PartialInstrument[] | undefined
  ) => {
    setSelectedInstruments(selectedInstruments);
  };

  const instrumentGroups = [];
  const map = new Map();
  for (const item of events) {
    if (item.instrument && !map.has(item.instrument.id)) {
      map.set(item.instrument?.id, true); // set any value to Map
      instrumentGroups.push({
        id: item.instrument.id,
        title: item.instrument.name,
      });
    }
  }

  const getEventTitle = (event: CalendarScheduledEvent) => {
    return `${event.proposalBooking?.proposal?.title} (${event.proposalBooking?.proposal?.proposalId})`;
  };

  const eventItems = events.map((event) => ({
    id: event.id,
    group: event.instrument!.id,
    title: getEventTitle(event),
    itemProps: {
      onClick: () => {
        console.log('You clicked', event);
      },
      style: {
        background: getBookingTypeStyle(event.bookingType, event.status)
          .backgroundColor,
      },
    },
    start_time: moment(event.start),
    end_time: moment(event.end),
  }));

  const visibleTimeEnd = () => {
    switch (timelineViewPeriod) {
      case TimelineViewPeriods.MONTH:
        return moment().endOf('month').valueOf();
      case TimelineViewPeriods.QUARTER:
        return moment().add(3, 'months').startOf('month').valueOf();
      case TimelineViewPeriods.HALF_YEAR:
        return moment().add(6, 'months').startOf('month').valueOf();

      default:
        break;
    }
  };

  console.log(selectedInstruments);

  return (
    <div data-cy="calendar-timeline-view" className={classes.root}>
      <div
        data-cy="calendar-timeline-view-toolbar"
        style={{ marginBottom: '16px' }}
      >
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="timeline-view-period">View period</InputLabel>
              <Select
                value={timelineViewPeriod}
                label="View period"
                labelId="timeline-view-period"
                margin="dense"
                onChange={(e) =>
                  setTimelineViewPeriod(e.target.value as TimelineViewPeriods)
                }
                data-cy="timeline-view-period"
              >
                <MenuItem value={TimelineViewPeriods.MONTH}>1 month</MenuItem>
                <MenuItem value={TimelineViewPeriods.QUARTER}>
                  3 months
                </MenuItem>
                <MenuItem value={TimelineViewPeriods.HALF_YEAR}>
                  6 months
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Autocomplete
              multiple
              // loading={instrumentsLoading}
              // disabled={instrumentsLoading}
              selectOnFocus
              fullWidth
              clearOnBlur
              handleHomeEndKeys
              options={instruments}
              getOptionLabel={(instrument) => instrument.name}
              data-cy="table-toolbar-instrument-select"
              id="table-toolbar-instrument-select"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Instruments"
                  // disabled={instrumentsLoading}
                  margin="dense"
                />
              )}
              value={selectedInstruments}
              onChange={(
                event: React.ChangeEvent<unknown>,
                newValue: PartialInstrument[] | undefined
              ) => {
                if (newValue === undefined || newValue.length === 0) {
                  query.delete('instrument');
                } else {
                  query.set(
                    'instrument',
                    `${newValue?.map((instrument) => instrument.id).join(',')}`
                  );
                }
                setSelectedInstruments(newValue);
                history.push(`?${query}`);
                // onInstrumentSelect(newValue);
              }}
            />
          </Grid>
        </Grid>
      </div>
      <Timeline
        groups={instrumentGroups}
        items={eventItems}
        visibleTimeStart={moment().startOf('month').valueOf()}
        visibleTimeEnd={visibleTimeEnd()}
        stackItems
        canMove={false}
        canResize={false}
      />
    </div>
  );
};

export default TimeLineView;
