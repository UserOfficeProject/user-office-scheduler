import MomentUtils from '@date-io/moment';
import {
  Avatar,
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
  CalendarToday as CalendarTodayIcon,
  HourglassEmpty as HourglassEmptyIcon,
  People as PeopleIcon,
  FolderOpen as FolderOpenIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Info as InfoIcon,
  Edit,
  Comment as CommentIcon,
} from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import clsx from 'clsx';
import humanizeDuration from 'humanize-duration';
import moment, { Moment } from 'moment';
import React, { Dispatch, useMemo, useState } from 'react';

import IdentifierIcon from 'components/common/icons/IdentifierIcon';
import { ProposalBooking, ProposalBookingStatusCore } from 'generated/sdk';
import { ScheduledEventWithEquipments } from 'hooks/scheduledEvent/useScheduledEventWithEquipment';
import {
  toTzLessDateTime,
  TZ_LESS_DATE_TIME_LOW_PREC_FORMAT,
} from 'utils/date';

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
  spacingLeft: {
    marginLeft: theme.spacing(2),
  },
  smaller: {
    fontSize: '0.875rem',
  },
  editIcon: {
    marginLeft: theme.spacing(1),
    cursor: 'pointer',
    position: 'absolute',
  },
  spacingTop: {
    marginTop: theme.spacing(2),
  },
}));

const formatDuration = (durSec: number) =>
  humanizeDuration(durSec * 1000, {
    conjunction: ' and ',
    serialComma: false,
    largest: 3,
  });

const checkIfOutsideCallCycleInterval = (
  timeSlotStart: Moment | null,
  timeSlotEnd: Moment | null,
  callCycleStart: Date,
  callCycleEnd: Date
) => {
  if (
    timeSlotStart?.isBetween(moment(callCycleStart), moment(callCycleEnd)) &&
    timeSlotEnd?.isBetween(moment(callCycleStart), moment(callCycleEnd))
  ) {
    return false;
  }

  return true;
};

type TimeSlotDetailsProps = {
  scheduledEvent: ScheduledEventWithEquipments;
  setScheduledEvent: Dispatch<
    React.SetStateAction<ScheduledEventWithEquipments | null>
  >;
  isDirty: boolean;
  handleSetDirty: (isDirty: boolean) => void;
};

export default function TimeSlotDetails({
  scheduledEvent,
  setScheduledEvent,
  isDirty,
  handleSetDirty,
}: TimeSlotDetailsProps) {
  const proposalBooking = scheduledEvent.proposalBooking as ProposalBooking;
  const [editingStartDate, setEditingStartDate] = useState(false);

  const [editingEndDate, setEditingEndDate] = useState(false);

  const isStepReadOnly =
    scheduledEvent.status === ProposalBookingStatusCore.COMPLETED;
  const isEditable = scheduledEvent.status === ProposalBookingStatusCore.DRAFT;

  const classes = useStyles();

  const [startsAt, setStartsAt] = useState<Moment | null>(
    moment(scheduledEvent.startsAt)
  );
  const [endsAt, setEndsAt] = useState<Moment | null>(
    moment(scheduledEvent.endsAt)
  );
  const [isOutsideCallCycleInterval, setIsOutsideCallCycleInterval] = useState(
    checkIfOutsideCallCycleInterval(
      startsAt,
      endsAt,
      proposalBooking.call?.startCycle,
      proposalBooking.call?.endCycle
    )
  );

  const handleOnSave = () => {
    if (!startsAt || !endsAt || !startsAt.isValid() || !endsAt.isValid()) {
      // when the value is empty or invalid it is quite obvious why we prevent save
      return;
    }

    !isDirty && handleSetDirty(true);

    setScheduledEvent({
      ...scheduledEvent,
      startsAt: toTzLessDateTime(startsAt),
      endsAt: toTzLessDateTime(endsAt),
    });

    setEditingStartDate(false);
    setEditingEndDate(false);

    setIsOutsideCallCycleInterval(
      checkIfOutsideCallCycleInterval(
        startsAt,
        endsAt,
        proposalBooking.call?.startCycle,
        proposalBooking.call?.endCycle
      )
    );
  };

  const { allocated, allocatable } = useMemo(() => {
    const allocated = proposalBooking.scheduledEvents.reduce(
      (total, curr) =>
        total + moment(curr.endsAt).diff(curr.startsAt, 'seconds'),
      0
    );

    return {
      allocated,
      allocatable: proposalBooking.allocatedTime - allocated,
    };
  }, [proposalBooking]);

  return (
    <>
      {isStepReadOnly && (
        <Alert severity="info">
          Time slot booking is already completed, you can not edit it.
        </Alert>
      )}
      <Grid container spacing={2}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid item sm={6} xs={12}>
            <List className={classes.list} dense>
              <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar>
                    <CalendarTodayIcon />
                  </Avatar>
                </ListItemAvatar>
                {!editingStartDate && (
                  <>
                    <ListItemText
                      onClick={() => {
                        setEditingStartDate(isEditable);
                      }}
                      primary="Starts at"
                      data-cy="startsAtInfo"
                      secondary={
                        <>
                          {toTzLessDateTime(startsAt as Moment)}
                          {isEditable && (
                            <Edit
                              fontSize="small"
                              className={classes.editIcon}
                            />
                          )}
                        </>
                      }
                    />
                  </>
                )}
                {editingStartDate && (
                  <>
                    <KeyboardDateTimePicker
                      required
                      label="Starts at"
                      name={`startsAt`}
                      margin="none"
                      size="small"
                      format={TZ_LESS_DATE_TIME_LOW_PREC_FORMAT}
                      ampm={false}
                      minutesStep={60}
                      fullWidth
                      data-cy="startsAt"
                      InputProps={{
                        className: classes.smaller,
                      }}
                      value={startsAt}
                      onChange={(newValue) => {
                        if (newValue !== startsAt) {
                          handleSetDirty(true);
                        }
                        setStartsAt(newValue);
                      }}
                    />
                    <IconButton
                      onClick={handleOnSave}
                      data-cy="btn-time-table-save-row"
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setStartsAt(moment(scheduledEvent.startsAt));
                        setEditingStartDate(false);
                      }}
                      data-cy="btn-time-table-reset-row"
                    >
                      <ClearIcon />
                    </IconButton>
                  </>
                )}
              </ListItem>
              <Divider
                variant="inset"
                component="li"
                className={classes.divider}
              />
              <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar>
                    <PeopleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Scheduled by"
                  secondary={`${scheduledEvent.scheduledBy?.firstname} ${scheduledEvent.scheduledBy?.lastname}`}
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
                    <HourglassEmptyIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Proposal allocated time"
                  secondary={formatDuration(allocated)}
                  className={classes.flexColumn}
                />
                <ListItemText
                  primary="Proposal allocatable time"
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
                  primary="Call cycle start"
                  secondary={toTzLessDateTime(proposalBooking.call?.startCycle)}
                />
                <ListItemText
                  primary="Call cycle end"
                  secondary={toTzLessDateTime(proposalBooking.call?.endCycle)}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item sm={6} xs={12}>
            <List className={classes.list} dense>
              <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar>
                    <HourglassEmptyIcon />
                  </Avatar>
                </ListItemAvatar>
                {!editingEndDate && (
                  <ListItemText
                    primary="Ends at"
                    data-cy="endsAtInfo"
                    onClick={() => {
                      setEditingEndDate(isEditable);
                    }}
                    secondary={
                      <>
                        {toTzLessDateTime(endsAt as Moment)}
                        {isEditable && (
                          <Edit fontSize="small" className={classes.editIcon} />
                        )}
                      </>
                    }
                  />
                )}
                {editingEndDate && (
                  <>
                    <KeyboardDateTimePicker
                      required
                      label="Ends at"
                      name="endsAt"
                      margin="none"
                      size="small"
                      format={TZ_LESS_DATE_TIME_LOW_PREC_FORMAT}
                      ampm={false}
                      minutesStep={60}
                      fullWidth
                      data-cy="endsAt"
                      InputProps={{
                        className: classes.smaller,
                      }}
                      value={endsAt}
                      onChange={(newValue) => {
                        if (newValue !== startsAt) {
                          handleSetDirty(true);
                        }
                        setEndsAt(newValue);
                      }}
                    />
                    <IconButton
                      onClick={handleOnSave}
                      data-cy="btn-time-table-save-row"
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setEndsAt(moment(scheduledEvent.endsAt));
                        setEditingEndDate(false);
                      }}
                      data-cy="btn-time-table-reset-row"
                    >
                      <ClearIcon />
                    </IconButton>
                  </>
                )}
              </ListItem>
              <Divider
                variant="inset"
                component="li"
                className={classes.divider}
              />
              <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar>
                    <InfoIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Status"
                  secondary={scheduledEvent.status}
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
                    <FolderOpenIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Proposal title"
                  secondary={proposalBooking.proposal?.title}
                />
                <ListItemAvatar>
                  <Avatar>
                    <IdentifierIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Proposal ID"
                  secondary={proposalBooking.proposal?.proposalId}
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
                    <CommentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Call cycle comment"
                  secondary={proposalBooking.call?.cycleComment}
                />
              </ListItem>
            </List>
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>
      {isOutsideCallCycleInterval && (
        <Alert
          severity="warning"
          className={classes.spacingTop}
          data-cy="event-outside-cycle-interval-warning"
        >
          <AlertTitle>Warning</AlertTitle>
          Time slot should be booked between call cycle start and end date.
        </Alert>
      )}
    </>
  );
}
