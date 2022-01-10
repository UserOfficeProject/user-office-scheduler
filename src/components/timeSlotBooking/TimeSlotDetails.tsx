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
  Typography,
} from '@material-ui/core';
import {
  CalendarToday as CalendarTodayIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Info as InfoIcon,
  AssignmentInd as PersonAssignedIcon,
  PersonAdd as PersonAddIcon,
  Edit,
} from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import moment, { Moment } from 'moment';
import React, { useState } from 'react';

import PeopleModal from 'components/common/PeopleModal';
import {
  BasicUserDetails,
  ProposalBookingStatusCore,
  ScheduledEvent,
  UserRole,
} from 'generated/sdk';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';
import {
  toTzLessDateTime,
  TZ_LESS_DATE_TIME_LOW_PREC_FORMAT,
} from 'utils/date';
import { getFullUserName } from 'utils/user';

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
  scheduledEvent: ScheduledEvent;
  onSave: (event: ScheduledEvent) => void;
  proposalBooking: InstrumentProposalBooking;
  isDirty: boolean;
  handleSetDirty: (isDirty: boolean) => void;
};

export default function TimeSlotDetails({
  scheduledEvent,
  onSave,
  proposalBooking,
  isDirty,
  handleSetDirty,
}: TimeSlotDetailsProps) {
  const [editingStartDate, setEditingStartDate] = useState(false);
  const [editingEndDate, setEditingEndDate] = useState(false);
  const [showPeopleModal, setShowPeopleModal] = useState(false);

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
      proposalBooking.call.startCycle,
      proposalBooking.call.endCycle
    )
  );

  const handleOnSave = () => {
    if (!startsAt || !endsAt || !startsAt.isValid() || !endsAt.isValid()) {
      // when the value is empty or invalid it is quite obvious why we prevent save
      return;
    }

    !isDirty && handleSetDirty(true);

    onSave({
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
        proposalBooking.call.startCycle,
        proposalBooking.call.endCycle
      )
    );
  };

  const addLocalContact = (data: BasicUserDetails[]) => {
    const [selectedLocalContact] = data;

    if (selectedLocalContact) {
      handleSetDirty(true);
      onSave({
        ...scheduledEvent,
        localContact: selectedLocalContact,
      });
    }

    setShowPeopleModal(false);
  };

  const localContactOptions = proposalBooking.instrument
    ? [
        proposalBooking.instrument.beamlineManager,
        ...proposalBooking.instrument.scientists,
      ]
    : [];

  return (
    <>
      <Typography variant="h6" component="h4" align="left">
        Experiment information
      </Typography>
      {isStepReadOnly && (
        <Alert severity="info">
          Time slot booking is already completed, you can not edit it.
        </Alert>
      )}
      <PeopleModal
        show={showPeopleModal}
        close={() => setShowPeopleModal(false)}
        addParticipants={addLocalContact}
        selectedUsers={
          scheduledEvent.localContact && [scheduledEvent.localContact.id]
        }
        title={'Select local contact'}
        userRole={UserRole.INSTRUMENT_SCIENTIST}
        data={localContactOptions}
      />
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
                    <PersonAssignedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Local contact"
                  data-cy="local-contact-details"
                  secondary={
                    <>
                      {getFullUserName(scheduledEvent.localContact)}
                      {isEditable &&
                        (!scheduledEvent.localContact ? (
                          <PersonAddIcon
                            onClick={() => setShowPeopleModal(true)}
                            fontSize="small"
                            data-cy="add-local-contact"
                            className={classes.editIcon}
                          />
                        ) : (
                          <Edit
                            onClick={() => setShowPeopleModal(true)}
                            fontSize="small"
                            data-cy="edit-local-contact"
                            className={classes.editIcon}
                          />
                        ))}
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
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Scheduled by"
                  secondary={getFullUserName(scheduledEvent.scheduledBy)}
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
