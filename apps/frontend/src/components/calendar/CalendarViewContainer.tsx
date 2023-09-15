import { ChevronLeft, Close as CloseIcon } from '@mui/icons-material';
import {
  IconButton,
  Collapse,
  Grid,
  useTheme,
  Tooltip,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {
  getTranslation,
  ResourceId,
} from '@user-office-software/duo-localisation';
import generateScheduledEventFilter from 'filters/scheduledEvent/scheduledEventsFilter';
import moment from 'moment';
import 'moment/locale/en-gb';
import { useSnackbar } from 'notistack';
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useContext,
} from 'react';
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
import { getProposalBookingEventsForOverlapCheck } from 'components/timeSlotBooking/TimeSlotBooking';
import { AppContext } from 'context/AppContext';
import { InstrumentAndEquipmentContextProvider } from 'context/InstrumentAndEquipmentContext';
import {
  ScheduledEvent,
  ScheduledEventBookingType,
  GetScheduledEventsQuery,
  ProposalBooking,
  Maybe,
} from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import { useQuery } from 'hooks/common/useQuery';
import { PartialInstrument } from 'hooks/instrument/useUserInstruments';
import useInstrumentProposalBookings from 'hooks/proposalBooking/useInstrumentProposalBookings';
import useEquipmentScheduledEvents from 'hooks/scheduledEvent/useEquipmentScheduledEvents';
import useScheduledEvents from 'hooks/scheduledEvent/useScheduledEvents';
import { StyledContainer, StyledPaper } from 'styles/StyledComponents';
import { getArrayOfIdsFromQuery } from 'utils/common';
import {
  parseTzLessDateTime,
  toTzLessDateTime,
  TZ_LESS_DATE_TIME_FORMAT,
} from 'utils/date';
import { hasOverlappingEvents } from 'utils/scheduledEvent';

import CalendarTodoBox, { DraggingEventType } from './common/CalendarTodoBox';
import { CalendarScheduledEvent } from './common/Event';
import CalendarView from './views/CalendarView';
import TableView from './views/TableView';
import TimeLineView from './views/TimeLineView';

export enum SchedulerViews {
  CALENDAR = 'Calendar',
  TABLE = 'Table',
  TIMELINE = 'Timeline',
}

const schedulerViewPeriods = [Views.DAY, Views.WEEK, Views.MONTH];
export type SchedulerViewPeriod = (typeof schedulerViewPeriods)[number];
export const isSchedulerViewPeriod = (
  arg: View
): arg is SchedulerViewPeriod => {
  return schedulerViewPeriods.some((element) => element === arg);
};

export type CalendarScheduledEventWithUniqueId = CalendarScheduledEvent & {
  eventId: number;
};

// NOTE: It is better practice to convert some values here for table rendering instead of using render function which adds additional complexity for sorting and stuff like that.
const transformEvent = (
  scheduledEvents: GetScheduledEventsQuery['scheduledEvents']
): CalendarScheduledEventWithUniqueId[] =>
  scheduledEvents.map((scheduledEvent, index) => ({
    /**
     * NOTE: This id should be unique and we can't just use scheduledEvent.id because we are mixing scheduled events and their equipment together.
     * They can have duplicates in the ids (equipment.id is the id of the scheduled event where that equipment is booked)
     * This makes some problems on the material-table because it expects ids to be unique and that's why we use index as unique id.
     */
    id: index,
    eventId: scheduledEvent.id,
    start: parseTzLessDateTime(scheduledEvent.startsAt).toDate(),
    startTableRenderValue: toTzLessDateTime(scheduledEvent.startsAt),
    end: parseTzLessDateTime(scheduledEvent.endsAt).toDate(),
    endTableRenderValue: toTzLessDateTime(scheduledEvent.endsAt),
    title: BookingTypesMap[scheduledEvent.bookingType],
    bookingType: scheduledEvent.bookingType,
    bookingTypeTableRenderValue: BookingTypesMap[scheduledEvent.bookingType],
    equipmentId: scheduledEvent.equipmentId,
    description: scheduledEvent.description,
    color: scheduledEvent.color,
    proposalBooking: scheduledEvent.proposalBooking,
    instrument: scheduledEvent.instrument,
    scheduledBy: scheduledEvent.scheduledBy,
    status: scheduledEvent.status,
    statusTableRenderValue: ScheduledEventStatusMap[scheduledEvent.status],
    localContact: scheduledEvent.localContact,
  }));

const useStyles = makeStyles((theme) => ({
  fullHeight: {
    height: '100%',
    position: 'relative',
  },
  collapsibleGrid: {
    overflow: 'auto',
    maxHeight: '100%',
  },
  collapsibleGridMobile: {
    position: 'absolute',
    top: -16,
    right: -16,
    // NOTE: This calculation in height is mainly because of the different container paddings on different screen sizes
    height: `calc(100% + 32px) !important`,
    maxHeight: 'none',
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
    maxHeight: 'none',
  },
  eventToolbarCloseButton: {
    position: 'absolute',
    right: -24,
    top: -24,
    width: '20px',
    height: '20px',
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
    width: '20px',
    height: '20px',
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

export default function CalendarViewContainer() {
  const isTabletOrMobile = useMediaQuery('(max-width: 1224px)');
  const isTabletOrLarger = useMediaQuery('(min-width: 648px)');
  const isTablet = useMediaQuery('(min-width: 648px) and (max-width: 1224px)');
  const [showTodoBox, setShowTodoBox] = useState<boolean>(false);
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const query = useQuery();
  const { enqueueSnackbar } = useSnackbar();
  const api = useDataApi();
  const { showConfirmation } = useContext(AppContext);

  const queryInstrument = query.get('instrument');
  const queryEquipment = query.get('equipment');
  const querySchedulerView = query.get('schedulerView');
  const queryView = query.get('viewPeriod') as SchedulerViewPeriod;
  const queryStartsAt = query.get('startsAt');
  const queryLocalContact = query.get('localContact');

  const [schedulerActiveView, setSchedulerActiveView] = useState(
    (querySchedulerView as SchedulerViews) || SchedulerViews.CALENDAR
  );
  const [selectedEvent, setSelectedEvent] = useState<
    | (Pick<
        ScheduledEvent,
        'id' | 'bookingType' | 'startsAt' | 'endsAt' | 'description'
      > & { instrument: Maybe<PartialInstrument> })
    | SlotInfo
    | null
  >(null);
  const [draggingEventDetails, setDraggingEventDetails] =
    useState<DraggingEventType | null>(null);
  const [isAddingOrResizingTimeSlot, setIsAddingOrResizingTimeSlot] =
    useState(false);
  const [view, setView] = useState<SchedulerViewPeriod>(
    queryView || Views.WEEK
  );
  const [startsAt, setStartsAt] = useState(moment().startOf(view).toDate());
  const [filter, setFilter] = useState(
    generateScheduledEventFilter(
      getArrayOfIdsFromQuery(queryInstrument),
      getArrayOfIdsFromQuery(queryLocalContact),
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

  const {
    proposalBookings,
    loading: loadingBookings,
    refresh: refreshBookings,
    setProposalBookings,
  } = useInstrumentProposalBookings(getArrayOfIdsFromQuery(queryInstrument));

  const {
    scheduledEvents,
    loading: loadingEvents,
    setScheduledEvents,
    refresh: refreshEvents,
  } = useScheduledEvents(filter);

  const { scheduledEvents: eqEvents, refresh: refreshEquipments } =
    useEquipmentScheduledEvents({
      equipmentIds: getArrayOfIdsFromQuery(queryEquipment),
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
        getArrayOfIdsFromQuery(queryInstrument),
        getArrayOfIdsFromQuery(queryLocalContact),
        newStartDate,
        queryView || view
      )
    );
    setView(queryView || view);
  }, [queryInstrument, queryLocalContact, view, getStartDate, queryView]);

  const equipmentEventsTransformed: GetScheduledEventsQuery['scheduledEvents'] =
    eqEvents
      .map(
        (eq) =>
          eq.events?.map((event) => ({
            ...event,
            bookingType: ScheduledEventBookingType.EQUIPMENT,
            description: eq.name,
            color: eq.color,
            proposalBooking: event.proposalBooking as ProposalBooking,
            instrument: event.instrument,
            scheduledBy: event.scheduledBy,
            equipmentId: event.equipmentId,
          })) || []
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

  const onSelectEvent = (
    selectedScheduledEvent: CalendarScheduledEventWithUniqueId
  ) => {
    switch (selectedScheduledEvent.bookingType) {
      case ScheduledEventBookingType.USER_OPERATIONS: {
        const scheduledEvent = scheduledEvents.find(
          (se) => se.id === selectedScheduledEvent.eventId
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
            se?.id === selectedScheduledEvent.eventId &&
            se.equipmentId === selectedScheduledEvent.equipmentId
        );

        if (equipmentScheduledEvent && equipmentScheduledEvent.equipmentId) {
          setSelectedEquipmentBooking(equipmentScheduledEvent.equipmentId);
        }
        break;
      }

      default: {
        const scheduledEvent = scheduledEvents.find(
          (se) => se.id === selectedScheduledEvent.eventId
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

  const addAndOpenNewTimeSlot = async ({ start }: { start: stringOrDate }) => {
    if (
      !draggingEventDetails?.proposalBookingId ||
      !draggingEventDetails.instrumentId
    ) {
      return;
    }

    setIsAddingOrResizingTimeSlot(true);

    const newEventStart = moment(start);
    const newEventEnd = moment(start).add(
      draggingEventDetails.timeToAllocate,
      'seconds'
    );

    if (view === Views.MONTH && newEventStart.hour() === 0) {
      newEventStart.set({ hour: 9, minute: 0, second: 0 });
      newEventEnd.set({ hour: 9, minute: 0, second: 0 });
    }

    const {
      createScheduledEvent: { error, scheduledEvent: createdScheduledEvent },
    } = await api().createScheduledEvent({
      input: {
        proposalBookingId: draggingEventDetails.proposalBookingId,
        bookingType: ScheduledEventBookingType.USER_OPERATIONS,
        instrumentId: draggingEventDetails.instrumentId,
        startsAt: newEventStart.format(TZ_LESS_DATE_TIME_FORMAT),
        endsAt: newEventEnd.format(TZ_LESS_DATE_TIME_FORMAT),
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
    setIsAddingOrResizingTimeSlot(false);
    setDraggingEventDetails(null);
  };

  const onDropFromOutside = async ({ start }: { start: stringOrDate }) => {
    await addAndOpenNewTimeSlot({ start });
  };

  const getUpdatedProposalBookings = (
    updatedEvent: CalendarScheduledEventWithUniqueId
  ) =>
    proposalBookings.map((booking) => ({
      ...booking,
      scheduledEvents:
        booking.id === updatedEvent.proposalBooking?.id
          ? booking.scheduledEvents.map((scheduledEvent) => ({
              ...scheduledEvent,
              startsAt:
                scheduledEvent.id === updatedEvent.eventId
                  ? toTzLessDateTime(updatedEvent.start)
                  : scheduledEvent.startsAt,
              endsAt:
                scheduledEvent.id === updatedEvent.eventId
                  ? toTzLessDateTime(updatedEvent.end)
                  : scheduledEvent.endsAt,
            }))
          : booking.scheduledEvents,
    }));

  const updateScheduledEvent = async (
    updatedEvent: CalendarScheduledEventWithUniqueId
  ) => {
    try {
      const {
        updateScheduledEvent: { error, scheduledEvent: updatedScheduledEvent },
      } = await api().updateScheduledEvent({
        input: {
          scheduledEventId: updatedEvent.eventId,
          startsAt: toTzLessDateTime(updatedEvent.start),
          endsAt: toTzLessDateTime(updatedEvent.end),
        },
      });

      if (error) {
        enqueueSnackbar(getTranslation(error as ResourceId), {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Experiment time updated', {
          variant: 'success',
        });

        const newScheduledEvents = scheduledEvents.map((event) => ({
          ...event,
          startsAt:
            event.id === updatedScheduledEvent?.id
              ? updatedScheduledEvent.startsAt
              : event.startsAt,
          endsAt:
            event.id === updatedScheduledEvent?.id
              ? updatedScheduledEvent.endsAt
              : event.endsAt,
        }));

        setScheduledEvents(newScheduledEvents);

        //NOTE: Update bookins so the right todo toolbar stays up to date after event is changed.
        const updatedProposalBookings =
          getUpdatedProposalBookings(updatedEvent);
        setProposalBookings(updatedProposalBookings);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onEventResize = async ({
    event,
    start,
    end,
    isAllDay,
  }: {
    event: CalendarScheduledEventWithUniqueId;
    start: stringOrDate;
    end: stringOrDate;
    isAllDay: boolean;
  }) => {
    if (!start || !end) {
      return;
    }

    setIsAddingOrResizingTimeSlot(true);

    /** NOTE: On week/day view if the event is spread on multiple days,
     *  for example if you are resizing the event from the start,
     *  the end is set to 23:59:59 on the same day so we want to prevent updating the end if initially was different date
     *  (same happens if you try to resize from the end).
     *  This is how resize works in the react-big-calendar.
     */
    const shouldNotChangeStart =
      !isAllDay &&
      view !== Views.MONTH &&
      moment(start).day() !== moment(event.start).day();
    const shouldNotChangeEnd =
      !isAllDay &&
      view !== Views.MONTH &&
      moment(end).day() !== moment(event.end).day();

    const updatedEvent: CalendarScheduledEventWithUniqueId = {
      ...event,
      start: shouldNotChangeStart ? event.start : moment(start).toDate(),
      end: shouldNotChangeEnd ? event.end : moment(end).toDate(),
    };

    if (
      hasOverlappingEvents(
        getProposalBookingEventsForOverlapCheck(scheduledEvents, {
          id: updatedEvent.eventId,
          startsAt: updatedEvent.start,
          endsAt: updatedEvent.end,
        })
      )
    ) {
      showConfirmation({
        message: (
          <>
            You have <strong>overlapping events</strong>, are you sure you want
            to continue?
          </>
        ),
        cb: async () => await updateScheduledEvent(updatedEvent),
      });
    } else {
      await updateScheduledEvent(updatedEvent);
    }

    setIsAddingOrResizingTimeSlot(false);
  };

  const onSchedulerActiveViewChange = (
    event: SelectChangeEvent<SchedulerViews>
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
            refresh={refresh}
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
            onEventResize={onEventResize}
            onSelectTimeSlot={setSelectedEvent}
          />
        );
    }
  };

  // 100% height needed for month view
  // also the other components make whole page scrollable without it
  return (
    <StyledContainer
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
                selectedInstrumentIds={getArrayOfIdsFromQuery(queryInstrument)}
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
                    <ChevronLeft fontSize="small" />
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
                className={`tinyScroll ${classes.collapsibleGrid} ${
                  isTabletOrMobile && classes.collapsibleGridMobile
                }  ${isTablet && classes.collapsibleGridTablet}
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
                        <CloseIcon fontSize="small" />
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
                      variant="standard"
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
            {(loadingEvents ||
              loadingBookings ||
              isAddingOrResizingTimeSlot) && <Loader />}
          </StyledPaper>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}
