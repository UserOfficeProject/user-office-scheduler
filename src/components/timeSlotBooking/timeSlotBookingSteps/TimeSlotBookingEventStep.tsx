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
  CalendarToday as CalendarTodayIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Save as SaveIcon,
} from '@material-ui/icons';
import humanizeDuration from 'humanize-duration';
import React, { useContext, useState } from 'react';

import Loader from 'components/common/Loader';
import { AppContext } from 'context/AppContext';
import { ProposalBookingStatus } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
// import useProposalBookingScheduledEvents from 'hooks/scheduledEvent/useProposalBookingScheduledEvents';
import { toTzLessDateTime } from 'utils/date';

import { ProposalBookingDialogStepProps } from '../TimeSlotBookingDialog';

const useStyles = makeStyles((theme) => ({
  root: {
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

const formatDuration = (durSec: number) =>
  humanizeDuration(durSec * 1000, {
    conjunction: ' and ',
    serialComma: false,
    largest: 3,
  });

export default function BookingEventStep({
  activeStatus,
  scheduledEvent,

  isDirty,
  handleNext,
  handleSetDirty,
  handleCloseDialog,
}: ProposalBookingDialogStepProps) {
  const [isEditingTimeTable, setIsEditingTimeTable] = useState(false);

  const isStepReadOnly =
    activeStatus !== ProposalBookingStatus.DRAFT || isEditingTimeTable;

  // const {
  //   call: { startCycle, endCycle, cycleComment },
  //   proposal: { title },
  // } = proposalBooking;

  const classes = useStyles();

  // const { loading, scheduledEvents } = useProposalBookingScheduledEvents(
  //   proposalBooking.id
  // );

  const { showConfirmation } = useContext(AppContext);
  // const { enqueueSnackbar } = useSnackbar();
  const api = useDataApi();
  // const [rows, setRows] = useState<TimeTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // const { allocated, allocatable } = useMemo(() => {
  //   const allocated = rows.reduce(
  //     (total, curr) => total + curr.endsAt.diff(curr.startsAt, 'seconds'),
  //     0
  //   );

  //   return {
  //     allocated,
  //     allocatable: proposalBooking.allocatedTime - allocated,
  //   };
  // }, [rows, proposalBooking]);

  // const handleOnEditModeChanged = useCallback((isReadOnly: boolean) => {
  //   setIsEditingTimeTable(isReadOnly);
  // }, []);

  // useEffect(() => {
  //   if (!loading) {
  //     setRows(
  //       scheduledEvents.map(({ startsAt, endsAt, ...rest }) => ({
  //         ...rest,
  //         startsAt: parseTzLessDateTime(startsAt),
  //         endsAt: parseTzLessDateTime(endsAt),
  //       }))
  //     );

  //     setIsLoading(false);
  //   }
  // }, [loading, scheduledEvents]);

  // const handleRowsChange = (cb: React.SetStateAction<TimeTableRow[]>) => {
  //   !isDirty && handleSetDirty(true);
  //   setRows(cb);
  // };

  // const handleAdd = () => {
  //   const lastRow = rows.length > 0 ? rows[rows.length - 1] : undefined;
  //   const startsAt = lastRow?.endsAt ?? moment().startOf('hour');
  //   const endsAt = startsAt.clone().startOf('hour').add(1, 'day');

  //   handleRowsChange((rows) => [
  //     ...rows,
  //     {
  //       id: `t-${Date.now()}`,
  //       newlyCreated: true,
  //       startsAt: startsAt,
  //       endsAt: endsAt,
  //     },
  //   ]);
  // };

  // const handleSubmit = async () => {
  //   try {
  //     setIsLoading(true);

  //     const {
  //       bulkUpsertScheduledEvents: {
  //         error,
  //         scheduledEvent: updatedScheduledEvents,
  //       },
  //     } = await api().bulkUpsertScheduledEvents({
  //       input: {
  //         proposalBookingId: proposalBooking.id,
  //         scheduledEvents: rows.map(({ startsAt, endsAt, ...rest }) => ({
  //           ...rest,
  //           startsAt: toTzLessDateTime(startsAt),
  //           endsAt: toTzLessDateTime(endsAt),
  //         })),
  //       },
  //     });

  //     if (error) {
  //       enqueueSnackbar(getTranslation(error as ResourceId), {
  //         variant: 'error',
  //       });
  //     } else {
  //       updatedScheduledEvents &&
  //         setRows(
  //           updatedScheduledEvents.map(({ startsAt, endsAt, ...rest }) => ({
  //             ...rest,
  //             startsAt: parseTzLessDateTime(startsAt),
  //             endsAt: parseTzLessDateTime(endsAt),
  //           }))
  //         );
  //     }

  //     handleSetDirty(false);
  //   } catch (e) {
  //     // TODO
  //     console.error(e);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSaveDraft = () => {
    // hasOverlappingEvents(rows)
    //   ? showConfirmation({
    //       message: (
    //         <>
    //           You have <strong>overlapping bookings</strong>, are you sure you
    //           want to continue?
    //         </>
    //       ),
    //       cb: handleSubmit,
    //     })
    //   : handleSubmit();
  };

  // const saveAndContinue = async () => {
  //   await handleSubmit();
  //   handleNext();
  // };

  const handleSaveAndContinue = async () => {
    // hasOverlappingEvents(rows)
    //   ? showConfirmation({
    //       message: (
    //         <>
    //           You have <strong>overlapping bookings</strong>, are you sure you
    //           want to continue?
    //         </>
    //       ),
    //       cb: saveAndContinue,
    //     })
    //   : saveAndContinue();
    // await handleSubmit();
    handleNext();
  };

  return (
    <>
      {isLoading && <Loader />}

      <DialogContent className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <List className={classes.list} dense>
              <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar>
                    <CalendarTodayIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Starts at"
                  secondary={toTzLessDateTime(scheduledEvent.startsAt)}
                />
              </ListItem>
              <Divider
                variant="inset"
                component="li"
                className={classes.divider}
              />
              {/* <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar>
                    <CalendarTodayIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Cycle starts"
                  secondary={toTzLessDateTime()}
                />
                <ListItemText
                  primary="Cycle ends"
                  secondary={toTzLessDateTime(endCycle)}
                />
              </ListItem> */}
            </List>
          </Grid>
          <Grid item xs={6}>
            <List className={classes.list} dense>
              <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar>
                    <HourglassEmptyIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Ends at"
                  secondary={toTzLessDateTime(scheduledEvent.endsAt)}
                />
              </ListItem>
              <Divider
                variant="inset"
                component="li"
                className={classes.divider}
              />
              {/* <ListItem disableGutters>
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
              </ListItem> */}
            </List>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogContent>
        {/* <TimeTable
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
        /> */}
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
