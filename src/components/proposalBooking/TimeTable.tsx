import MomentUtils from '@date-io/moment';
import { IconButton, makeStyles, TableCell } from '@material-ui/core';
import {
  Check as CheckIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { Moment } from 'moment';
import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';

import Table, { HeadCell, TableProps } from 'components/common/Table';
import { AppContext } from 'context/AppContext';
import {
  toTzLessDateTime,
  TZ_LESS_DATE_TIME_LOW_PREC_FORMAT,
} from 'utils/date';

export type TimeTableRow = {
  id: string;
  startsAt: Moment;
  endsAt: Moment;
  newlyCreated?: boolean;
};

export const defaultHeadCells: HeadCell<TimeTableRow>[] = [
  { id: 'startsAt', label: 'Starts at' },
  { id: 'endsAt', label: 'Ends at' },
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

  const { showAlert } = useContext(AppContext);
  const [startsAt, setStartsAt] = useState<Moment | null>(row.startsAt);
  const [endsAt, setEndsAt] = useState<Moment | null>(row.endsAt);

  const handleOnSave = () => {
    if (!startsAt || !endsAt || !startsAt.isValid() || !endsAt.isValid()) {
      // when the value is empty or invalid it is quite obvious why we prevent save
      return;
    }

    if (startsAt >= endsAt) {
      // when the starting date is after ending date
      // it may be less obvious for the user, show alert
      showAlert({
        message: 'The starting date needs to be before the ending date',
      });

      return;
    }

    onSave(row.id, startsAt, endsAt);
  };

  return (
    <>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <TableCell component="th" scope="row" padding="none">
          <IconButton onClick={handleOnSave} data-cy="btn-time-table-save-row">
            <CheckIcon />
          </IconButton>
          <IconButton onClick={onDiscard} data-cy="btn-time-table-reset-row">
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
            onChange={(newValue) => setStartsAt(newValue)}
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
            onChange={(newValue) => setEndsAt(newValue)}
          />
        </TableCell>
      </MuiPickersUtilsProvider>
    </>
  );
}

type TimeTableProps<T extends Record<string, unknown>> = {
  rows: T[];
  titleComponent: string | JSX.Element;
  editable?: boolean;
  maxHeight?: number;
  selectable?: boolean;
  handleRowsChange?: (cb: React.SetStateAction<TimeTableRow[]>) => void;
} & Partial<TableProps<T>>;

export default function TimeTable<T extends TimeTableRow>({
  rows,
  titleComponent,
  editable,
  maxHeight,
  selectable,
  handleRowsChange,
  ...props
}: TimeTableProps<T>) {
  const [editing, setEditing] = useState<string | false>(false);

  // when the original list of rows change reset the current edit
  useEffect(() => {
    setEditing(false);
  }, [rows]);

  const handleOnSave = (id: string, startsAt: Moment, endsAt: Moment) => {
    setEditing(false);
    handleRowsChange?.((rows) =>
      rows.map((row) => {
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
    handleRowsChange?.((rows) => rows.filter((row) => !ids.includes(row.id)));
  };

  const handleEditing = (id: string | false) => () => {
    setEditing(id);
  };

  const handleOnPageChange = useCallback(() => setEditing(false), []);

  const headCells = useMemo(() => {
    const copy = [...defaultHeadCells];
    if (editing) {
      copy.unshift({
        id: 'id',
        label: 'Actions',
      });
    }

    return copy;
  }, [editing]);

  const tooltipActions = [
    {
      tooltip: 'Delete',
      icon: <DeleteIcon data-cy="btn-delete" />,
      onClick: handleDelete,
      clearSelect: true,
    },
  ];

  const RowActions = ({ row }: { row: TimeTableRow }) => {
    return (
      <IconButton
        onClick={handleEditing(row.id)}
        data-cy="btn-time-table-edit-row"
      >
        <EditIcon />
      </IconButton>
    );
  };

  const rowActions =
    selectable && editable && !editing ? RowActions : undefined;

  return (
    <Table
      selectable={selectable}
      tableContainerMaxHeight={maxHeight}
      defaultOrderBy="startsAt"
      tableTitle={titleComponent}
      headCells={headCells}
      tooltipActions={tooltipActions}
      rowActions={rowActions}
      rows={rows}
      extractKey={(el) => el.id}
      onDelete={handleDelete}
      onPageChange={handleOnPageChange}
      renderRow={(row) => {
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
            {editing && <TableCell />}
            <TableCell align="left">{toTzLessDateTime(row.startsAt)}</TableCell>
            <TableCell align="left">{toTzLessDateTime(row.endsAt)}</TableCell>
          </>
        );
      }}
      {...props}
    />
  );
}
