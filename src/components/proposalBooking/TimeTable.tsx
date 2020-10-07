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
import { Moment } from 'moment';
import React, { useMemo, useState } from 'react';

import AlertDialog from 'components/common/AlertDialog';
import Table, { HeadCell } from 'components/common/Table';
import {
  toTzLessDateTime,
  TZ_LESS_DATE_TIME_LOW_PREC_FORMAT,
} from 'utils/date';

export type TimeTableRow = {
  id: string;
  startsAt: Moment;
  endsAt: Moment;
};

const defaultHeadCells: HeadCell<TimeTableRow>[] = [
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
  onSave: (id: string, startsAt: Moment, endsAt: Moment) => void;
}) {
  const classes = useStyles();
  const [startsAt, setStartsAt] = useState<Moment | null>(row.startsAt);
  const [endsAt, setEndsAt] = useState<Moment | null>(row.endsAt);
  const [alertOn, setAlertOn] = useState(false);

  const handleOnSave = () => {
    if (!startsAt || !endsAt || !startsAt.isValid() || !endsAt.isValid()) {
      // when the value is empty or invalid it is quite obvious why we prevent save
      return;
    }

    if (startsAt >= endsAt) {
      // when the starting date is after ending date
      // it may be less obvious for the user, show alert
      setAlertOn(true);

      return;
    }

    onSave(row.id, startsAt, endsAt);
  };

  const handleAlertClose = () => {
    setAlertOn(false);
  };

  return (
    <>
      <AlertDialog
        open={alertOn}
        onClose={handleAlertClose}
        message="The starting date needs to be before the ending date"
      />
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
    </>
  );
}

type TimeTableProps<T> = {
  rows: T[];
  titleComponent: string | JSX.Element;
  editable?: boolean;
  maxHeight?: number;
  disableSelect?: boolean;
  handleRowsChange?: (cb: React.SetStateAction<TimeTableRow[]>) => void;
};

export default function TimeTable<T extends TimeTableRow>({
  rows,
  titleComponent,
  editable,
  maxHeight,
  disableSelect,
  handleRowsChange,
}: TimeTableProps<T>) {
  const [editing, setEditing] = useState<string | false>(false);

  const handleOnSave = (id: string, startsAt: Moment, endsAt: Moment) => {
    setEditing(false);
    handleRowsChange?.(rows =>
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
    setEditing(false);
    handleRowsChange?.(rows => rows.filter(row => !ids.includes(row.id)));
  };

  const handleEditing = (id: string | false) => () => {
    setEditing(id);
  };

  const headCells = useMemo(() => {
    const copy = [...defaultHeadCells];
    if (!disableSelect) {
      copy.unshift({
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: 'Actions',
      });
    }

    return copy;
  }, [disableSelect]);

  return (
    <Table
      disableSelect={disableSelect}
      tableContainerMaxHeight={maxHeight}
      defaultOrderBy="id"
      tableTitle={titleComponent}
      headCells={headCells}
      rows={rows}
      extractKey={el => el.id}
      onDelete={handleDelete}
      renderRow={row => {
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
            {!disableSelect && (
              <TableCell component="th" scope="row" padding="none">
                {editable && !editing && (
                  <IconButton onClick={handleEditing(row.id)}>
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
            )}
            <TableCell align="left">{toTzLessDateTime(row.startsAt)}</TableCell>
            <TableCell align="left">{toTzLessDateTime(row.endsAt)}</TableCell>
          </>
        );
      }}
    />
  );
}
