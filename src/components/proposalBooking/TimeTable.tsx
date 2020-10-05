import MomentUtils from '@date-io/moment';
import { IconButton, makeStyles, TableCell } from '@material-ui/core';
import {
  Check as CheckIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
} from '@material-ui/icons';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import moment, { Moment } from 'moment';
import React, { useState } from 'react';

import Table, { HeadCell } from 'components/common/Table';
import {
  toTzLessDateTime,
  TZ_LESS_DATE_TIME_LOW_PREC_FORMAT,
} from 'utils/date';

export type TimeTableRow = {
  id: string;
  startsAt: Date;
  endsAt: Date;
};

const headCells: HeadCell<TimeTableRow>[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'Actions',
  },
  { id: 'startsAt', numeric: false, disablePadding: false, label: 'Starts at' },
  { id: 'endsAt', numeric: false, disablePadding: false, label: 'Ends at' },
];

const useStyles = makeStyles(() => ({
  smaller: {
    fontSize: '0.875rem',
  },
}));

function InlineTimeEdit({
  row,
  onDiscard,
  onSave,
}: {
  row: TimeTableRow;
  onDiscard: () => void;
  onSave: (startsAt: Moment, endsAt: Moment) => void;
}) {
  const classes = useStyles();
  const [startsAt, setStartsAt] = useState<Moment | null>(moment(row.startsAt));
  const [endsAt, setEndsAt] = useState<Moment | null>(moment(row.endsAt));

  const handleOnSave = () => {
    if (!startsAt || !endsAt) {
      return;
    }

    onSave(startsAt, endsAt);
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <TableCell component="th" scope="row" padding="none">
        <IconButton onClick={handleOnSave}>
          <CheckIcon />
        </IconButton>
        <IconButton onClick={onDiscard}>
          <ClearIcon />
        </IconButton>
      </TableCell>
      <TableCell align="left">
        <KeyboardDateTimePicker
          required
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
          onChange={newValue => setStartsAt(newValue)}
        />
      </TableCell>
      <TableCell align="left">
        <KeyboardDateTimePicker
          required
          name={`endsAt`}
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
          onChange={newValue => setEndsAt(newValue)}
        />
      </TableCell>
    </MuiPickersUtilsProvider>
  );
}

type TimeTableProps<T> = {
  rows: T[];
  titleComponent: string | JSX.Element;
  editable?: boolean;
};

export default function TimeTable<T extends TimeTableRow>({
  rows,
  titleComponent,
  editable,
}: TimeTableProps<T>) {
  const [editing, setEditing] = useState<string | false>(false);

  const handleOnSave = (startsAt: Moment, endsAt: Moment) => {
    //
    setEditing(false);
  };

  const handleEditing = (id: string | false) => () => {
    setEditing(id);
  };

  return (
    <Table
      rowsPerPageOptions={[10]}
      defaultOrderBy="id"
      tableTitle={titleComponent}
      headCells={headCells}
      rows={rows}
      extractKey={el => el.id}
      renderRow={row => {
        console.log('render row ', row.id);

        if (editing && row.id === editing) {
          return (
            <InlineTimeEdit
              row={row}
              onDiscard={handleEditing(false)}
              onSave={handleOnSave}
            />
          );
        }

        return (
          <>
            <TableCell component="th" scope="row" padding="none">
              {editable && !editing && (
                <IconButton onClick={handleEditing(row.id)}>
                  <EditIcon />
                </IconButton>
              )}
            </TableCell>
            <TableCell align="left">{toTzLessDateTime(row.startsAt)}</TableCell>
            <TableCell align="left">{toTzLessDateTime(row.endsAt)}</TableCell>
          </>
        );
      }}
    />
  );
}
