import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
import {
  Avatar,
  Divider,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  Comment as CommentIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  HourglassFull as HourglassFullIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Description as DescriptionIcon,
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
import ScienceIcon from 'components/common/icons/ScienceIcon';
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
    margin: theme.spacing(1, 0),
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
    call: { startCycle, endCycle, shortCode: callShortCode },
    proposal: { title, proposalId, proposer },
    instrument,
  } = proposalBooking;

  const classes = useStyles();

  const { scheduledEvents } = proposalBooking;

  const isProposalBookingCompleted = scheduledEvents.length
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
      startCycle,
      endCycle
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
        startCycle,
        endCycle
      )
    );
  }, [scheduledEvents, startCycle, endCycle]);

  const handleAdd = async () => {
    if (!isAddingNewTimeSlot) {
      setIsAddingNewTimeSlot(true);
      const lastRow =
        scheduledEvents.length > 0
          ? scheduledEvents[scheduledEvents.length - 1]
          : undefined;
      const startsAt = lastRow?.endsAt
        ? moment(lastRow?.endsAt)
        : moment().set({ hour: 9, minute: 0, second: 0 }); // NOTE: Start events at 9.00 AM for easier date modifications
      const endsAt = startsAt.clone().add(1, 'day');

      if (!instrument) {
        return;
      }

      const {
        createScheduledEvent: { error, scheduledEvent: createdScheduledEvent },
      } = await api().createScheduledEvent({
        input: {
          proposalBookingId: proposalBooking.id,
          bookingType: ScheduledEventBookingType.USER_OPERATIONS,
          instrumentId: instrument.id,
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
    }
  };

  const handleDelete = async (event: ScheduledEventWithEquipments) => {
    if (!instrument) {
      return;
    }

    // Delete selected events
    const {
      deleteScheduledEvents: { error },
    } = await api().deleteScheduledEvents({
      input: {
        ids: [event.id],
        proposalBookingId: proposalBooking.id,
        instrumentId: instrument.id,
      },
    });

    if (error) {
      enqueueSnackbar(getTranslation(error as ResourceId), {
        variant: 'error',
      });

      throw error;
    } else {
      enqueueSnackbar('Time slot deleted successfully', {
        variant: 'success',
      });

      const newEvents = scheduledEvents.filter(
        (scheduledEvent) => event.id !== scheduledEvent.id
      );

      setSelectedTab(newEvents.length ? newEvents.length - 1 : 0);

      setProposalBooking({ ...proposalBooking, scheduledEvents: newEvents });
    }
  };

  return (
    <div className={classes.root}>
      {isProposalBookingCompleted && (
        <Alert severity="info">
          Proposal booking is already completed, you can not edit it.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Typography variant="h6" component="h3" align="left">
            Proposal information
          </Typography>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={4}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <IdentifierIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Proposal ID" secondary={proposalId} />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <DescriptionIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Proposal title" secondary={title} />
              </ListItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Principal investigator"
                  secondary={getFullUserName(proposer)}
                />
              </ListItem>
            </Grid>
          </Grid>
          <Divider variant="inset" className={classes.divider} />
          <Grid container alignItems="center">
            <Grid item sm={4} xs={12}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <ScienceIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Instrument"
                  secondary={instrument?.name}
                />
              </ListItem>
            </Grid>
            <Grid item sm={4} xs={12}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <HourglassFullIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Allocated time"
                  secondary={formatDuration(allocated)}
                  className={classes.flexColumn}
                />
              </ListItem>
            </Grid>
            <Grid item sm={4} xs={12}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <HourglassEmptyIcon />
                  </Avatar>
                </ListItemAvatar>
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
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={12}>
          <Typography variant="h6" component="h3" align="left">
            Cycle information
          </Typography>
          <Grid container alignItems="center">
            <Grid item sm={4} xs={12}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <CommentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Call short code"
                  secondary={callShortCode}
                />
              </ListItem>
            </Grid>
            <Grid item sm={4} xs={12}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <EventAvailableIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Cycle starts"
                  secondary={toTzLessDateTime(startCycle)}
                />
              </ListItem>
            </Grid>
            <Grid item sm={4} xs={12}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <EventBusyIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Cycle ends"
                  secondary={toTzLessDateTime(endCycle)}
                />
              </ListItem>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Typography
        variant="h6"
        component="h3"
        align="left"
        className={classes.timeSlotsTitle}
      >
        Experiment time
      </Typography>

      <SimpleTabs
        tab={selectedTab}
        tabNames={scheduledEvents.map(
          (item) => `${item.startsAt} - ${item.endsAt}`
        )}
        orientation="vertical"
        handleAdd={!isProposalBookingCompleted ? handleAdd : undefined}
        noItemsText="No records to display. Start by adding new experiment time"
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
