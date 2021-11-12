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
import * as H from 'history';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View } from 'react-big-calendar';
import Timeline, {
  DateHeader,
  SidebarHeader,
  TimelineHeaders,
} from 'react-calendar-timeline';
// @ts-expect-error @types/react-calendar-timeline is not updated with tle latest changes on react-calendar-timeline
import containerResizeDetector from 'react-calendar-timeline/lib/resize-detector/container';
import 'react-calendar-timeline/lib/Timeline.css';
import { useHistory } from 'react-router';

import { useQuery } from 'hooks/common/useQuery';
import { PartialInstrument } from 'hooks/instrument/useUserInstruments';
import { toTzLessDateTime } from 'utils/date';

import { getInstrumentIdsFromQuery } from './Calendar';
import { CalendarScheduledEvent, getBookingTypeStyle } from './Event';

type TimeLineViewProps = {
  events: CalendarScheduledEvent[];
  instruments: PartialInstrument[];
  instrumentsLoading: boolean;
  onSelectEvent: (selectedEvent: CalendarScheduledEvent) => void;
  startsAt: Date;
  setStartAt: React.Dispatch<React.SetStateAction<Date>>;
};

// NOTE: Debounce the function because there are too many calls on scroll so we want to avoid bombarding the backend with so many requests for new events
const handleTimeChange = debounce(
  (
    newStart: moment.Moment,
    setStartAt: React.Dispatch<React.SetStateAction<Date>>,
    query: URLSearchParams,
    history: H.History
  ) => {
    setStartAt(moment(newStart).toDate());
    query.set('timeLineStart', `${moment(newStart)}`);
    history.push(`?${query}`);
  },
  500
);

const useStyles = makeStyles((theme) => ({
  root: {
    '& .react-calendar-timeline .rct-header-root': {
      background: theme.palette.primary.main,

      '& .primaryHeader .customPrimaryHeader ~ .customPrimaryHeader': {
        display: 'none',
      },

      '& .customPrimaryHeader': {
        left: '0 !important',
        width: '100% !important',
        textAlign: 'center',
        padding: theme.spacing(0.5),
        color: '#fff',
      },
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
  startsAt,
  setStartAt,
}) => {
  const query = useQuery();
  const history = useHistory();
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-width: 648px)');

  const queryView = query.get('viewPeriod') as View;
  const queryInstrument = query.get('instrument');

  const [timelineViewPeriod, setTimelineViewPeriod] = useState(
    queryView || 'week'
  );
  const defaultVisibleTimeStart = moment(startsAt);
  const defaultVisibleTimeEnd = moment(startsAt).add(
    1,
    timelineViewPeriod as moment.unitOfTime.DurationConstructor
  );

  const [visibleTimeStart, setVisibleTimeStart] = useState(
    defaultVisibleTimeStart
  );
  const [visibleTimeEnd, setVisibleTimeEnd] = useState(defaultVisibleTimeEnd);
  const [isInitialized, setIsInitialized] = useState(false);

  const [selectedInstruments, setSelectedInstruments] = useState<
    PartialInstrument[]
  >([]);

  useEffect(() => {
    const queryInstrumentIds = getInstrumentIdsFromQuery(queryInstrument);

    if (
      selectedInstruments?.length === 0 &&
      queryInstrumentIds.length !== 0 &&
      instruments
    ) {
      setSelectedInstruments(
        instruments.filter((item) => queryInstrumentIds.includes(item.id))
      );
    }
  }, [
    instruments,
    queryInstrument,
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
    currentTimelinePeriod: View
  ) => {
    switch (currentTimelinePeriod) {
      case 'day':
        switch (changeOperator) {
          case 'PREV':
            return {
              newVisibleTimeStart: moment(visibleTimeStart).subtract(1, 'day'),
              newVisibleTimeEnd: moment(visibleTimeEnd).subtract(1, 'day'),
            };

          case 'TODAY':
            return {
              newVisibleTimeStart: moment().startOf('day'),
              newVisibleTimeEnd: moment().endOf('day'),
            };

          case 'NEXT':
            return {
              newVisibleTimeStart: moment(visibleTimeStart).add(1, 'day'),
              newVisibleTimeEnd: moment(visibleTimeEnd).add(1, 'day'),
            };

          case 'PERIOD':
            return {
              newVisibleTimeStart: moment().startOf('day'),
              newVisibleTimeEnd: moment().endOf('day'),
            };
        }
      case 'week':
        switch (changeOperator) {
          case 'PREV':
            return {
              newVisibleTimeStart: moment(visibleTimeStart).subtract(1, 'week'),
              newVisibleTimeEnd: moment(visibleTimeEnd).subtract(1, 'week'),
            };

          case 'TODAY':
            return {
              newVisibleTimeStart: moment().startOf('week'),
              newVisibleTimeEnd: moment().endOf('week'),
            };

          case 'NEXT':
            return {
              newVisibleTimeStart: moment(visibleTimeStart).add(1, 'week'),
              newVisibleTimeEnd: moment(visibleTimeEnd).add(1, 'week'),
            };

          case 'PERIOD':
            return {
              newVisibleTimeStart: moment().startOf('week'),
              newVisibleTimeEnd: moment().endOf('week'),
            };
        }
      default:
        switch (changeOperator) {
          case 'PREV':
            return {
              newVisibleTimeStart: moment(visibleTimeStart).subtract(
                1,
                'month'
              ),
              newVisibleTimeEnd: moment(visibleTimeEnd).subtract(1, 'month'),
            };

          case 'TODAY':
            return {
              newVisibleTimeStart: moment().startOf('month'),
              newVisibleTimeEnd: moment().endOf('month'),
            };

          case 'NEXT':
            return {
              newVisibleTimeStart: moment(visibleTimeStart).add(1, 'month'),
              newVisibleTimeEnd: moment(visibleTimeEnd).add(1, 'month'),
            };

          case 'PERIOD':
            return {
              newVisibleTimeStart: moment(visibleTimeStart).startOf('month'),
              newVisibleTimeEnd: moment(visibleTimeStart).endOf('month'),
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

    setStartAt(newVisibleTimeStart.toDate());
    query.set('viewPeriod', currentTimelinePeriod);
    history.push(`?${query}`);
  };

  const onTimeChange = (visibleTimeStart1: number, visibleTimeEnd1: number) => {
    const newStart = moment(visibleTimeStart1);
    const newEnd = moment(visibleTimeEnd1);

    setVisibleTimeStart(newStart);
    setVisibleTimeEnd(newEnd);

    if (!isInitialized) {
      setIsInitialized(true);

      return;
    }

    handleTimeChange(newStart, setStartAt, query, history);
  };

  const getPrimaryHeaderText = () => {
    const sameStartAndEndMonth =
      moment(visibleTimeStart).month() === moment(visibleTimeEnd).month();

    const intervalEndDateFormat = sameStartAndEndMonth ? 'DD' : 'MMMM DD';

    const weekViewIntervalText = `${moment(visibleTimeStart).format(
      'MMMM DD'
    )} - ${moment(visibleTimeEnd).format(intervalEndDateFormat)}`;

    return weekViewIntervalText;
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
                  setTimelineViewPeriod(e.target.value as View);
                  onNavClick('PERIOD', e.target.value as View);

                  if (e.target.value) {
                    query.set('viewPeriod', e.target.value as string);
                    history.push(`?${query}`);
                  }
                }}
                data-cy="timeline-view-period"
              >
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
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
        onTimeChange={onTimeChange}
      >
        {timelineViewPeriod === 'week' && (
          <TimelineHeaders>
            <SidebarHeader>
              {({ getRootProps }) => {
                return <div {...getRootProps()} />;
              }}
            </SidebarHeader>
            <DateHeader
              unit="primaryHeader"
              className="primaryHeader"
              intervalRenderer={(props) => {
                if (!props) {
                  return;
                }
                const { getIntervalProps } = props;

                return (
                  <div className="customPrimaryHeader" {...getIntervalProps()}>
                    {getPrimaryHeaderText()}
                  </div>
                );
              }}
            />
            <DateHeader />
          </TimelineHeaders>
        )}
      </Timeline>
    </div>
  );
};

export default TimeLineView;
