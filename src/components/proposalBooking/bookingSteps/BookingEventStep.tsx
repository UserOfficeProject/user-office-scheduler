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
import moment from 'moment';
import React from 'react';

import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';
import { toTzLessDateTime } from 'utils/date';

import TimeTable from '../TimeTable';

const useStyles = makeStyles(theme => ({
  noShrink: {
    flexShrink: 0,
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
}));

const rows = new Array(0).fill(0).map((_, i) => ({
  id: `${i}`,
  startsAt: moment()
    .startOf('hour')
    .toDate(),
  endsAt: moment()
    .startOf('hour')
    .add(1, 'hour')
    .toDate(),
}));

type BookingEventStepProps = {
  proposalBooking: InstrumentProposalBooking;
  nextStep: () => void;
};

export default function BookingEventStep({
  proposalBooking,
  nextStep,
}: BookingEventStepProps) {
  const {
    call: { startCycle, endCycle, cycleComment },
    proposal: { title },
  } = proposalBooking;

  const classes = useStyles();

  return (
    <>
      <DialogContent className={classes.noShrink}>
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
                <ListItemText primary="Allocated time" secondary={`1 hours`} />
                <ListItemText
                  primary="Allocatable time"
                  secondary={`998 hours`}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogContent>
        <TimeTable
          editable
          rows={rows}
          titleComponent={
            <>
              Time slots
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                style={{ marginLeft: 16 }}
              >
                Add
              </Button>
            </>
          }
        />
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="primary">
          Save draft
        </Button>
        <Button
          variant="contained"
          color="primary"
          // alert user on unsaved values
          onClick={nextStep}
        >
          Next
        </Button>
      </DialogActions>
    </>
  );
}
