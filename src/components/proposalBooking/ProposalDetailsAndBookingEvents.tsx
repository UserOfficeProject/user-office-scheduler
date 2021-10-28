import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
import MaterialTable, { Column } from '@material-table/core';
import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import {
  Comment as CommentIcon,
  CalendarToday as CalendarTodayIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import clsx from 'clsx';
import humanizeDuration from 'humanize-duration';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import IdentifierIcon from 'components/common/icons/IdentifierIcon';
import Loader from 'components/common/Loader';
import { tableIcons } from 'components/common/TableIcons';
import TimeSlotBookingDialog from 'components/timeSlotBooking/TimeSlotBookingDialog';
import { AppContext } from 'context/AppContext';
import {
  ProposalBookingStatusCore,
  ScheduledEventBookingType,
} from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';
import { ProposalBookingScheduledEvent } from 'hooks/scheduledEvent/useProposalBookingScheduledEvents';
import { ScheduledEventWithEquipments } from 'hooks/scheduledEvent/useScheduledEventWithEquipment';
import { toTzLessDateTime, TZ_LESS_DATE_TIME_FORMAT } from 'utils/date';

const formatDuration = (durSec: number) =>
  humanizeDuration(durSec * 1000, {
    conjunction: ' and ',
    serialComma: false,
    largest: 3,
  });

const useStyles = makeStyles((theme) => ({
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  divider: {
    marginLeft: theme.spacing(6),
  },
  allocatablePositive: {
    color: theme.palette.success.main,
  },
  allocatableNegative: {
    color: theme.palette.error.main,
  },
  flexColumn: {
    flexGrow: 1,
    maxWidth: '100%',
    flexBasis: 0,
    alignSelf: 'flex-start',
  },
  spacingTop: {
    marginTop: theme.spacing(2),
  },
  root: {
    '& .MuiToolbar-root button.MuiIconButton-root': {
      backgroundColor: 'unset !important',
      padding: 0,
    },
  },
}));

const checkIfSomeScheduledEventIsOutsideCallCycleInterval = (
  scheduledEvents: ProposalBookingScheduledEvent[],
  callCycleStart: Date,
  callCycleEnd: Date
) => {
  if (
    scheduledEvents.some(
      (scheduledEvent) =>
        !moment(scheduledEvent.startsAt).isBetween(
          moment(callCycleStart),
          moment(callCycleEnd)
        ) ||
        !moment(scheduledEvent.endsAt).isBetween(
          moment(callCycleStart),
          moment(callCycleEnd)
        )
    )
  ) {
    return true;
  }

  return false;
};

export type ProposalDetailsAndBookingEventsProps = {
  proposalBooking: InstrumentProposalBooking;
  openedEventId: number | null;
  setOpenedEventId: Dispatch<SetStateAction<number | null>>;
};

export default function ProposalDetailsAndBookingEvents({
  proposalBooking,
  openedEventId,
  setOpenedEventId,
}: ProposalDetailsAndBookingEventsProps) {
  const isStepReadOnly =
    proposalBooking.status === ProposalBookingStatusCore.COMPLETED;

  const {
    call: { startCycle, endCycle, cycleComment },
    proposal: { title, proposalId },
  } = proposalBooking;

  const classes = useStyles();

  const [scheduledEvents, setScheduledEvents] = useState(
    proposalBooking.scheduledEvents as ProposalBookingScheduledEvent[]
  );

  const { showConfirmation } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const api = useDataApi();
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNewTimeSlot, setIsAddingNewTimeSlot] = useState(false);
  const [selectedEvent, setSelectedEvent] =
    useState<ProposalBookingScheduledEvent | null>(null);

  const [
    hasEventOutsideCallCycleInterval,
    setHasEventOutsideCallCycleInterval,
  ] = useState(
    checkIfSomeScheduledEventIsOutsideCallCycleInterval(
      scheduledEvents,
      proposalBooking.call?.startCycle,
      proposalBooking.call?.endCycle
    )
  );

  useEffect(() => {
    if (openedEventId) {
      const preSelectedEvent = scheduledEvents.find(
        (event) => event.id === openedEventId
      );

      setSelectedEvent(preSelectedEvent || null);
    }
  }, [openedEventId, setSelectedEvent, scheduledEvents]);

  const { allocated, allocatable } = useMemo(() => {
    const allocated = scheduledEvents.reduce(
      (total, curr) =>
        total + moment(curr.endsAt).diff(curr.startsAt, 'seconds'),
      0
    );

    return {
      allocated,
      allocatable: proposalBooking.allocatedTime - allocated,
    };
  }, [scheduledEvents, proposalBooking]);

  const handleOnEditModeChanged = useCallback(
    (editingEventId: number) => {
      const editingEvent = scheduledEvents.find(
        (scheduledEvent) => scheduledEvent.id === editingEventId
      );

      if (editingEvent) {
        setSelectedEvent(editingEvent);
      }
    },
    [scheduledEvents]
  );

  useEffect(() => {
    setIsLoading(false);
    setHasEventOutsideCallCycleInterval(
      checkIfSomeScheduledEventIsOutsideCallCycleInterval(
        scheduledEvents,
        proposalBooking.call.startCycle,
        proposalBooking.call.endCycle
      )
    );
  }, [
    scheduledEvents,
    setScheduledEvents,
    proposalBooking.call.startCycle,
    proposalBooking.call.endCycle,
  ]);

  const handleAdd = async () => {
    setIsAddingNewTimeSlot(true);
    const lastRow =
      scheduledEvents.length > 0
        ? scheduledEvents[scheduledEvents.length - 1]
        : undefined;
    const startsAt = lastRow?.endsAt
      ? moment(lastRow?.endsAt)
      : moment().startOf('hour');
    const endsAt = startsAt.clone().startOf('hour').add(1, 'day');

    if (!proposalBooking.instrument) {
      return;
    }

    const {
      createScheduledEvent: { error, scheduledEvent: createdScheduledEvent },
    } = await api().createScheduledEvent({
      input: {
        proposalBookingId: proposalBooking.id,
        bookingType: ScheduledEventBookingType.USER_OPERATIONS,
        instrumentId: proposalBooking.instrument.id,
        startsAt: startsAt.format(TZ_LESS_DATE_TIME_FORMAT),
        endsAt: endsAt.format(TZ_LESS_DATE_TIME_FORMAT),
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
        setScheduledEvents([...scheduledEvents, createdScheduledEvent]);
        // NOTE: Open the event right after creation
        setSelectedEvent(createdScheduledEvent);
      }
    }

    setIsAddingNewTimeSlot(false);
  };

  const handleDelete = async (data: ProposalBookingScheduledEvent[]) => {
    setIsLoading(true);

    const newEvents = scheduledEvents.filter(
      (scheduledEvent) =>
        !data.map((item) => item.id).includes(scheduledEvent.id)
    );

    if (!proposalBooking.instrument) {
      return;
    }

    // Delete selected events
    const {
      deleteScheduledEvents: { error, scheduledEvents: deletedScheduledEvents },
    } = await api().deleteScheduledEvents({
      input: {
        ids: data.map((item) => item.id),
        proposalBookingId: proposalBooking.id,
        instrumentId: proposalBooking.instrument.id,
      },
    });

    if (error) {
      enqueueSnackbar(getTranslation(error as ResourceId), {
        variant: 'error',
      });
    } else {
      enqueueSnackbar('Time slot deleted successfully', {
        variant: 'success',
      });
      deletedScheduledEvents && setScheduledEvents(newEvents);
    }

    setIsLoading(false);
  };

  const closeDialog = (openedEvent: ScheduledEventWithEquipments | null) => {
    const newEvents = scheduledEvents.map((scheduledEvent) => {
      if (openedEvent && scheduledEvent.id === openedEvent.id) {
        return {
          ...scheduledEvent,
          startsAt: openedEvent.startsAt,
          endsAt: openedEvent.endsAt,
          status: openedEvent.status,
        };
      }

      return scheduledEvent;
    });

    setScheduledEvents(newEvents);
    setOpenedEventId(null);
    setSelectedEvent(null);
  };

  const columns: Column<ProposalBookingScheduledEvent>[] = [
    {
      title: 'Starts at',
      field: 'startsAt',
    },
    {
      title: 'Ends at',
      field: 'endsAt',
    },
    { title: 'Status', field: 'status', editable: 'never' },
  ];

  return (
    <div className={classes.root}>
      {isStepReadOnly && (
        <Alert severity="info">
          Proposal booking is already completed, you can not edit it.
        </Alert>
      )}
      {isLoading && <Loader />}

      <Grid container spacing={2}>
        <Grid item sm={6}>
          <List className={classes.list} dense>
            <ListItem disableGutters>
              <ListItemAvatar>
                <Avatar>
                  <CommentIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Cycle comment" secondary={cycleComment} />
            </ListItem>
            <Divider
              variant="inset"
              component="li"
              className={classes.divider}
            />
            <ListItem disableGutters>
              <ListItemAvatar>
                <Avatar>
                  <CalendarTodayIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Cycle starts"
                secondary={toTzLessDateTime(startCycle)}
              />
              <ListItemText
                primary="Cycle ends"
                secondary={toTzLessDateTime(endCycle)}
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item sm={6}>
          <List className={classes.list} dense>
            <ListItem disableGutters>
              <ListItemAvatar>
                <Avatar>
                  <DescriptionIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Proposal title" secondary={title} />
              <ListItemAvatar>
                <Avatar>
                  <IdentifierIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Proposal ID" secondary={proposalId} />
            </ListItem>
            <Divider
              variant="inset"
              component="li"
              className={classes.divider}
            />
            <ListItem disableGutters>
              <ListItemAvatar>
                <Avatar>
                  <HourglassEmptyIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Allocated time"
                secondary={formatDuration(allocated)}
                className={classes.flexColumn}
              />
              <ListItemText
                primary="Allocatable time"
                className={classes.flexColumn}
                secondary={
                  <>
                    <span
                      className={clsx({
                        [classes.allocatablePositive]: allocatable > 0,
                        [classes.allocatableNegative]: allocatable < 0,
                      })}
                    >
                      {allocatable < 0
                        ? `0 seconds (+${formatDuration(allocatable)})`
                        : formatDuration(allocatable)}
                    </span>
                  </>
                }
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>

      <TimeSlotBookingDialog
        activeTimeSlotScheduledEventId={selectedEvent?.id}
        activeProposalBookingId={proposalBooking.id}
        isDialogOpen={!!selectedEvent}
        closeDialog={closeDialog}
        isOpenedOverProposalBookingDialog={true}
      />
      <MaterialTable
        icons={tableIcons}
        title="Time slots"
        columns={columns}
        data={scheduledEvents}
        options={{
          selection: !isStepReadOnly,
          search: false,
          paging: false,
        }}
        actions={[
          {
            icon: !isStepReadOnly ? EditIcon : ViewIcon,
            tooltip: 'Edit event',
            onClick: (_event, rowData) => {
              handleOnEditModeChanged(
                (rowData as ProposalBookingScheduledEvent).id
              );
            },
            position: 'row',
          },
          {
            icon: () => (
              <IconButton component="span" color="inherit" disabled={isLoading}>
                <DeleteIcon />
              </IconButton>
            ),
            tooltip: 'Delete time slots',
            onClick: (event, data) => {
              showConfirmation({
                message: (
                  <>Are you sure you want to remove selected time slots?</>
                ),
                cb: () => handleDelete(data as ProposalBookingScheduledEvent[]),
              });
            },
            position: 'toolbarOnSelect',
          },
          {
            icon: () => (
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={
                  isAddingNewTimeSlot ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <AddIcon />
                  )
                }
                disabled={isAddingNewTimeSlot}
              >
                Add time slot
              </Button>
            ),
            disabled: isAddingNewTimeSlot,
            hidden: isStepReadOnly,
            onClick: handleAdd,
            isFreeAction: true,
            tooltip: !selectedEvent ? 'Add time slot' : '',
          },
        ]}
      />
      {hasEventOutsideCallCycleInterval && (
        <Alert
          severity="warning"
          className={classes.spacingTop}
          data-cy="some-event-outside-cycle-interval-warning"
        >
          <AlertTitle>Warning</AlertTitle>
          Some of the time slots are booked outside call cycle start and end
          date.
        </Alert>
      )}
    </div>
  );
}
