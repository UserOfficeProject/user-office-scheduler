import {
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Info as InfoIcon,
  AssignmentInd as PersonAssignedIcon,
  PersonAdd as PersonAddIcon,
  Edit,
} from '@mui/icons-material';
import AdapterMoment from '@mui/lab/AdapterMoment';
import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {
  Alert,
  AlertTitle,
  Avatar,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';

import DateTimeRangePickerRenderInput from 'components/common/DateTimeRangePickerRenderInput';
import PeopleModal from 'components/common/PeopleModal';
import {
  BasicUserDetails,
  ProposalBookingStatusCore,
  ScheduledEvent,
  UserRole,
} from 'generated/sdk';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';
import { toTzLessDateTime } from 'utils/date';
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
  onEventDateChange: (event: ScheduledEvent) => void;
  onEventLocalContactChange: (event: ScheduledEvent) => void;
  proposalBooking: InstrumentProposalBooking;
  isDirty: boolean;
  handleSetDirty: (isDirty: boolean) => void;
};

export default function TimeSlotDetails({
  scheduledEvent,
  onEventDateChange,
  onEventLocalContactChange,
  proposalBooking,
  isDirty,
  handleSetDirty,
}: TimeSlotDetailsProps) {
  const theme = useTheme();
  const classes = useStyles();
  const [editingDate, setEditingDate] = useState(false);
  const [shouldOpenRangePicker, setShouldOpenRangePicker] =
    useState<boolean>(false);
  const [showPeopleModal, setShowPeopleModal] = useState(false);
  const [[startsAt, endsAt], setStartAndEndValues] = React.useState<
    DateRange<Moment>
  >([moment(scheduledEvent.startsAt), moment(scheduledEvent.endsAt)]);

  const [isOutsideCallCycleInterval, setIsOutsideCallCycleInterval] = useState(
    checkIfOutsideCallCycleInterval(
      startsAt,
      endsAt,
      proposalBooking.call.startCycle,
      proposalBooking.call.endCycle
    )
  );

  useEffect(() => {
    if (editingDate) {
      // NOTE: This timeout is needed to open the range picker at the right position. Otherwise it is opened on the top left corner of the browser window.
      setTimeout(() => {
        setShouldOpenRangePicker(true);
      });
    } else {
      setShouldOpenRangePicker(false);
    }
  }, [editingDate]);

  useEffect(() => {
    if (scheduledEvent) {
      setEditingDate(false);
    }
  }, [scheduledEvent]);

  const isStepReadOnly =
    scheduledEvent.status === ProposalBookingStatusCore.COMPLETED;
  const isEditable = scheduledEvent.status === ProposalBookingStatusCore.DRAFT;

  const handleOnSave = () => {
    if (!startsAt || !endsAt || !startsAt.isValid() || !endsAt.isValid()) {
      // when the value is empty or invalid it is quite obvious why we prevent save
      return;
    }

    !isDirty && handleSetDirty(true);

    onEventDateChange({
      ...scheduledEvent,
      startsAt: toTzLessDateTime(startsAt),
      endsAt: toTzLessDateTime(endsAt),
    });
  };

  const addLocalContact = (data: BasicUserDetails[]) => {
    const [selectedLocalContact] = data;

    if (selectedLocalContact) {
      handleSetDirty(true);
      onEventLocalContactChange({
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

  const onChangeHandler = ([newStartValue, newEndValue]: DateRange<Moment>) => {
    if (newStartValue && newStartValue.hour() === 0) {
      newStartValue.set({ hour: 9 });
    }

    if (newEndValue && newEndValue.hour() === 0) {
      newEndValue.set({ hour: 9 });
    }

    setStartAndEndValues([newStartValue, newEndValue]);

    setIsOutsideCallCycleInterval(
      checkIfOutsideCallCycleInterval(
        newStartValue,
        newEndValue,
        proposalBooking.call.startCycle,
        proposalBooking.call.endCycle
      )
    );
  };

  return (
    <>
      <Typography variant="h6" component="h4" align="left">
        Experiment time information
      </Typography>
      {isStepReadOnly && (
        <Alert severity="info">
          Experiment time is already completed and it&apos;s not editable
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
      {isOutsideCallCycleInterval && (
        <Alert
          severity="warning"
          className={classes.spacingTop}
          data-cy="experiment-time-outside-cycle-interval-warning"
        >
          <AlertTitle>Warning</AlertTitle>
          Experiment time should be booked between call cycle start and end
          date.
        </Alert>
      )}
      <Grid container spacing={2}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Grid item lg={9} sm={12}>
            <List className={classes.list} dense>
              <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar>
                    <CalendarTodayIcon />
                  </Avatar>
                </ListItemAvatar>
                {!editingDate && (
                  <>
                    <ListItemText
                      onClick={() => {
                        setEditingDate(isEditable);
                      }}
                      primary="Starts at"
                      data-cy="startsAtInfo"
                      secondary={toTzLessDateTime(startsAt as Moment)}
                    />

                    <ListItemText primary="-" />

                    <ListItemText
                      primary="Ends at"
                      data-cy="endsAtInfo"
                      onClick={() => {
                        setEditingDate(isEditable);
                      }}
                      secondary={toTzLessDateTime(endsAt as Moment)}
                    />

                    {isEditable && (
                      <IconButton
                        onClick={() => {
                          setEditingDate(isEditable);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    )}
                  </>
                )}
                {editingDate && (
                  <>
                    <DateRangePicker
                      label="Experiment time start and end"
                      // NOTE: Using this desktopModeMediaQuery because of cypress issue: https://github.com/cypress-io/cypress/issues/970#issuecomment-969971419
                      desktopModeMediaQuery={theme.breakpoints.up('sm')}
                      value={[startsAt, endsAt]}
                      open={shouldOpenRangePicker}
                      onOpen={() => setShouldOpenRangePicker(true)}
                      onClose={() => setShouldOpenRangePicker(false)}
                      disableCloseOnSelect={true}
                      renderInput={(startProps, endProps) =>
                        DateTimeRangePickerRenderInput({
                          startProps,
                          endProps,
                          value: [startsAt, endsAt],
                          betweenDatesText: '-',
                          startText: 'Starts at',
                          endText: 'Ends at',
                          onChange: onChangeHandler,
                          'data-cy': 'experiment-time-range',
                        })
                      }
                      onChange={onChangeHandler}
                    />
                    <IconButton
                      sx={{ ml: 2 }}
                      onClick={handleOnSave}
                      data-cy="btn-save-experiment-range-change"
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setStartAndEndValues([
                          moment(scheduledEvent.startsAt),
                          moment(scheduledEvent.endsAt),
                        ]);
                        handleSetDirty(false);
                        setEditingDate(false);
                      }}
                      data-cy="btn-reset-experiment-range-change"
                    >
                      <ClearIcon />
                    </IconButton>
                  </>
                )}
              </ListItem>
              {!editingDate && (
                <Divider
                  variant="inset"
                  component="li"
                  className={classes.divider}
                />
              )}
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

                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Scheduled by"
                  secondary={getFullUserName(scheduledEvent.scheduledBy)}
                />

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
            </List>
          </Grid>
        </LocalizationProvider>
      </Grid>
    </>
  );
}
