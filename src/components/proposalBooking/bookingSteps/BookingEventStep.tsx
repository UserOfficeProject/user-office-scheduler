import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
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
  Add as AddIcon,
  Save as SaveIcon,
} from '@material-ui/icons';
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

import Loader from 'components/common/Loader';
import { AppContext } from 'context/AppContext';
import { ProposalBookingStatus } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import useProposalBookingScheduledEvents from 'hooks/scheduledEvent/useProposalBookingScheduledEvents';
import { parseTzLessDateTime, toTzLessDateTime } from 'utils/date';
import { hasOverlappingEvents } from 'utils/scheduledEvent';

import { ProposalBookingDialogStepProps } from '../ProposalBookingDialog';
import TimeTable, { TimeTableRow } from '../TimeTable';

const formatDuration = (durSec: number) =>
  humanizeDuration(durSec * 1000, {
    conjunction: ' and ',
    serialComma: false,
    largest: 3,
  });

export default function BookingEventStep({
  activeStatus,
  proposalBooking,
  isDirty,
  handleNext,
  handleSetDirty,
  handleCloseDialog,
}: ProposalBookingDialogStepProps) {
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
  }));
  const [isEditingTimeTable, setIsEditingTimeTable] = useState(false);

  const isStepReadOnly =
    activeStatus !== ProposalBookingStatus.DRAFT || isEditingTimeTable;

  const {
    call: { startCycle, endCycle, cycleComment },
    proposal: { title },
  } = proposalBooking;

  const classes = useStyles();

  const { loading, scheduledEvents } = useProposalBookingScheduledEvents(
    proposalBooking.id
  );

  const { showConfirmation } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const api = useDataApi();
  const [rows, setRows] = useState<TimeTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { allocated, allocatable } = useMemo(() => {
    const allocated = rows.reduce(
      (total, curr) => total + curr.endsAt.diff(curr.startsAt, 'seconds'),
      0
    );

    return {
      allocated,
      allocatable: proposalBooking.allocatedTime - allocated,
    };
  }, [rows, proposalBooking]);

  const handleOnEditModeChanged = useCallback((isReadOnly: boolean) => {
    setIsEditingTimeTable(isReadOnly);
  }, []);

  useEffect(() => {
    if (!loading) {
      setRows(
        scheduledEvents.map(({ startsAt, endsAt, ...rest }) => ({
          ...rest,
          startsAt: parseTzLessDateTime(startsAt),
          endsAt: parseTzLessDateTime(endsAt),
        }))
      );

      setIsLoading(false);
    }
  }, [loading, scheduledEvents]);

  const handleRowsChange = (cb: React.SetStateAction<TimeTableRow[]>) => {
    !isDirty && handleSetDirty(true);
    setRows(cb);
  };

  const handleAdd = () => {
    const lastRow = rows.length > 0 ? rows[rows.length - 1] : undefined;
    const startsAt = lastRow?.endsAt ?? moment().startOf('hour');
    const endsAt = startsAt.clone().startOf('hour').add(1, 'day');

    handleRowsChange((rows) => [
      ...rows,
      {
        id: `t-${Date.now()}`,
        newlyCreated: true,
        startsAt: startsAt,
        endsAt: endsAt,
      },
    ]);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const {
        bulkUpsertScheduledEvents: {
          error,
          scheduledEvent: updatedScheduledEvents,
        },
      } = await api().bulkUpsertScheduledEvents({
        input: {
          proposalBookingId: proposalBooking.id,
          scheduledEvents: rows.map(({ startsAt, endsAt, ...rest }) => ({
            ...rest,
            startsAt: toTzLessDateTime(startsAt),
            endsAt: toTzLessDateTime(endsAt),
          })),
        },
      });

      if (error) {
        enqueueSnackbar(getTranslation(error as ResourceId), {
          variant: 'error',
        });
      } else {
        updatedScheduledEvents &&
          setRows(
            updatedScheduledEvents.map(({ startsAt, endsAt, ...rest }) => ({
              ...rest,
              startsAt: parseTzLessDateTime(startsAt),
              endsAt: parseTzLessDateTime(endsAt),
            }))
          );
      }

      handleSetDirty(false);
    } catch (e) {
      // TODO
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    hasOverlappingEvents(rows)
      ? showConfirmation({
          message: (
            <>
              You have <strong>overlapping bookings</strong>, are you sure you
              want to continue?
            </>
          ),
          cb: handleSubmit,
        })
      : handleSubmit();
  };

  const saveAndContinue = async () => {
    await handleSubmit();
    handleNext();
  };

  const handleSaveAndContinue = () => {
    hasOverlappingEvents(rows)
      ? showConfirmation({
          message: (
            <>
              You have <strong>overlapping bookings</strong>, are you sure you
              want to continue?
            </>
          ),
          cb: saveAndContinue,
        })
      : saveAndContinue();
  };

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
        <TimeTable
          selectable={!isStepReadOnly}
          editable={!isStepReadOnly}
          maxHeight={380}
          rows={rows}
          handleRowsChange={handleRowsChange}
          onEditModeToggled={handleOnEditModeChanged}
          titleComponent={
            <>
              Time slots
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                className={classes.spacingLeft}
                onClick={handleAdd}
                data-cy="btn-add-time-slot"
                disabled={isStepReadOnly}
              >
                Add
              </Button>
            </>
          }
        />
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
          startIcon={<SaveIcon />}
          onClick={handleSaveDraft}
          data-cy="btn-save"
          disabled={isStepReadOnly}
        >
          Save draft
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveAndContinue}
          data-cy="btn-next"
          disabled={isStepReadOnly}
        >
          Save and continue
        </Button>
      </DialogActions>
    </>
  );
}
