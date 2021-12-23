import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import {
  Comment as CommentIcon,
  CalendarToday as CalendarTodayIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
  Person,
} from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import clsx from 'clsx';
import humanizeDuration from 'humanize-duration';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';

import IdentifierIcon from 'components/common/icons/IdentifierIcon';
import SimpleTabs from 'components/common/SimpleTabs';
import TimeSlotBooking from 'components/timeSlotBooking/TimeSlotBooking';
import {
  ProposalBookingStatusCore,
  ScheduledEvent,
  ScheduledEventBookingType,
} from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';
import { ProposalBookingScheduledEvent } from 'hooks/scheduledEvent/useProposalBookingScheduledEvents';
import { ScheduledEventWithEquipments } from 'hooks/scheduledEvent/useScheduledEventWithEquipment';
import { ButtonContainer } from 'styles/StyledComponents';
import { toTzLessDateTime, TZ_LESS_DATE_TIME_FORMAT } from 'utils/date';
import { getFullUserName } from 'utils/user';

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
  timeSlotsToolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  timeSlotsTitle: {
    marginRight: 'auto',
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
  setProposalBooking: Dispatch<
    SetStateAction<InstrumentProposalBooking | null>
  >;
  openedEventId?: number;
};

export default function ProposalDetailsAndBookingEvents({
  proposalBooking,
  openedEventId,
  setProposalBooking,
}: ProposalDetailsAndBookingEventsProps) {
  const {
    call: { startCycle, endCycle, cycleComment, shortCode: cycleShortCode },
    proposal: { title, proposalId, proposer },
  } = proposalBooking;

  const classes = useStyles();

  const { scheduledEvents } = proposalBooking;

  const isStepReadOnly = scheduledEvents.length
    ? scheduledEvents.every(
        (scheduledEvent) =>
          scheduledEvent.status === ProposalBookingStatusCore.COMPLETED
      )
    : proposalBooking.status === ProposalBookingStatusCore.COMPLETED;

  const { enqueueSnackbar } = useSnackbar();
  const api = useDataApi();
  const preSelectedEventTab =
    openedEventId &&
    scheduledEvents.findIndex((item) => item.id === openedEventId);
  const [selectedTab, setSelectedTab] = useState<number | undefined>(
    preSelectedEventTab || 0
  );
  const [isAddingNewTimeSlot, setIsAddingNewTimeSlot] = useState(false);

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

  useEffect(() => {
    setHasEventOutsideCallCycleInterval(
      checkIfSomeScheduledEventIsOutsideCallCycleInterval(
        scheduledEvents,
        proposalBooking.call.startCycle,
        proposalBooking.call.endCycle
      )
    );
  }, [
    scheduledEvents,
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
      : moment().set({ hour: 9, minute: 0, second: 0 }); // NOTE: Start events at 9.00 AM for easier date modifications
    const endsAt = startsAt.clone().add(1, 'day');

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

      const newScheduledEvents = [
        ...scheduledEvents,
        createdScheduledEvent as ScheduledEvent,
      ];

      if (createdScheduledEvent) {
        setProposalBooking({
          ...proposalBooking,
          scheduledEvents: newScheduledEvents,
        });
        // NOTE: Open the event right after creation
        setSelectedTab(newScheduledEvents.length - 1);
      }
    }

    setIsAddingNewTimeSlot(false);
  };

  const handleDelete = async (event: ScheduledEventWithEquipments) => {
    if (!proposalBooking.instrument) {
      return;
    }

    // Delete selected events
    const {
      deleteScheduledEvents: { error },
    } = await api().deleteScheduledEvents({
      input: {
        ids: [event.id],
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

      const newEvents = scheduledEvents.filter(
        (scheduledEvent) => event.id !== scheduledEvent.id
      );

      setSelectedTab(newEvents.length - 1);

      setProposalBooking({ ...proposalBooking, scheduledEvents: newEvents });
    }
  };

  const hasTimeSlots = !!scheduledEvents.length;

  return (
    <div className={classes.root}>
      {isStepReadOnly && (
        <Alert severity="info">
          Proposal booking is already completed, you can not edit it.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item sm={6}>
          <Typography variant="h6" component="h6" align="left">
            Proposal information
          </Typography>
          <Grid container alignItems="center">
            <Grid item sm={1} xs={12}>
              <ListItemAvatar>
                <Avatar>
                  <DescriptionIcon />
                </Avatar>
              </ListItemAvatar>
            </Grid>
            <Grid item xs={5}>
              <ListItemText primary="Proposal title" secondary={title} />
            </Grid>
            <Grid item sm={1} xs={12}>
              <ListItemAvatar>
                <Avatar>
                  <IdentifierIcon />
                </Avatar>
              </ListItemAvatar>
            </Grid>
            <Grid item xs={5}>
              <ListItemText primary="Proposal ID" secondary={proposalId} />
            </Grid>
          </Grid>
          <Divider variant="inset" className={classes.divider} />
          <Grid container alignItems="center">
            <Grid item sm={1} xs={12}>
              <ListItemAvatar>
                <Avatar>
                  <HourglassEmptyIcon />
                </Avatar>
              </ListItemAvatar>
            </Grid>
            <Grid item xs={5}>
              <ListItemText
                primary="Allocated time"
                secondary={formatDuration(allocated)}
                className={classes.flexColumn}
              />
            </Grid>
            <Grid item xs={6}>
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
            </Grid>
          </Grid>
          <Divider variant="inset" className={classes.divider} />
          <Grid container alignItems="center">
            <Grid item sm={1} xs={12}>
              <ListItemAvatar>
                <Avatar>
                  <Person />
                </Avatar>
              </ListItemAvatar>
            </Grid>
            <Grid item xs={5}>
              <ListItemText
                primary="Principal investigator"
                secondary={getFullUserName(proposer)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="h6" component="h6" align="left">
            Cycle information
          </Typography>
          <Grid container alignItems="center">
            <Grid item sm={1} xs={12}>
              <ListItemAvatar>
                <Avatar>
                  <CommentIcon />
                </Avatar>
              </ListItemAvatar>
            </Grid>
            <Grid item xs={5}>
              <ListItemText
                primary="Cycle shortcode"
                secondary={cycleShortCode}
              />
            </Grid>
            <Grid item xs={6}>
              <ListItemText primary="Cycle comment" secondary={cycleComment} />
            </Grid>
          </Grid>
          <Divider variant="inset" className={classes.divider} />
          <Grid container alignItems="center">
            <Grid item sm={1} xs={12}>
              <ListItemAvatar>
                <Avatar>
                  <CalendarTodayIcon />
                </Avatar>
              </ListItemAvatar>
            </Grid>
            <Grid item xs={5}>
              <ListItemText
                primary="Cycle starts"
                secondary={toTzLessDateTime(startCycle)}
              />
            </Grid>
            <Grid item xs={6}>
              <ListItemText
                primary="Cycle ends"
                secondary={toTzLessDateTime(endCycle)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <ButtonContainer className={classes.timeSlotsToolbar}>
        <Typography
          variant="h6"
          component="h6"
          align="left"
          className={classes.timeSlotsTitle}
        >
          Time slots
        </Typography>
        {!isStepReadOnly && (
          <Button
            variant="contained"
            color="primary"
            component="span"
            onClick={handleAdd}
            data-cy="add-new-timeslot"
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
        )}
      </ButtonContainer>

      {hasTimeSlots && (
        <SimpleTabs
          tab={selectedTab}
          tabNames={scheduledEvents.map(
            (item) => `${item.startsAt} - ${item.endsAt}`
          )}
        >
          {scheduledEvents.map((event) => {
            return (
              <TimeSlotBooking
                key={event.id}
                onDelete={handleDelete}
                activeScheduledEvent={event}
                proposalBooking={proposalBooking}
                setProposalBooking={setProposalBooking}
              />
            );
          })}
        </SimpleTabs>
      )}
      {!hasTimeSlots && (
        <Paper elevation={3}>
          <Box padding={2} textAlign="center">
            No records to display. Start by adding new time slot
          </Box>
        </Paper>
      )}

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
