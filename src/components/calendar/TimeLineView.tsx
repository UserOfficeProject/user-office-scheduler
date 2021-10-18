import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import generateScheduledEventFilter from 'filters/scheduledEvent/scheduledEventsFilter';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Timeline from 'react-calendar-timeline';
// @ts-expect-error @types/react-calendar-timeline is not updated with tle latest changes on react-calendar-timeline
import containerResizeDetector from 'react-calendar-timeline/lib/resize-detector/container';
import 'react-calendar-timeline/lib/Timeline.css';
import { useHistory } from 'react-router';

import { ScheduledEventFilter } from 'generated/sdk';
import { useQuery } from 'hooks/common/useQuery';
import { PartialInstrument } from 'hooks/instrument/useUserInstruments';
import { toTzLessDateTime } from 'utils/date';

import { ExtendedView } from './Calendar';
import { CalendarScheduledEvent, getBookingTypeStyle } from './Event';

enum TimelineViewPeriods {
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  HALF_YEAR = 'half_year',
}

type TimeLineViewProps = {
  events: CalendarScheduledEvent[];
  instruments: PartialInstrument[];
  instrumentsLoading: boolean;
  onSelectEvent: (selectedEvent: CalendarScheduledEvent) => void;
  setFilter: React.Dispatch<React.SetStateAction<ScheduledEventFilter>>;
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& .react-calendar-timeline .rct-header-root': {
      background: theme.palette.primary.main,
    },
    '& .react-calendar-timeline .rct-items .rct-item .rct-item-content': {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
    },
  },
  toolbar: {
    marginBottom: theme.spacing(2),
  },
  toolbarMobile: {
    marginTop: theme.spacing(2),
  },
}));

const TimeLineView: React.FC<TimeLineViewProps> = ({
  events,
  instruments,
  instrumentsLoading,
  onSelectEvent,
  setFilter,
}) => {
  const query = useQuery();
  const history = useHistory();
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-width: 648px)');

  const queryView = query.get('viewPeriod');
  const queryInstruments = query.get('instrument')?.split(',');

  const [timelineViewPeriod, setTimelineViewPeriod] = useState(
    (queryView as TimelineViewPeriods) || TimelineViewPeriods.WEEK
  );
  const defaultVisibleTimeEnd =
    timelineViewPeriod !== TimelineViewPeriods.HALF_YEAR
      ? moment().endOf(timelineViewPeriod)
      : moment().add(6, 'months').startOf('month');

  const defaultVisibleTimeStart =
    timelineViewPeriod === TimelineViewPeriods.WEEK
      ? moment().startOf('week')
      : moment().startOf('month');

  const [visibleTimeStart, setVisibleTimeStart] = useState(
    defaultVisibleTimeStart
  );
  const [visibleTimeEnd, setVisibleTimeEnd] = useState(defaultVisibleTimeEnd);

  const [selectedInstruments, setSelectedInstruments] = useState<
    PartialInstrument[]
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

  const instrumentGroups = selectedInstruments.map((selectedInstrument) => ({
    id: selectedInstrument.id,
    title: selectedInstrument.name,
  }));

  const getEventTitle = (event: CalendarScheduledEvent) => {
    return `${event.proposalBooking?.proposal?.title || event.title} (${
      event.proposalBooking?.proposal?.proposalId || event.description
    }) - [${toTzLessDateTime(event.start)} - ${toTzLessDateTime(
      event.end
    )}] - ${event.status}`;
  };

  const eventItems = events.map((event) => ({
    id: `${event.id}_${event.bookingType}`,
    group: event.instrument?.id || 0,
    title: getEventTitle(event),
    itemProps: {
      onClick: () => onSelectEvent(event),
      onTouchStart: () => onSelectEvent(event),
      style: {
        ...getBookingTypeStyle(event.bookingType, event.status),
        overflow: 'hidden',
      },
    },
    start_time: moment(event.start),
    end_time: moment(event.end),
  }));

  const getVisibleTimeInterval = (
    changeOperator: 'PREV' | 'TODAY' | 'NEXT' | 'PERIOD',
    currentTimelinePeriod: TimelineViewPeriods
  ) => {
    switch (currentTimelinePeriod) {
      case TimelineViewPeriods.WEEK:
        switch (changeOperator) {
          case 'PREV':
            return {
              newVisibleTimeStart: moment(visibleTimeEnd)
                .subtract(1, 'week')
                .startOf('week'),
              newVisibleTimeEnd: moment(visibleTimeEnd)
                .subtract(1, 'week')
                .endOf('week'),
            };

          case 'TODAY':
            return {
              newVisibleTimeStart: moment().startOf('week'),
              newVisibleTimeEnd: moment().endOf('week'),
            };

          case 'NEXT':
            return {
              newVisibleTimeStart: moment(visibleTimeStart)
                .add(1, 'week')
                .startOf('week'),
              newVisibleTimeEnd: moment(visibleTimeEnd)
                .add(1, 'week')
                .endOf('week'),
            };

          case 'PERIOD':
            return {
              newVisibleTimeStart: moment().startOf('week'),
              newVisibleTimeEnd: moment().endOf('week'),
            };
        }
      case TimelineViewPeriods.MONTH:
        switch (changeOperator) {
          case 'PREV':
            return {
              newVisibleTimeStart: moment(visibleTimeEnd)
                .subtract(1, 'month')
                .startOf('month'),
              newVisibleTimeEnd: moment(visibleTimeEnd)
                .subtract(1, 'month')
                .endOf('month'),
            };

          case 'TODAY':
            return {
              newVisibleTimeStart: moment().startOf('month'),
              newVisibleTimeEnd: moment().endOf('month'),
            };

          case 'NEXT':
            return {
              newVisibleTimeStart: moment(visibleTimeStart)
                .add(1, 'month')
                .startOf('month'),
              newVisibleTimeEnd: moment(visibleTimeEnd)
                .add(1, 'month')
                .endOf('month'),
            };

          case 'PERIOD':
            return {
              newVisibleTimeStart: moment(visibleTimeStart).startOf('month'),
              newVisibleTimeEnd: moment(visibleTimeStart).endOf('month'),
            };
        }
      case TimelineViewPeriods.QUARTER:
        switch (changeOperator) {
          case 'PREV':
            return {
              newVisibleTimeStart: moment(visibleTimeStart)
                .subtract(3, 'month')
                .startOf('month'),
              newVisibleTimeEnd: moment(visibleTimeEnd)
                .subtract(3, 'month')
                .startOf('month'),
            };

          case 'TODAY':
            return {
              newVisibleTimeStart: moment().startOf('month'),
              newVisibleTimeEnd: moment().add(3, 'month').startOf('month'),
            };

          case 'NEXT':
            return {
              newVisibleTimeStart: moment(visibleTimeStart)
                .add(3, 'month')
                .startOf('month'),
              newVisibleTimeEnd: moment(visibleTimeEnd)
                .add(3, 'month')
                .startOf('month'),
            };

          case 'PERIOD':
            return {
              newVisibleTimeStart: moment(visibleTimeStart).startOf('month'),
              newVisibleTimeEnd: moment(visibleTimeStart)
                .add(3, 'months')
                .startOf('month'),
            };
        }
      case TimelineViewPeriods.HALF_YEAR:
        switch (changeOperator) {
          case 'PREV':
            return {
              newVisibleTimeStart: moment(visibleTimeStart)
                .subtract(6, 'month')
                .startOf('month'),
              newVisibleTimeEnd: moment(visibleTimeEnd)
                .subtract(6, 'month')
                .startOf('month'),
            };

          case 'TODAY':
            return {
              newVisibleTimeStart: moment().startOf('month'),
              newVisibleTimeEnd: moment().add(6, 'month').startOf('month'),
            };

          case 'NEXT':
            return {
              newVisibleTimeStart: moment(visibleTimeStart)
                .add(6, 'month')
                .startOf('month'),
              newVisibleTimeEnd: moment(visibleTimeEnd)
                .add(6, 'month')
                .startOf('month'),
            };

          case 'PERIOD':
            return {
              newVisibleTimeStart: moment(visibleTimeStart).startOf('month'),
              newVisibleTimeEnd: moment(visibleTimeStart)
                .add(6, 'months')
                .startOf('month'),
            };
        }
    }
  };

  const onNavClick = (
    direction: 'PREV' | 'NEXT' | 'TODAY' | 'PERIOD',
    currentTimelinePeriod = timelineViewPeriod
  ) => {
    const { newVisibleTimeStart, newVisibleTimeEnd } = getVisibleTimeInterval(
      direction,
      currentTimelinePeriod
    );

    setVisibleTimeStart(newVisibleTimeStart);
    setVisibleTimeEnd(newVisibleTimeEnd);

    setFilter(
      generateScheduledEventFilter(
        queryInstruments?.map((item) => parseInt(item)),
        newVisibleTimeStart.toDate(),
        currentTimelinePeriod as ExtendedView
      )
    );

    query.set('viewPeriod', currentTimelinePeriod);
    history.push(`?${query}`);
  };

  return (
    <div data-cy="calendar-timeline-view" className={classes.root}>
      <div
        data-cy="calendar-timeline-view-toolbar"
        className={`${classes.toolbar} ${isMobile && classes.toolbarMobile}`}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item sm={6} xs={12}>
            <Grid container spacing={2}>
              <Grid item sm={4} xs={12}>
                <Button
                  variant="contained"
                  onClick={() => onNavClick('PREV')}
                  data-cy="btn-view-prev"
                  fullWidth
                >
                  Back
                </Button>
              </Grid>
              <Grid item sm={4} xs={12}>
                <Button
                  variant="contained"
                  onClick={() => onNavClick('TODAY')}
                  data-cy="btn-view-today"
                  fullWidth
                >
                  Today
                </Button>
              </Grid>
              <Grid item sm={4} xs={12}>
                <Button
                  variant="contained"
                  onClick={() => onNavClick('NEXT')}
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
                onChange={(e) => {
                  setTimelineViewPeriod(e.target.value as TimelineViewPeriods);
                  onNavClick('PERIOD', e.target.value as TimelineViewPeriods);

                  if (e.target.value) {
                    query.set('viewPeriod', e.target.value as string);
                    history.push(`?${query}`);
                  }
                }}
                data-cy="timeline-view-period"
              >
                <MenuItem value={TimelineViewPeriods.WEEK}>1 week</MenuItem>
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
              loading={instrumentsLoading}
              disabled={instrumentsLoading}
              selectOnFocus
              fullWidth
              clearOnBlur
              handleHomeEndKeys
              options={instruments}
              getOptionLabel={(instrument) => instrument.name}
              data-cy="timeline-toolbar-instrument-select"
              id="timeline-toolbar-instrument-select"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Instruments"
                  disabled={instrumentsLoading}
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
                setSelectedInstruments(newValue || []);
                history.push(`?${query}`);
              }}
            />
          </Grid>
        </Grid>
      </div>
      <Timeline
        groups={instrumentGroups}
        items={eventItems}
        visibleTimeStart={visibleTimeStart.valueOf()}
        visibleTimeEnd={visibleTimeEnd.valueOf()}
        resizeDetector={containerResizeDetector}
        stackItems
        canMove={false}
        canResize={false}
      />
    </div>
  );
};

export default TimeLineView;
