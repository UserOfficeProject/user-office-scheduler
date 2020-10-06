import { DialogContent, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import moment from 'moment';
import React from 'react';

import TimeTable from '../TimeTable';

const useStyles = makeStyles(() => ({
  resetFlex: {
    flexShrink: 0,
    flexGrow: 0,
  },
}));

const rows = new Array(60).fill(0).map((_, i) => ({
  id: `${i}`,
  startsAt: moment().startOf('hour'),
  endsAt: moment()
    .startOf('hour')
    .add(1, 'hour'),
}));

export default function ClosedStep() {
  const classes = useStyles();

  return (
    <>
      <DialogContent className={classes.resetFlex}>
        <Alert severity="info">
          Proposal booking is already closed, you can not edit it.
        </Alert>
      </DialogContent>
      <DialogContent>
        <TimeTable
          disableSelect
          maxHeight={530}
          rows={rows}
          titleComponent="Logged lost time"
        />
      </DialogContent>
    </>
  );
}
