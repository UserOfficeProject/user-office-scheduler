import {
  Button,
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

  const [visibleTimeStart, setVisibleTimeStart] = useState(
    moment().startOf('month')
  );

  const [visibleTimeEnd, setVisibleTimeEnd] = useState(moment().endOf('month'));

  const queryInstruments = query.get('instrument')?.split(',');

  const [selectedInstruments, setSelectedInstruments] = useState<
    PartialInstrument[] | undefined
  >([]);

  useEffect(() => {
    if (
      selectedInstruments?.length === 0 &&
      queryInstruments?.length !== 0 &&
      instruments
    ) {
      setSelectedInstruments(
        instruments.filter((item) => queryInstruments?.includes(`${item.id}`))
      );
    }
  }, [
    instruments,
    queryInstruments,
    setSelectedInstruments,
    selectedInstruments?.length,
  ]);

  const changeVisibleTimeBasedOnSelectedView = (
    currentTimelineViewPeriod: TimelineViewPeriods
  ) => {
    switch (currentTimelineViewPeriod) {
      case TimelineViewPeriods.MONTH:
        setVisibleTimeStart(moment().startOf('month'));
        setVisibleTimeEnd(moment().endOf('month'));

        return;
      case TimelineViewPeriods.QUARTER:
        setVisibleTimeStart(moment().startOf('month'));
        setVisibleTimeEnd(moment().add(3, 'months').startOf('month'));

        return;
      case TimelineViewPeriods.HALF_YEAR:
        setVisibleTimeStart(moment().startOf('month'));
        setVisibleTimeEnd(moment().add(6, 'months').startOf('month'));

        return;
      default:
        break;
    }
  };

  useEffect(() => {
    changeVisibleTimeBasedOnSelectedView(timelineViewPeriod);
  }, [timelineViewPeriod]);

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
    // title: getEventTitle(event),
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

  const getVisibleTimeStart = (sign: string) => {
    switch (timelineViewPeriod) {
      case TimelineViewPeriods.MONTH:
        return moment(visibleTimeStart)
          .add(`${sign}1`, 'month')
          .startOf('month');
      case TimelineViewPeriods.QUARTER:
        return moment(visibleTimeStart)
          .add(`${sign}3`, 'months')
          .startOf('month');
      case TimelineViewPeriods.HALF_YEAR:
        return moment(visibleTimeStart)
          .add(`${sign}6`, 'months')
          .startOf('month');
      default:
        return moment().startOf('month');
    }
  };

  const getVisibleTimeEnd = (sign: string) => {
    switch (timelineViewPeriod) {
      case TimelineViewPeriods.MONTH:
        return moment(visibleTimeEnd).add(`${sign}1`, 'month').endOf('month');
      case TimelineViewPeriods.QUARTER:
        return moment(visibleTimeEnd)
          .add(`${sign}3`, 'months')
          .startOf('month');
      case TimelineViewPeriods.HALF_YEAR:
        return moment(visibleTimeEnd)
          .add(`${sign}6`, 'months')
          .startOf('month');
      default:
        return moment().endOf('month');
    }
  };

  const onPrevClick = () => {
    const newVisibleTimeStart = getVisibleTimeStart('-');
    const newVisibleTimeEnd = getVisibleTimeEnd('-');

    setVisibleTimeStart(newVisibleTimeStart);
    setVisibleTimeEnd(newVisibleTimeEnd);
  };

  const onNextClick = () => {
    const newVisibleTimeStart = getVisibleTimeStart('+');
    const newVisibleTimeEnd = getVisibleTimeEnd('+');

    setVisibleTimeStart(newVisibleTimeStart);
    setVisibleTimeEnd(newVisibleTimeEnd);
  };

  const onTodayClick = () => {
    changeVisibleTimeBasedOnSelectedView(timelineViewPeriod);
  };

  console.log(visibleTimeStart, visibleTimeEnd);

  return (
    <div data-cy="calendar-timeline-view" className={classes.root}>
      <div
        data-cy="calendar-timeline-view-toolbar"
        style={{ marginBottom: '16px' }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item sm={6} xs={12}>
            <Grid container spacing={2}>
              <Grid item sm={4} xs={12}>
                <Button
                  variant="contained"
                  onClick={onTodayClick}
                  data-cy="btn-view-today"
                  fullWidth
                >
                  Today
                </Button>
              </Grid>
              <Grid item sm={4} xs={12}>
                <Button
                  variant="contained"
                  onClick={onPrevClick}
                  data-cy="btn-view-prev"
                  fullWidth
                >
                  Back
                </Button>
              </Grid>
              <Grid item sm={4} xs={12}>
                <Button
                  variant="contained"
                  onClick={onNextClick}
                  data-cy="btn-view-next"
                  fullWidth
                >
                  Next
                </Button>
              </Grid>
            </Grid>
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
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
        stackItems
        canMove={false}
        canResize={false}
      />
    </div>
  );
};

export default TimeLineView;
