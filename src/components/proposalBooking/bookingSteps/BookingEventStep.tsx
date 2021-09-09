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
import { tableIcons } from 'components/common/TableIcons';
import TimeSlotBookingDialog from 'components/timeSlotBooking/TimeSlotBookingDialog';
import { AppContext } from 'context/AppContext';
import { ProposalBookingStatus } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import useProposalBookingScheduledEvents, {
  ProposalBookingScheduledEvent,
} from 'hooks/scheduledEvent/useProposalBookingScheduledEvents';
import { toTzLessDateTime } from 'utils/date';

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
}));

export default function BookingEventStep({
  activeStatus,
  proposalBooking,
  handleCloseDialog,
}: ProposalBookingDialogStepProps) {
  const isStepReadOnly = activeStatus !== ProposalBookingStatus.DRAFT;

  const {
    call: { startCycle, endCycle, cycleComment },
    proposal: { title },
  } = proposalBooking;

  const classes = useStyles();

  const { loading, scheduledEvents, refresh } =
    useProposalBookingScheduledEvents(proposalBooking.id);

  const { showConfirmation } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const api = useDataApi();
  const [rows, setRows] = useState<
    (ProposalBookingScheduledEvent & { newlyCreated?: boolean })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] =
    useState<ProposalBookingScheduledEvent | null>(null);

  const { allocated, allocatable } = useMemo(() => {
    const allocated = rows.reduce(
      (total, curr) =>
        total + moment(curr.endsAt).diff(curr.startsAt, 'seconds'),
      0
    );

    return {
      allocated,
      allocatable: proposalBooking.allocatedTime - allocated,
    };
  }, [rows, proposalBooking]);

  const handleOnEditModeChanged = useCallback(
    (editingEventId: number) => {
      const editingEvent = proposalBooking.scheduledEvents.find(
        (scheduledEvent) => scheduledEvent.id === editingEventId
      );

      if (editingEvent) {
        setSelectedEvent(editingEvent);
      }
    },
    [proposalBooking.scheduledEvents]
  );

  useEffect(() => {
    if (!loading) {
      setRows(scheduledEvents);

      setIsLoading(false);
    }
  }, [loading, scheduledEvents]);

  const handleAdd = async () => {
    setIsLoading(true);
    const lastRow = rows.length > 0 ? rows[rows.length - 1] : undefined;
    const startsAt = lastRow?.endsAt
      ? moment(lastRow?.endsAt)
      : moment().startOf('hour');
    const endsAt = startsAt.clone().startOf('hour').add(1, 'day');

    const {
      bulkUpsertScheduledEvents: {
        error,
        scheduledEvent: updatedScheduledEvents,
      },
    } = await api().bulkUpsertScheduledEvents({
      input: {
        proposalBookingId: proposalBooking.id,
        scheduledEvents: [
          ...rows,
          {
            id: 0,
            newlyCreated: true,
            startsAt: startsAt.toString(),
            endsAt: endsAt.toString(),
          },
        ].map(({ id, startsAt, endsAt, newlyCreated = false }) => ({
          newlyCreated,
          id: id,
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
      updatedScheduledEvents && setRows(updatedScheduledEvents);
    }

    setIsLoading(false);
  };

  const handleDelete = async (data: ProposalBookingScheduledEvent[]) => {
    setIsLoading(true);

    const newEvents = rows.filter(
      (row) => !data.map((item) => item.id).includes(row.id)
    );

    // TODO: Create proper functionality for removing an event/s.
    // Delete selected events
    const {
      bulkUpsertScheduledEvents: {
        error,
        scheduledEvent: updatedScheduledEvents,
      },
    } = await api().bulkUpsertScheduledEvents({
      input: {
        proposalBookingId: proposalBooking.id,
        scheduledEvents: newEvents.map((newEvent) => ({
          id: newEvent.id,
          startsAt: newEvent.startsAt,
          endsAt: newEvent.endsAt,
          newlyCreated: false,
        })),
      },
    });

    if (error) {
      enqueueSnackbar(getTranslation(error as ResourceId), {
        variant: 'error',
      });
    } else {
      updatedScheduledEvents && setRows(newEvents);
    }

    setIsLoading(false);
  };

  const completeBooking = () => {};

  const closeDialog = () => {
    setSelectedEvent(null);

    // TODO: This could be improved instead of refreshing(re-calling the endpoint) the scheduled events we could try to manage that on the frontend
    refresh();
  };

  const columns: Column<ProposalBookingScheduledEvent>[] = [
    {
      title: 'Starts at',
      render: (rowData) => toTzLessDateTime(rowData.startsAt),
      customSort: (a, b) =>
        moment(a.startsAt).isAfter(moment(b.startsAt)) ? 1 : -1,
    },
    {
      title: 'Ends at',
      render: (rowData) => toTzLessDateTime(rowData.endsAt),
      customSort: (a, b) =>
        moment(a.endsAt).isAfter(moment(b.endsAt)) ? 1 : -1,
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
          data={rows}
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
          data-cy="btn-next"
          disabled={isStepReadOnly}
        >
          Complete booking
        </Button>
      </DialogActions>
    </>
  );
}
