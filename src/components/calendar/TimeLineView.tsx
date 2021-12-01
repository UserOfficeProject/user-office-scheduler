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
import { toTzLessDateTime } from 'utils/date';

import {
  getInstrumentIdsFromQuery,
  SchedulerViewPeriod,
} from './CalendarViewContainer';
import { CalendarScheduledEvent, getBookingTypeStyle } from './Event';
import 'moment/locale/en-gb';
import Toolbar, { getLabelText } from './Toolbar';

type TimeLineViewProps = {
  events: CalendarScheduledEvent[];
  filter: ScheduledEventFilter;
  onSelectEvent: (selectedEvent: CalendarScheduledEvent) => void;
};

// NOTE: Debounce the function because there are too many calls on scroll so we want to avoid bombarding the backend with so many requests for new events
const handleTimeChange = debounce(
  (newStart: moment.Moment, query: URLSearchParams, history: H.History) => {
    query.set('startsAt', `${newStart}`);
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
  const startsAt = query.get('startsAt') || moment().startOf(queryView);
  const queryInstrument = query.get('instrument');

  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedInstruments, setSelectedInstruments] = useState<
    PartialInstrument[]
  >([]);

  const defaultVisibleTimeStart = moment(startsAt);
  const defaultVisibleTimeEnd = moment(startsAt).add(1, queryView);

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

  const getEventTitle = (event: CalendarScheduledEvent) => {
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

  const onTimeChange = (newVisibleTimeStart: number) => {
    const newStart = moment(newVisibleTimeStart);

    if (!isInitialized) {
      setIsInitialized(true);

      return;
    }

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
        visibleTimeStart={defaultVisibleTimeStart.valueOf()}
        visibleTimeEnd={defaultVisibleTimeEnd.valueOf()}
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
                    {getLabelText(
                      queryView,
                      defaultVisibleTimeStart.toString()
                    )}
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
