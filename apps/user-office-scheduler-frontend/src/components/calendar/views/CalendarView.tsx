import makeStyles from '@mui/styles/makeStyles';
import moment from 'moment';
import React, { ComponentType, useContext, useEffect, useState } from 'react';
import {
  Calendar as BigCalendar,
  CalendarProps,
  momentLocalizer,
  SlotInfo,
  SlotPropGetter,
  stringOrDate,
  View,
  Views,
} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { useHistory } from 'react-router';

import { AppContext } from 'context/AppContext';
import {
  ProposalBookingStatusCore,
  ScheduledEventBookingType,
  ScheduledEventFilter,
} from 'generated/sdk';
import { useQuery } from 'hooks/common/useQuery';
import { TZ_LESS_DATE_TIME_FORMAT } from 'utils/date';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'styles/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import {
  CalendarScheduledEventWithUniqeId,
  isSchedulerViewPeriod,
  SchedulerViewPeriod,
} from '../CalendarViewContainer';
import Event, { eventPropGetter } from '../common/Event';
import Toolbar from '../common/Toolbar';

moment.locale('en-gb');
const localizer = momentLocalizer(moment);

function slotPropGetter(date: Date) {
  return {
    'data-cy': `event-slot-${date.toISOString()}`,
  };
}

function isOverlapping(
  { start, end }: { start: stringOrDate; end: stringOrDate },
  calendarEvents: CalendarScheduledEventWithUniqeId[]
): boolean {
  return calendarEvents.some((calendarEvent) => {
    if (
      (moment(calendarEvent.start).isSameOrAfter(moment(start)) &&
        moment(calendarEvent.end).isSameOrBefore(moment(end))) ||
      (moment(calendarEvent.start).isBefore(moment(end)) &&
        moment(calendarEvent.end).isAfter(moment(start)))
    ) {
      return true;
    }

    return false;
  });
}

const DragAndDropCalendar = withDragAndDrop(
  BigCalendar as ComponentType<
    CalendarProps<CalendarScheduledEventWithUniqeId, Record<string, unknown>>
  >
);

const useStyles = makeStyles(() => ({
  calendar: {
    // NOTE: This calculation in height is mainly because of toolbar height
    height: 'calc(100% - 70px) !important',
    '& .rbc-month-view': {
      overflowY: 'auto',
      '& .rbc-month-row': {
        overflow: 'unset',
      },
    },
  },
}));

type CalendarViewProps = {
  filter: ScheduledEventFilter;
  events: CalendarScheduledEventWithUniqeId[];
  onSelectEvent: (data: CalendarScheduledEventWithUniqeId) => void;
  onDropFromOutside: (data: {
    start: stringOrDate;
    end: stringOrDate;
  }) => Promise<void>;
  onEventResize: (data: {
    event: CalendarScheduledEventWithUniqeId;
    start: stringOrDate;
    end: stringOrDate;
    isAllDay: boolean;
  }) => Promise<void>;
  onSelectTimeSlot: (slotIfo: SlotInfo) => void;
};
const CalendarView: React.FC<CalendarViewProps> = ({
  filter,
  events,
  onSelectEvent,
  onDropFromOutside,
  onEventResize,
  onSelectTimeSlot,
}) => {
  const classes = useStyles();
  const query = useQuery();
  const history = useHistory();
  const { showAlert } = useContext(AppContext);

  const queryInstrument = query.get('instrument');
  const queryView = query.get('viewPeriod') as SchedulerViewPeriod;
  const queryStartsAt = query.get('startsAt');

  const [view, setView] = useState<SchedulerViewPeriod>(
    queryView || Views.WEEK
  );
  const [startsAt, setStartsAt] = useState(moment().startOf(view).toDate());

  useEffect(() => {
    if (queryStartsAt) {
      setStartsAt(moment(queryStartsAt).toDate());
    }
  }, [queryStartsAt]);

  const onNavigate = (newDate: Date, newView: View) => {
    if (isSchedulerViewPeriod(newView)) {
      const newStartDate = moment(newDate).startOf(newView);
      setView(newView);

      query.set('startsAt', newStartDate.format(TZ_LESS_DATE_TIME_FORMAT));
      history.push(`?${query}`);
    }
  };

  const onViewChange = (newView: View) => {
    if (isSchedulerViewPeriod(newView)) {
      query.set('viewPeriod', newView);
      query.set(
        'startsAt',
        moment(startsAt).startOf(newView).format(TZ_LESS_DATE_TIME_FORMAT)
      );
      history.push(`?${query}`);

      setView(newView);
    }
  };

  const onSelectSlot = (slotInfo: SlotInfo) => {
    if (isOverlapping({ start: slotInfo.start, end: slotInfo.end }, events)) {
      return;
    }

    if (!queryInstrument) {
      showAlert({ message: <>You have to select an instrument</> });

      return;
    }

    onSelectTimeSlot(slotInfo);
  };

  const onSelecting = (range: {
    start: stringOrDate;
    end: stringOrDate;
  }): boolean | undefined | null => {
    return !isOverlapping(range, events);
  };

  return (
    <>
      <Toolbar filter={filter} multipleInstruments />
      <DragAndDropCalendar
        popup
        selectable
        resizable
        className={classes.calendar}
        localizer={localizer}
        events={events}
        defaultView={view}
        views={{
          day: true,
          week: true,
          month: true,
        }}
        defaultDate={startsAt}
        step={60}
        date={startsAt}
        timeslots={1}
        onDropFromOutside={onDropFromOutside}
        resizableAccessor={(event) =>
          // NOTE: For now allow resize only on DRAFT state USER_OPERATIONS events because other type of events are not editable anyway.
          event.bookingType === ScheduledEventBookingType.USER_OPERATIONS &&
          event.status === ProposalBookingStatusCore.DRAFT
        }
        onEventResize={onEventResize}
        showMultiDayTimes={true}
        dayLayoutAlgorithm={'no-overlap'}
        eventPropGetter={eventPropGetter}
        slotPropGetter={slotPropGetter as SlotPropGetter}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        onSelecting={onSelecting}
        onNavigate={onNavigate}
        onView={onViewChange}
        components={{
          event: Event,
          week: {
            header: ({ date, localizer }) => (
              <>{localizer.format(date, 'dddd', '')}</>
            ),
          },
          month: {
            header: ({ date, localizer }) => (
              <>{localizer.format(date, 'dddd', '')}</>
            ),
          },
        }}
      />
    </>
  );
};

export default CalendarView;
