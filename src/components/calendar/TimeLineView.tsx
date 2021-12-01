import { makeStyles } from '@material-ui/core';
import * as H from 'history';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Views } from 'react-big-calendar';
import Timeline, {
  DateHeader,
  SidebarHeader,
  TimelineHeaders,
} from 'react-calendar-timeline';
// @ts-expect-error @types/react-calendar-timeline is not updated with tle latest changes on react-calendar-timeline
import containerResizeDetector from 'react-calendar-timeline/lib/resize-detector/container';
import 'react-calendar-timeline/lib/Timeline.css';
import { useHistory } from 'react-router';

import { InstrumentAndEquipmentContext } from 'context/InstrumentAndEquipmentContext';
import { ScheduledEventFilter } from 'generated/sdk';
import { useQuery } from 'hooks/common/useQuery';
import { PartialInstrument } from 'hooks/instrument/useUserInstruments';
import { toTzLessDateTime, TZ_LESS_DATE_TIME_FORMAT } from 'utils/date';

import {
  CalendarScheduledEventWithUniqeId,
  getInstrumentIdsFromQuery,
  SchedulerViewPeriod,
} from './CalendarViewContainer';
import { getBookingTypeStyle } from './Event';
import 'moment/locale/en-gb';
import Toolbar, { getLabelText } from './Toolbar';

type TimeLineViewProps = {
  events: CalendarScheduledEventWithUniqeId[];
  filter: ScheduledEventFilter;
  onSelectEvent: (selectedEvent: CalendarScheduledEventWithUniqeId) => void;
};

// NOTE: Debounce the function because there are too many calls on scroll so we want to avoid bombarding the backend with so many requests for new events
const handleTimeChange = debounce(
  (newStart: moment.Moment, query: URLSearchParams, history: H.History) => {
    query.set('startsAt', newStart.format(TZ_LESS_DATE_TIME_FORMAT));
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
}));

const TimeLineView: React.FC<TimeLineViewProps> = ({
  events,
  filter,
  onSelectEvent,
}) => {
  const { instruments } = useContext(InstrumentAndEquipmentContext);
  const query = useQuery();
  const history = useHistory();
  const classes = useStyles();

  const queryView =
    (query.get('viewPeriod') as SchedulerViewPeriod) || Views.WEEK;
  const startsAt = query.get('startsAt');
  const queryInstrument = query.get('instrument');

  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedInstruments, setSelectedInstruments] = useState<
    PartialInstrument[]
  >([]);

  const initialVisibleTimeStart = moment
    .utc(startsAt || moment().startOf(queryView))
    .local();
  const initialVisibleTimeEnd = moment(initialVisibleTimeStart).add(
    1,
    queryView
  );

  const [visibleTimeStart, setVisibleTimeStart] = useState(
    initialVisibleTimeStart
  );
  const [visibleTimeEnd, setVisibleTimeEnd] = useState(initialVisibleTimeEnd);

  useEffect(() => {
    if (startsAt) {
      const newVisibleTimeStart = moment.utc(startsAt).local();
      const newVisibleTimeEnd = moment(newVisibleTimeStart).add(1, queryView);

      setVisibleTimeStart(newVisibleTimeStart);
      setVisibleTimeEnd(newVisibleTimeEnd);
    }
  }, [startsAt, queryView]);

  useEffect(() => {
    const queryInstrumentIds = getInstrumentIdsFromQuery(queryInstrument);

    if (queryInstrumentIds?.length !== 0 && instruments.length) {
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

  const getEventTitle = (event: CalendarScheduledEventWithUniqeId) => {
    return `${event.proposalBooking?.proposal?.title || event.title} (${
      event.proposalBooking?.proposal?.proposalId || event.description
    }) - [${toTzLessDateTime(event.start)} - ${toTzLessDateTime(
      event.end
    )}] - ${event.status}`;
  };

  const eventItems = events.map((event) => ({
    id: `${event.id}_${event.bookingType}_${event.equipmentId}`,
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

  const onTimeChange = (
    newVisibleTimeStart: number,
    newVisibleTimeEnd: number
  ) => {
    const newStart = moment(newVisibleTimeStart);
    const newEnd = moment(newVisibleTimeEnd);

    // NOTE: Like this we prevent calling handleTimeChange on initial render because it's not needed to do one more re-render
    if (!isInitialized || !newStart.diff(visibleTimeStart, 'hours')) {
      setIsInitialized(true);

      return;
    }

    setVisibleTimeStart(newStart);
    setVisibleTimeEnd(newEnd);

    handleTimeChange(newStart, query, history);
  };

  return (
    <div data-cy="calendar-timeline-view" className={classes.root}>
      <Toolbar
        filter={filter}
        shouldIncludeCalendarNavigation
        multipleInstruments
      />
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
        {queryView === 'week' && (
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
                    {getLabelText(queryView, visibleTimeStart.toString())}
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
