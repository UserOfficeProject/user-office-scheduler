import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
import {
  IconButton,
  Collapse,
  Grid,
  makeStyles,
  useTheme,
  Tooltip,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import CloseIcon from '@material-ui/icons/Close';
import generateScheduledEventFilter from 'filters/scheduledEvent/scheduledEventsFilter';
import moment from 'moment';
import 'moment/locale/en-gb';
import { useSnackbar } from 'notistack';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { stringOrDate, View, Views } from 'react-big-calendar';
import { useHistory } from 'react-router';

import Loader from 'components/common/Loader';
import EquipmentBookingDialog from 'components/equipment/EquipmentBookingDialog';
import ProposalBookingDialog from 'components/proposalBooking/ProposalBookingDialog';
import ScheduledEventDialog, {
  SlotInfo,
} from 'components/scheduledEvent/ScheduledEventDialog';
import {
  BookingTypesMap,
  ScheduledEventStatusMap,
} from 'components/scheduledEvent/ScheduledEventForm';
import { InstrumentAndEquipmentContextProvider } from 'context/InstrumentAndEquipmentContext';
import {
  ScheduledEvent,
  ScheduledEventBookingType,
  GetScheduledEventsQuery,
  ProposalBooking,
} from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import { useQuery } from 'hooks/common/useQuery';
import useInstrumentProposalBookings from 'hooks/proposalBooking/useInstrumentProposalBookings';
import useEquipmentScheduledEvents from 'hooks/scheduledEvent/useEquipmentScheduledEvents';
import useScheduledEvents from 'hooks/scheduledEvent/useScheduledEvents';
import { ContentContainer, StyledPaper } from 'styles/StyledComponents';
import {
  parseTzLessDateTime,
  toTzLessDateTime,
  TZ_LESS_DATE_TIME_FORMAT,
} from 'utils/date';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import 'styles/react-big-calendar.css';

import CalendarTodoBox from './CalendarTodoBox';
import CalendarView from './CalendarView';
import { CalendarScheduledEvent } from './Event';
import TableView from './TableView';
import TimeLineView from './TimeLineView';

export enum SchedulerViews {
  CALENDAR = 'Calendar',
  TABLE = 'Table',
  TIMELINE = 'Timeline',
}

const schedulerViewPeriods = [Views.DAY, Views.WEEK, Views.MONTH];
export type SchedulerViewPeriod = typeof schedulerViewPeriods[number];
export const isSchedulerViewPeriod = (
  arg: View
): arg is SchedulerViewPeriod => {
  return schedulerViewPeriods.some((element) => element === arg);
};

// NOTE: It is better practice to convert some values here for table rendering instead of using render function which adds additional complexity for sorting and stuff like that.
const transformEvent = (
  scheduledEvents: GetScheduledEventsQuery['scheduledEvents']
): CalendarScheduledEvent[] =>
  scheduledEvents.map((scheduledEvent) => ({
    id: scheduledEvent.id,
    start: parseTzLessDateTime(scheduledEvent.startsAt).toDate(),
    startTableRenderValue: toTzLessDateTime(scheduledEvent.startsAt),
    end: parseTzLessDateTime(scheduledEvent.endsAt).toDate(),
    endTableRenderValue: toTzLessDateTime(scheduledEvent.endsAt),
    title: BookingTypesMap[scheduledEvent.bookingType],
    bookingType: scheduledEvent.bookingType,
    bookingTypeTableRenderValue: BookingTypesMap[scheduledEvent.bookingType],
    equipmentId: scheduledEvent.equipmentId,
    description: scheduledEvent.description,
    proposalBooking: scheduledEvent.proposalBooking,
    instrument: scheduledEvent.instrument,
    scheduledBy: scheduledEvent.scheduledBy,
    status: scheduledEvent.status,
    statusTableRenderValue: ScheduledEventStatusMap[scheduledEvent.status],
  }));

const useStyles = makeStyles((theme) => ({
  fullHeight: {
    height: '100%',
    position: 'relative',
  },
  collapsibleGrid: {
    overflow: 'hidden',
  },
  collapsibleGridMobile: {
    position: 'absolute',
    top: -16,
    right: -16,
    // NOTE: This calculation in height is mainly because of the different container paddings on different screen sizes
    height: `calc(100% + 32px) !important`,
    width: '200px',
    background: 'white',
    overflow: 'auto',
    boxShadow: theme.shadows[1],
    transition: theme.transitions.create('all', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    zIndex: 1000,
  },
  collapsibleGridNoWidth: {
    width: '0',
  },
  collapsibleGridTablet: {
    top: -24,
    right: -24,
    height: `calc(100% + 48px) !important`,
  },
  eventToolbarCloseButton: {
    position: 'absolute',
    right: -24,
    top: -24,
    background: theme.palette.grey[200],
    borderRadius: 0,
  },
  eventToolbarCloseButtonMobile: {
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  eventToolbarOpenButton: {
    position: 'absolute',
    right: -24,
    top: -24,
    background: theme.palette.grey[200],
    borderRadius: 0,
    zIndex: 1000,
  },
  eventToolbarOpenButtonMobile: {
    position: 'absolute',
    right: -16,
    top: -16,
    background: theme.palette.grey[200],
    borderRadius: 0,
    zIndex: 1000,
  },
  schedulerViewSelect: {
    paddingLeft: theme.spacing(2),
  },
  schedulerViewSelectMobile: {
    padding: theme.spacing(2),
  },
}));

export const getInstrumentIdsFromQuery = (queryInstrument: string | null) => {
  const queryInstrumentArray = queryInstrument?.split(',');
  const queryInstrumentIds = queryInstrumentArray?.map((item) =>
    parseInt(item)
  );

  return queryInstrumentIds || [];
};

export const getEquipmentIdsFromQuery = (queryEquipment: string | null) => {
  const queryEquipmentArray = queryEquipment?.split(',');
  const queryEquipmentIds = queryEquipmentArray?.map((item) => parseInt(item));

  return queryEquipmentIds || [];
};

export default function CalendarViewContainer() {
  const isTabletOrMobile = useMediaQuery('(max-width: 1224px)');
  const isTabletOrLarger = useMediaQuery('(min-width: 648px)');
  const [showTodoBox, setShowTodoBox] = useState<boolean>(false);
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const query = useQuery();
  const { enqueueSnackbar } = useSnackbar();
  const api = useDataApi();

  const queryInstrument = query.get('instrument');
  const queryEquipment = query.get('equipment');
  const querySchedulerView = query.get('schedulerView');
  const queryView = query.get('viewPeriod') as SchedulerViewPeriod;
  const queryStartsAt = query.get('startsAt');

  const [schedulerActiveView, setSchedulerActiveView] = useState(
    (querySchedulerView as SchedulerViews) || SchedulerViews.CALENDAR
  );
  const [selectedEvent, setSelectedEvent] = useState<
    | Pick<
        ScheduledEvent,
        'id' | 'bookingType' | 'startsAt' | 'endsAt' | 'description'
      >
    | SlotInfo
    | null
  >(null);
  const [draggingEventDetails, setDraggingEventDetails] = useState<{
    proposalBookingId: number;
    instrumentId: number;
  } | null>(null);
  const [isAddingNewTimeSlot, setIsAddingNewTimeSlot] = useState(false);
  const [view, setView] = useState<SchedulerViewPeriod>(
    queryView || Views.WEEK
  );
  const [startsAt, setStartsAt] = useState(moment().startOf(view).toDate());
  const [filter, setFilter] = useState(
    generateScheduledEventFilter(
      getInstrumentIdsFromQuery(queryInstrument),
      startsAt,
      view
    )
  );
  const [selectedProposalBooking, setSelectedProposalBooking] = useState<{
    proposalBookingId: number | null;
    scheduledEventId: number | null;
  }>({ proposalBookingId: null, scheduledEventId: null });
  const [selectedEquipmentBooking, setSelectedEquipmentBooking] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (queryStartsAt) {
      setStartsAt(moment(queryStartsAt).toDate());
    }
  }, [queryStartsAt]);

  useEffect(() => {
    if (isTabletOrMobile) {
      setShowTodoBox(false);
    } else {
      setShowTodoBox(true);
    }
  }, [isTabletOrMobile]);

  useEffect(() => {
    if (!querySchedulerView) {
      setSchedulerActiveView(SchedulerViews.CALENDAR);
    }
  }, [querySchedulerView]);

  useEffect(() => {
    let calendarParsedState = {
      instrumentIds: null,
      equipmentIds: null,
      schedulerView: null,
      activeView: null,
      startsAt: null,
    };

    const localStorageCalendarState = localStorage.getItem('calendarState');

    if (localStorageCalendarState) {
      calendarParsedState = JSON.parse(localStorageCalendarState);
    }
    const calendarState = {
      instrumentIds: getInstrumentIdsFromQuery(queryInstrument),
      equipmentIds: getEquipmentIdsFromQuery(queryEquipment),
      schedulerView: querySchedulerView,
      activeView: queryView || calendarParsedState.activeView,
      startsAt: queryStartsAt || calendarParsedState.startsAt,
    };

    localStorage.setItem('calendarState', JSON.stringify(calendarState));
  }, [
    querySchedulerView,
    queryView,
    queryStartsAt,
    queryInstrument,
    queryEquipment,
  ]);

  useEffect(() => {
    if (
      schedulerActiveView === SchedulerViews.CALENDAR ||
      schedulerActiveView === SchedulerViews.TABLE
    ) {
      const queryInstrumentIds = getInstrumentIdsFromQuery(queryInstrument);
      // NOTE: If table or calendar view set the selected instrument to first one if multiple are selected in timeline view.
      if (queryInstrumentIds && queryInstrumentIds.length > 1) {
        query.set('instrument', `${queryInstrumentIds[0]}`);
        history.push(`?${query}`);
      }
    }
  }, [schedulerActiveView, history, query, queryInstrument]);

  const {
    proposalBookings,
    loading: loadingBookings,
    refresh: refreshBookings,
  } = useInstrumentProposalBookings(getInstrumentIdsFromQuery(queryInstrument));

  const {
    scheduledEvents,
    loading: loadingEvents,
    setScheduledEvents,
    refresh: refreshEvents,
  } = useScheduledEvents(filter);

  const { scheduledEvents: eqEvents, refresh: refreshEquipments } =
    useEquipmentScheduledEvents({
      equipmentIds: getEquipmentIdsFromQuery(queryEquipment),
      startsAt: filter.startsAt,
      endsAt: filter.endsAt,
    });

  const equipmentEventsOnly = eqEvents.map((eqEvent) => eqEvent.events).flat(1);

  const refresh = () => {
    refreshEvents();
    refreshBookings();
    refreshEquipments();
  };

  const getStartDate = useCallback(
    (schedulerNewView = schedulerActiveView) => {
      if (
        schedulerNewView === SchedulerViews.CALENDAR &&
        !moment(startsAt).isSame(moment(startsAt).startOf(view))
      ) {
        const newStartDate = moment(startsAt).startOf(view);

        return newStartDate.toDate();
      }
      const newDate = moment(queryStartsAt || startsAt).toDate();

      return newDate;
    },
    [schedulerActiveView, startsAt, view, queryStartsAt]
  );

  useEffect(() => {
    const newStartDate = getStartDate();
    setFilter(
      generateScheduledEventFilter(
        getInstrumentIdsFromQuery(queryInstrument),
        newStartDate,
        queryView || view
      )
    );
    setView(queryView || view);
  }, [queryInstrument, view, getStartDate, queryView]);

  const equipmentEventsTransformed: GetScheduledEventsQuery['scheduledEvents'] =
    eqEvents
      .map((eq) =>
        eq.events.map((event) => ({
          ...event,
          bookingType: ScheduledEventBookingType.EQUIPMENT,
          description: eq.name,
          proposalBooking: event.proposalBooking as ProposalBooking,
          instrument: event.instrument,
          scheduledBy: event.scheduledBy,
          equipmentId: event.equipmentId,
        }))
      )
      .flat(1);

  const events = useMemo(
    () => transformEvent([...scheduledEvents, ...equipmentEventsTransformed]),
    [scheduledEvents, equipmentEventsTransformed]
  );

  const closeDialog = (shouldRefresh?: boolean) => {
    setSelectedEvent(null);

    if (shouldRefresh) {
      refresh();
    }
  };

  const onSelectEvent = (selectedScheduledEvent: CalendarScheduledEvent) => {
    switch (selectedScheduledEvent.bookingType) {
      case ScheduledEventBookingType.USER_OPERATIONS: {
        const scheduledEvent = scheduledEvents.find(
          (se) => se.id === selectedScheduledEvent.id
        );

        if (scheduledEvent?.proposalBooking) {
          setSelectedProposalBooking({
            proposalBookingId: scheduledEvent.proposalBooking.id,
            scheduledEventId: scheduledEvent.id,
          });
        }
        break;
      }

      case ScheduledEventBookingType.EQUIPMENT: {
        const equipmentScheduledEvent = equipmentEventsOnly.find(
          (se) =>
            se.id === selectedScheduledEvent.id &&
            se.equipmentId === selectedScheduledEvent.equipmentId
        );

        if (equipmentScheduledEvent && equipmentScheduledEvent.equipmentId) {
          setSelectedEquipmentBooking(equipmentScheduledEvent.equipmentId);
        }
        break;
      }

      default: {
        const scheduledEvent = scheduledEvents.find(
          (se) => se.id === selectedScheduledEvent.id
        );

        if (scheduledEvent) {
          setSelectedEvent(scheduledEvent);
        }
        break;
      }
    }
  };

  const handleNewSimpleEvent = () => {
    const start = moment().startOf('hour').toDate();
    const end = moment().startOf('hour').add(1, 'hour').toDate();

    setSelectedEvent({
      action: 'click',
      start,
      end,
      slots: [start, end],
    });
  };

  const handleCloseDialog = () => {
    setSelectedProposalBooking({
      scheduledEventId: null,
      proposalBookingId: null,
    });
    setSelectedEquipmentBooking(null);

    refresh();
  };

  const addAndOpenNewTimeSlot = async ({
    start,
    end,
  }: {
    start: stringOrDate;
    end: stringOrDate;
  }) => {
    if (
      !draggingEventDetails?.proposalBookingId ||
      !draggingEventDetails.instrumentId
    ) {
      return;
    }

    setIsAddingNewTimeSlot(true);
    const {
      createScheduledEvent: { error, scheduledEvent: createdScheduledEvent },
    } = await api().createScheduledEvent({
      input: {
        proposalBookingId: draggingEventDetails.proposalBookingId,
        bookingType: ScheduledEventBookingType.USER_OPERATIONS,
        instrumentId: draggingEventDetails.instrumentId,
        startsAt: moment(start).format(TZ_LESS_DATE_TIME_FORMAT),
        endsAt: moment(end).format(TZ_LESS_DATE_TIME_FORMAT),
      },
    });
    if (error) {
      enqueueSnackbar(getTranslation(error as ResourceId), {
        variant: 'error',
      });
    } else {
      enqueueSnackbar('Time slot added successfully', {
        variant: 'success',
      });
      if (createdScheduledEvent) {
        setScheduledEvents([
          ...scheduledEvents,
          createdScheduledEvent as ScheduledEvent,
        ]);
        // NOTE: Open the event right after creation
        setSelectedProposalBooking({
          proposalBookingId: draggingEventDetails.proposalBookingId,
          scheduledEventId: createdScheduledEvent.id,
        });
      }
    }
    setIsAddingNewTimeSlot(false);
    setDraggingEventDetails(null);
  };

  const onDropFromOutside = async ({
    start,
    end,
  }: {
    start: stringOrDate;
    end: stringOrDate;
  }) => {
    await addAndOpenNewTimeSlot({ start, end });
  };

  const onSchedulerActiveViewChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const schedulerNewView = event.target.value as SchedulerViews;
    setSchedulerActiveView(schedulerNewView);

    if (event.target.value !== SchedulerViews.CALENDAR) {
      query.set('schedulerView', schedulerNewView);
    } else {
      query.delete('schedulerView');
    }

    history.push(`?${query}`);
  };

  const getSchedulerActiveView = () => {
    switch (schedulerActiveView) {
      case SchedulerViews.TABLE:
        return (
          <TableView
            filter={filter}
            events={events}
            onSelectEvent={onSelectEvent}
          />
        );

      case SchedulerViews.TIMELINE:
        return (
          <TimeLineView
            filter={filter}
            events={events}
            onSelectEvent={onSelectEvent}
          />
        );

      default:
        return (
          <CalendarView
            filter={filter}
            events={events}
            onSelectEvent={onSelectEvent}
            onDropFromOutside={onDropFromOutside}
            onSelectTimeSlot={setSelectedEvent}
          />
        );
    }
  };

  // 100% height needed for month view
  // also the other components make whole page scrollable without it
  return (
    <ContentContainer
      maxWidth={false}
      className={
        schedulerActiveView !== SchedulerViews.TABLE && isTabletOrLarger
          ? classes.fullHeight
          : ''
      }
    >
      <Grid container className={classes.fullHeight}>
        <Grid item xs={12} className={classes.fullHeight}>
          <StyledPaper margin={[0, 1]} className={classes.fullHeight}>
            {queryInstrument && (
              <ScheduledEventDialog
                selectedEvent={selectedEvent}
                selectedInstrumentId={
                  getInstrumentIdsFromQuery(queryInstrument)[0] || 0
                }
                isDialogOpen={selectedEvent !== null}
                closeDialog={closeDialog}
              />
            )}
            {selectedProposalBooking.proposalBookingId !== null &&
              selectedProposalBooking.scheduledEventId !== null && (
                <ProposalBookingDialog
                  activeProposalBookingId={
                    selectedProposalBooking.proposalBookingId
                  }
                  scheduledEventId={selectedProposalBooking.scheduledEventId}
                  isDialogOpen={true}
                  closeDialog={handleCloseDialog}
                />
              )}
            {selectedEquipmentBooking !== null && (
              <EquipmentBookingDialog
                activeEquipmentBookingId={selectedEquipmentBooking}
                isDialogOpen={true}
                closeDialog={handleCloseDialog}
              />
            )}
            <Grid container className={classes.fullHeight}>
              {!showTodoBox && (
                <Tooltip title="Open event toolbar">
                  <IconButton
                    onClick={() => setShowTodoBox(true)}
                    aria-label="Open event toolbar"
                    className={
                      isTabletOrLarger
                        ? classes.eventToolbarOpenButton
                        : classes.eventToolbarOpenButtonMobile
                    }
                    size="small"
                    data-cy="open-event-toolbar"
                  >
                    <ChevronLeft />
                  </IconButton>
                </Tooltip>
              )}
              <Grid
                item
                xs={isTabletOrMobile ? 12 : showTodoBox ? 10 : 12}
                className={`${classes.fullHeight}`}
                style={{
                  transition: theme.transitions.create('all', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                  }),
                }}
              >
                <InstrumentAndEquipmentContextProvider>
                  {getSchedulerActiveView()}
                </InstrumentAndEquipmentContextProvider>
              </Grid>
              <Grid
                item
                xs
                className={`${classes.collapsibleGrid} ${
                  isTabletOrMobile && classes.collapsibleGridMobile
                } ${isTabletOrLarger && classes.collapsibleGridTablet}
                ${!showTodoBox && classes.collapsibleGridNoWidth}`}
              >
                <Collapse in={showTodoBox} data-cy="collapsible-event-toolbar">
                  {showTodoBox && (
                    <Tooltip title="Close event toolbar">
                      <IconButton
                        onClick={() => setShowTodoBox(false)}
                        aria-label="Close event toolbar"
                        className={`
                          ${classes.eventToolbarCloseButton}
                          ${
                            isTabletOrMobile &&
                            classes.eventToolbarCloseButtonMobile
                          }
                        `}
                        size="small"
                        data-cy="close-event-toolbar"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <FormControl
                    fullWidth
                    margin="dense"
                    className={`${classes.schedulerViewSelect} ${
                      isTabletOrMobile && classes.schedulerViewSelectMobile
                    }`}
                  >
                    <InputLabel
                      id="scheduler-view-label"
                      className={`${classes.schedulerViewSelect} ${
                        isTabletOrMobile && classes.schedulerViewSelectMobile
                      }`}
                    >
                      Scheduler view
                    </InputLabel>
                    <Select
                      value={schedulerActiveView}
                      label="Scheduler view"
                      labelId="scheduler-view-label"
                      margin="dense"
                      onChange={onSchedulerActiveViewChange}
                      data-cy="scheduler-active-view"
                    >
                      <MenuItem value={SchedulerViews.CALENDAR}>
                        Calendar
                      </MenuItem>
                      <MenuItem value={SchedulerViews.TABLE}>Table</MenuItem>
                      <MenuItem value={SchedulerViews.TIMELINE}>
                        Timeline
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <CalendarTodoBox
                    refreshCalendar={refresh}
                    setDraggedEvent={setDraggingEventDetails}
                    onNewSimpleEvent={handleNewSimpleEvent}
                    proposalBookings={proposalBookings}
                  />
                </Collapse>
              </Grid>
            </Grid>
            {(loadingEvents || loadingBookings || isAddingNewTimeSlot) && (
              <Loader />
            )}
          </StyledPaper>
        </Grid>
      </Grid>
    </ContentContainer>
  );
}
