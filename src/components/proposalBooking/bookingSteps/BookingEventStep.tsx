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
  Comment,
  CalendarToday,
  HourglassEmpty,
  Description,
  Add as AddIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import humanizeDuration from 'humanize-duration';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useMemo, useState } from 'react';

import ConfirmationDialog from 'components/common/ConfirmationDialog';
import Loader from 'components/common/Loader';
import { useUnauthorizedApi } from 'hooks/common/useDataApi';
import { DetailedProposalBooking } from 'hooks/proposalBooking/useProposalBooking';
import useProposalBookingScheduledEvents from 'hooks/scheduledEvent/useProposalBookingScheduledEvents';
import { parseTzLessDateTime, toTzLessDateTime } from 'utils/date';
import { hasOverlappingEvents } from 'utils/scheduledEvent';

import TimeTable, { TimeTableRow } from '../TimeTable';

const useStyles = makeStyles(theme => ({
  resetFlex: {
    flexShrink: 0,
    flexGrow: 0,
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  divider: {
    marginLeft: theme.spacing(6),
  },
  flexStart: {
    justifyContent: 'flex-start',
  },
  spacing: {
    padding: theme.spacing(1),
  },
  widthAuto: {
    width: 'auto',
  },
  verticalCenter: {
    alignItems: 'center',
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const formatDuration = (durSec: number) =>
  humanizeDuration(durSec * 1000, {
    conjunction: ' and ',
    serialComma: false,
    largest: 3,
  });

type BookingEventStepProps = {
  proposalBooking: DetailedProposalBooking;
  isDirty: boolean;
  handleNext: () => void;
  handleSetDirty: (isDirty: boolean) => void;
};

export default function BookingEventStep({
  proposalBooking,
  isDirty,
  handleNext,
  handleSetDirty,
}: BookingEventStepProps) {
  const {
    call: { startCycle, endCycle, cycleComment },
    proposal: { title },
  } = proposalBooking;

  const classes = useStyles();

  const { loading, scheduledEvents } = useProposalBookingScheduledEvents(
    proposalBooking.id
  );

  const { enqueueSnackbar } = useSnackbar();
  const api = useUnauthorizedApi();
  const [rows, setRows] = useState<TimeTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { allocated, allocatable } = useMemo(() => {
    const max = proposalBooking.allocatedTime;

    const allocated = rows.reduce(
      (total, curr) => total + curr.endsAt.diff(curr.startsAt, 'seconds'),
      0
    );

    return {
      allocated,
      allocatable: max - allocated,
    };
  }, [rows, proposalBooking]);

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

  const [activeConfirmation, setActiveConfirmation] = useState<{
    message: string | React.ReactNode;
    cb: () => void;
  } | null>(null);

  const showConfirmation = (
    confirmationDialog: 'unsavedWork' | 'handleNext',
    cb: () => void
  ) => {
    switch (confirmationDialog) {
      case 'handleNext':
        setActiveConfirmation({
          message: (
            <>
              You have <strong>unsaved work</strong>, are you sure you want to
              continue?
            </>
          ),
          cb,
        });
        break;
      case 'unsavedWork':
        setActiveConfirmation({
          message: (
            <>
              You have <strong>overlapping bookings</strong>, are you sure you
              want to continue?
            </>
          ),
          cb,
        });
        break;
    }
  };

  const handleRowsChange = (cb: React.SetStateAction<TimeTableRow[]>) => {
    !isDirty && handleSetDirty(true);
    setRows(cb);
  };

  const handleAdd = () => {
    handleRowsChange(rows => [
      ...rows,
      {
        id: `tmp-${Date.now()}`,
        newlyCreated: true,
        startsAt: moment().startOf('hour'),
        endsAt: moment()
          .startOf('hour')
          .add(1, 'hour'),
      },
    ]);
  };

  const handleConfirmationClose = (confirmed: boolean) => {
    setActiveConfirmation(null);

    if (confirmed) {
      activeConfirmation?.cb();
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('handle submit');
      setIsLoading(true);

      const {
        bulkUpsertScheduledEvents: { error, scheduledEvent },
      } = await api().bulkUpsertScheduledEvents({
        input: {
          scheduledById: '0',
          proposalBookingId: proposalBooking.id,
          scheduledEvents: rows.map(({ id, startsAt, endsAt }) => ({
            id,
            startsAt: toTzLessDateTime(startsAt),
            endsAt: toTzLessDateTime(endsAt),
          })),
        },
      });

      if (error) {
        enqueueSnackbar(getTranslation(error as ResourceId), {
          variant: 'error',
        });
        console.error({ error });
      } else {
        console.log({ scheduledEvent });
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
      ? showConfirmation('unsavedWork', handleSubmit)
      : handleSubmit();
  };

  const handleNextStep = () => {
    isDirty ? showConfirmation('handleNext', handleNext) : handleNext();
  };

  return (
    <>
      {isLoading && <Loader />}
      <ConfirmationDialog
        open={activeConfirmation !== null}
        message={activeConfirmation?.message ?? ''}
        onClose={handleConfirmationClose}
      />

      <DialogContent className={classes.resetFlex}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <List className={classes.list} dense>
              <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar>
                    <Comment />
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
                    <CalendarToday />
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
                    <Description />
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
                    <HourglassEmpty />
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
      </DialogContent>

      <DialogContent>
        <TimeTable
          editable
          maxHeight={380}
          rows={rows}
          handleRowsChange={handleRowsChange}
          titleComponent={
            <>
              Time slots
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                style={{ marginLeft: 16 }}
                onClick={handleAdd}
              >
                Add
              </Button>
            </>
          }
        />
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleSaveDraft}>
          Save draft
        </Button>
        <Button variant="contained" color="primary" onClick={handleNextStep}>
          Next
        </Button>
      </DialogActions>
    </>
  );
}
