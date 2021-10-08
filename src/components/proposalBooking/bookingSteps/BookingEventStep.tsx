import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
import MaterialTable, { Column } from '@material-table/core';
import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
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
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import clsx from 'clsx';
import humanizeDuration from 'humanize-duration';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, {
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
  ProposalBookingFinalizeAction,
  ProposalBookingStatusCore,
  ScheduledEventBookingType,
} from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import useProposalBookingScheduledEvents, {
  ProposalBookingScheduledEvent,
} from 'hooks/scheduledEvent/useProposalBookingScheduledEvents';
import { toTzLessDateTime, TZ_LESS_DATE_TIME_FORMAT } from 'utils/date';

import { ProposalBookingDialogStepProps } from '../ProposalBookingDialog';

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

export default function BookingEventStep({
  activeStatus,
  proposalBooking,
  handleCloseDialog,
  handleSetActiveStepByStatus,
  handleNext,
}: ProposalBookingDialogStepProps) {
  const isStepReadOnly = activeStatus === ProposalBookingStatusCore.COMPLETED;

  const {
    call: { startCycle, endCycle, cycleComment },
    proposal: { title, proposalId },
  } = proposalBooking;

  const classes = useStyles();

  const { loading, scheduledEvents, setScheduledEvents, refresh } =
    useProposalBookingScheduledEvents(proposalBooking.id);

  const { showConfirmation } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const api = useDataApi();
  const [isLoading, setIsLoading] = useState(true);
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
    if (!loading) {
      setScheduledEvents(scheduledEvents);

      setIsLoading(false);

      setHasEventOutsideCallCycleInterval(
        checkIfSomeScheduledEventIsOutsideCallCycleInterval(
          scheduledEvents,
          proposalBooking.call.startCycle,
          proposalBooking.call.endCycle
        )
      );
    }
  }, [
    loading,
    scheduledEvents,
    setScheduledEvents,
    proposalBooking.call.startCycle,
    proposalBooking.call.endCycle,
  ]);

  const handleAdd = async () => {
    setIsLoading(true);
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
      createdScheduledEvent &&
        setScheduledEvents([...scheduledEvents, { ...createdScheduledEvent }]);
    }

    setIsLoading(false);
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
      deletedScheduledEvents && setScheduledEvents(newEvents);
    }

    setIsLoading(false);
  };

  const completeBooking = () => {
    showConfirmation({
      message: (
        <>
          Are you sure you want to <strong>complete</strong> the selected
          booking with all the events?
        </>
      ),
      cb: async () => {
        try {
          setIsLoading(true);

          const {
            finalizeProposalBooking: { error },
          } = await api().finalizeProposalBooking({
            action: ProposalBookingFinalizeAction.COMPLETE,
            id: proposalBooking.id,
          });

          if (error) {
            enqueueSnackbar(getTranslation(error as ResourceId), {
              variant: 'error',
            });

            setIsLoading(false);
          } else {
            handleNext();

            handleSetActiveStepByStatus(ProposalBookingStatusCore.COMPLETED);
          }
        } catch (e) {
          // TODO

          setIsLoading(false);
          console.error(e);
        }
      },
    });
  };

  const closeDialog = () => {
    setSelectedEvent(null);

    // TODO: This could be improved instead of refreshing(re-calling the endpoint) the scheduled events we could try to manage that on the frontend
    refresh();
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
    <>
      {isLoading && <Loader />}

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <List className={classes.list} dense>
              <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar>
                    <CommentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Cycle comment"
                  secondary={cycleComment}
                />
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
          <Grid item xs={6}>
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
          }}
          actions={[
            {
              icon: EditIcon,
              tooltip: 'Edit event',
              onClick: (_event, rowData) => {
                handleOnEditModeChanged(
                  (rowData as ProposalBookingScheduledEvent).id
                );
              },
              position: 'row',
            },
            {
              icon: DeleteIcon,
              tooltip: 'Delete time slots',
              onClick: (event, data) => {
                showConfirmation({
                  message: (
                    <>Are you sure you want to remove selected time slots?</>
                  ),
                  cb: () =>
                    handleDelete(data as ProposalBookingScheduledEvent[]),
                });
              },
              position: 'toolbarOnSelect',
            },
            {
              icon: AddIcon,
              onClick: () => {
                handleAdd();
              },
              isFreeAction: true,
              tooltip: 'Add time slot',
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
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={handleCloseDialog}
          data-cy="btn-close-dialog"
        >
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={completeBooking}
          data-cy="btn-complete-booking"
          disabled={isStepReadOnly}
        >
          Complete proposal booking
        </Button>
      </DialogActions>
    </>
  );
}
