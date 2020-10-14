/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Checkbox,
  createStyles,
  IconButton,
  lighten,
  makeStyles,
  Table as MUiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import clsx from 'clsx';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;

    return a[1] - b[1];
  });

  return stabilizedThis.map(el => el[0]);
}

export interface HeadCell<T> {
  disablePadding: boolean;
  id: keyof T;
  label: string;
  numeric: boolean;
}

interface EnhancedTableProps<T> {
  headCells: HeadCell<T>[];
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  order: Order;
  orderBy: keyof T;
  rowCount: number;
  disableSelect?: boolean;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function EnhancedTableHead<T>(props: EnhancedTableProps<T>) {
  const {
    headCells,
    classes,
    order,
    orderBy,
    numSelected,
    rowCount,
    disableSelect,
    onRequestSort,
    onSelectAllClick,
  } = props;
  const createSortHandler = (property: keyof T) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {!disableSelect && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all' }}
            />
          </TableCell>
        )}
        {headCells.map(headCell => (
          <TableCell
            key={`${headCell.id}`}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.9),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
      alignItems: 'center',
      display: 'flex',
    },
  })
);

interface EnhancedTableToolbarProps {
  numSelected: number;
  title: string | JSX.Element;
  onDelete: () => void;
}

const EnhancedTableToolbar = ({
  numSelected,
  title,
  onDelete,
}: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton
            aria-label="delete"
            onClick={onDelete}
            data-cy="btn-delete"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

type TableProps<T extends object> = {
  headCells: HeadCell<T>[];
  rows: T[];
  tableTitle: string | JSX.Element;
  defaultOrderBy: keyof T;
  rowsPerPageOptions?: Array<number | { value: number; label: string }>;
  showEmptyRows?: boolean;
  tableContainerMaxHeight?: number;
  disableSelect?: boolean;
  renderRow: (row: T) => JSX.Element;
  extractKey: (obj: T) => string;
  onDelete?: (ids: string[]) => void;
};

const defaultRowsPerPageOptions = [5, 10, 25, { value: -1, label: 'All' }];

export default function Table<T extends { [k: string]: any }>({
  headCells,
  rows,
  tableTitle,
  defaultOrderBy,
  showEmptyRows,
  tableContainerMaxHeight,
  disableSelect,
  renderRow,
  extractKey,
  onDelete,
}: TableProps<T>) {
  const classes = useStyles();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof T>(defaultOrderBy);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const handleRequestSort = (
    _: React.MouseEvent<unknown>,
    property: keyof T
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedRows = rows.map(n => extractKey(n));
      setSelected(newSelectedRows);

      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, key: string) => {
    const selectedIndex = selected.indexOf(key);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, key);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = () => {
    onDelete?.(selected);
    setSelected([]);
  };

  const isSelected = (key: string) => selected.indexOf(key) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <>
      <EnhancedTableToolbar
        title={tableTitle}
        numSelected={selected.length}
        onDelete={handleDelete}
      />
      <TableContainer
        style={{ maxHeight: tableContainerMaxHeight }}
        className="MuiPaper-elevation2"
      >
        <MUiTable
          className={classes.table}
          aria-labelledby="tableTitle"
          size="medium"
          aria-label="enhanced sticky table"
          stickyHeader
        >
          <EnhancedTableHead
            headCells={headCells}
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            disableSelect={disableSelect}
            rowCount={rows.length}
          />
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={headCells.length + 1}
                  style={{ textAlign: 'center' }}
                >
                  No records to show
                </TableCell>
              </TableRow>
            )}
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(extractKey(row));
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    key={extractKey(row)}
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}
                  >
                    {!disableSelect && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onClick={event => handleClick(event, extractKey(row))}
                          inputProps={{ 'data-cy': labelId } as any}
                        />
                      </TableCell>
                    )}
                    {renderRow(row)}
                  </TableRow>
                );
              })}
            {showEmptyRows && emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </MUiTable>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={defaultRowsPerPageOptions}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
}
