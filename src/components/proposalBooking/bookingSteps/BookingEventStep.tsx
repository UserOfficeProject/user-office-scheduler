import {
  Avatar,
  Backdrop,
  Button,
  CircularProgress,
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
import moment, { Moment } from 'moment';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState } from 'react';

import ConfirmationDialog from 'components/common/ConfirmationDialog';
import { useUnauthorizedApi } from 'hooks/common/useDataApi';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';
import { toTzLessDateTime } from 'utils/date';
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

const _rows: TimeTableRow[] = [
  {
    id: '00001',
    startsAt: moment().startOf('hour'),
    endsAt: moment()
      .startOf('hour')
      .add(2, 'days'),
  },
  {
    id: '00010',
    startsAt: moment()
      .startOf('hour')
      .add(2, 'day'),
    endsAt: moment()
      .startOf('hour')
      .add(4, 'day'),
  },
  {
    id: '00100',
    startsAt: moment()
      .startOf('hour')
      .add(4, 'days'),
    endsAt: moment()
      .startOf('hour')
      .add(5, 'days'),
  },
];

const formatDuration = (durSec: number) =>
  humanizeDuration(durSec * 1000, {
    conjunction: ' and ',
    serialComma: false,
    largest: 3,
  });

type BookingEventStepProps = {
  proposalBooking: InstrumentProposalBooking;
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

  const { enqueueSnackbar } = useSnackbar();
  const api = useUnauthorizedApi();
  const [rows, setRows] = useState(_rows);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleAdd = () => {
    !isDirty && handleSetDirty(true);
    setRows(rows => [
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

  const handleSave = (id: string, startsAt: Moment, endsAt: Moment) => {
    !isDirty && handleSetDirty(true);

    setRows(
      rows.map(row => {
        if (row.id !== id) {
          return row;
        }

        return {
          ...row,
          startsAt,
          endsAt,
        };
      })
    );
  };

  const handleDelete = (ids: string[]) => {
    !isDirty && handleSetDirty(true);

    setRows(rows.filter(row => !ids.includes(row.id)));
  };

  const [activeConfirmation, setActiveConfirmation] = useState<{
    message: string | React.ReactNode;
    cb: () => void;
  } | null>(null);

  const showConfirmation = (
    confirmationDialog: 'saveDraft' | 'handleNext',
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
      case 'saveDraft':
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

  const handleConfirmationClose = (confirmed: boolean) => {
    setActiveConfirmation(null);

    if (confirmed) {
      activeConfirmation?.cb();
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('handle submit');
      setIsSubmitting(true);

      const updateObj = {
        scheduledById: '0',
        proposalBookingId: proposalBooking.id,
        scheduledEvents: rows.map(({ id, startsAt, endsAt }) => ({
          id,
          startsAt,
          endsAt,
        })),
      };

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
        // enqueueSnackbar(getTranslation(error as ResourceId), {
        //   variant: 'error',
        // });
        console.error({ error });
      } else {
        console.log({ scheduledEvent });
      }
    } catch (e) {
      // TODO
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    hasOverlappingEvents(rows)
      ? showConfirmation('saveDraft', handleSubmit)
      : handleSubmit();
  };

  const handleNextStep = () => {
    isDirty ? showConfirmation('handleNext', handleNext) : handleNext();
  };

  return (
    <>
      <DialogContent className={classes.resetFlex}>
        <ConfirmationDialog
          open={activeConfirmation !== null}
          message={activeConfirmation?.message ?? ''}
          onClose={handleConfirmationClose}
        />
        <Backdrop className={classes.backdrop} open={isSubmitting}>
          <CircularProgress color="inherit" />
        </Backdrop>

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
          onSave={handleSave}
          onDelete={handleDelete}
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
