import { DialogContent, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import moment from 'moment';
import React from 'react';

import TimeTable from '../TimeTable';

type Test = { id: string; startsAt: Date; endsAt: Date };

const rows: Test[] = new Array(60).fill(0).map((_, i) => ({
  id: `${i}`,
  startsAt: moment()
    .startOf('hour')
    .toDate(),
  endsAt: moment()
    .startOf('hour')
    .add(1, 'hour')
    .toDate(),
}));

export default function ClosedStep() {
  return (
    <>
      <DialogContent style={{ flexShrink: 0 }}>
        <Alert severity="info">
          Proposal booking is already closed, you can not edit it.
        </Alert>
      </DialogContent>
      <DialogContent>
        <TimeTable rows={rows} titleComponent="Logged lost time" />
      </DialogContent>
    </>
  );
}
