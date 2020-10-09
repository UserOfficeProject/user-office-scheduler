import { Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import generateScheduledEventFilter from 'filters/scheduledEvent/scheduledEventsFilter';
import moment from 'moment';
import 'moment/locale/en-gb';
import React, { useState, useMemo, useContext, useEffect } from 'react';
import {
  Calendar as BigCalendar,
  momentLocalizer,
  View,
} from 'react-big-calendar';

import Loader from 'components/common/Loader';
import ScheduledEventDialog, {
  SlotInfo,
} from 'components/scheduledEvent/ScheduledEventDialog';
import { BookingTypesMap } from 'components/scheduledEvent/ScheduledEventForm';
import { AppContext } from 'context/AppContext';
import { ScheduledEvent } from 'generated/sdk';
import { useQuery } from 'hooks/common/useQuery';
import useScheduledEvents from 'hooks/scheduledEvent/useScheduledEvents';
import { ContentContainer, StyledPaper } from 'styles/StyledComponents';
import { parseTzLessDateTime } from 'utils/date';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'styles/react-big-calendar.css';

import CalendarTodoBox from './CalendarTodoBox';
import Event, { CalendarScheduledEvent, eventPropGetter } from './Event';
import Toolbar from './Toolbar';

moment.locale('en-gb');

const localizer = momentLocalizer(moment);

const CALENDAR_DEFAULT_VIEW = 'week';

const useStyles = makeStyles(() => ({
  fullHeight: {
    height: '100%',
  },
  relative: {
    position: 'relative',
  },
  eventDescription: {
    marginTop: 5,
  },
}));

function transformEvent(
  scheduledEvents: Pick<
    ScheduledEvent,
    'id' | 'bookingType' | 'startsAt' | 'endsAt' | 'description'
  >[]
): CalendarScheduledEvent[] {
  return scheduledEvents.map(scheduledEvent => ({
    id: scheduledEvent.id,
    start: parseTzLessDateTime(scheduledEvent.startsAt).toDate(),
    end: parseTzLessDateTime(scheduledEvent.endsAt).toDate(),
    title: BookingTypesMap[scheduledEvent.bookingType],
    bookingType: scheduledEvent.bookingType,
    description: scheduledEvent.description,
  }));
}

function isOverlapping(
  { start, end }: { start: Date | string; end: Date | string },
  calendarEvents: CalendarScheduledEvent[]
): boolean {
  return calendarEvents.some(calendarEvent => {
    if (
      (calendarEvent.start >= start && calendarEvent.end <= end) ||
      //
      (calendarEvent.start < end && calendarEvent.end > start)
    ) {
      return true;
    }

    return false;
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function slotPropGetter(date: Date): any {
  return {
    'data-cy': `event-slot-${date.toISOString()}`,
  };
}

export default function Calendar() {
  const classes = useStyles();

  const query = useQuery();
  const queryInstrument = query.get('instrument');

  const { showAlert } = useContext(AppContext);
  const [selectedEvent, setSelectedEvent] = useState<
    | Pick<
        ScheduledEvent,
        'id' | 'bookingType' | 'startsAt' | 'endsAt' | 'description'
      >
    | SlotInfo
    | null
  >(null);
  const [startsAt, setStartAt] = useState(
    moment()
      .startOf(CALENDAR_DEFAULT_VIEW)
      .toDate()
  );
  const [view, setView] = useState<View>(CALENDAR_DEFAULT_VIEW);
  const [filter, setFilter] = useState(
    generateScheduledEventFilter(queryInstrument, startsAt, view)
  );

  const { loading, scheduledEvents, refresh } = useScheduledEvents(filter);

  useEffect(() => {
    setFilter(generateScheduledEventFilter(queryInstrument, startsAt, view));
  }, [queryInstrument, startsAt, view]);

  const events = useMemo(() => transformEvent(scheduledEvents), [
    scheduledEvents,
  ]);

  const onNavigate = (newDate: Date, newView: View) => {
    setStartAt(newDate);
    setView(newView);
  };

  const onViewChange = (newView: View) => {
    setView(newView);
  };

  const onSelectSlot = (slotInfo: SlotInfo) => {
    if (isOverlapping({ start: slotInfo.start, end: slotInfo.end }, events)) {
      return;
    }

    if (!queryInstrument) {
      showAlert({ message: <>You have to select an instrument</> });

      return;
    }

    setSelectedEvent(slotInfo);
  };

  const onSelecting = (range: { start: Date | string; end: Date | string }) => {
    return !isOverlapping(range, events);
  };

  const closeDialog = (shouldRefresh?: boolean) => {
    setSelectedEvent(null);

    if (shouldRefresh) {
      refresh();
    }
  };

  const onSelectEvent = ({ id }: CalendarScheduledEvent) => {
    const scheduledEvent = scheduledEvents.find(se => se.id === id);

    if (scheduledEvent) {
      setSelectedEvent(scheduledEvent);
    }
  };

  const handleNewSimpleEvent = () => {
    const start = moment()
      .startOf('hour')
      .toDate();

    const end = moment()
      .startOf('hour')
      .add(1, 'hour')
      .toDate();

    setSelectedEvent({
      action: 'click',
      start,
      end,
      slots: [start, end],
    });
  };

  // 100% height needed for month view
  // also the other components make whole page scrollable without it
  return (
    <ContentContainer maxWidth={false} className={classes.fullHeight}>
      <Grid container className={classes.fullHeight}>
        <Grid item xs={12} className={classes.fullHeight}>
          <StyledPaper
            margin={[0, 1]}
            className={clsx(classes.fullHeight, classes.relative)}
          >
            {queryInstrument && (
              <ScheduledEventDialog
                selectedEvent={selectedEvent}
                selectedInstrumentId={queryInstrument}
                isDialogOpen={selectedEvent !== null}
                closeDialog={closeDialog}
              />
            )}
            <Grid container className={classes.fullHeight}>
              <Grid item xs className={classes.fullHeight}>
                <BigCalendar
                  selectable
                  // TODO: needs some position fixing
                  // popup
                  localizer={localizer}
                  events={events}
                  defaultView={CALENDAR_DEFAULT_VIEW}
                  views={['month', 'week']}
                  defaultDate={startsAt}
                  step={60}
                  timeslots={1}
                  showMultiDayTimes={true}
                  dayLayoutAlgorithm={'no-overlap'}
                  eventPropGetter={eventPropGetter}
                  slotPropGetter={slotPropGetter}
                  onSelectEvent={onSelectEvent}
                  onSelectSlot={onSelectSlot}
                  onSelecting={onSelecting}
                  onNavigate={onNavigate}
                  onView={onViewChange}
                  components={{
                    toolbar: Toolbar,
                    event: Event,
                  }}
                />
              </Grid>
              <Grid item xs={2} className={classes.fullHeight}>
                <CalendarTodoBox
                  refreshCalendar={refresh}
                  onNewSimpleEvent={handleNewSimpleEvent}
                />
              </Grid>
            </Grid>
            {loading && <Loader />}
          </StyledPaper>
        </Grid>
      </Grid>
    </ContentContainer>
  );
}
