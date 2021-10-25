import {
  Typography,
  makeStyles,
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  TableHead,
  TableBody,
  TableContainer,
  Paper,
  Table as MuiTable,
} from '@material-ui/core';
import {
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import React, { useState } from 'react';

import {
  ScheduledEventWithEquipments,
  ScheduledEventEquipment,
} from 'hooks/scheduledEvent/useScheduledEventsWithEquipments';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function Row({
  row,
  readOnly,
  onDeleteAssignment,
}: {
  row: ScheduledEventWithEquipments;
  readOnly?: boolean;
  onDeleteAssignment: (equipmentId: number, scheduledEventId: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  return (
    <>
      <TableRow className={classes.root} role="row">
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            data-cy="btn-expand-row"
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.startsAt}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.endsAt}
        </TableCell>
      </TableRow>
      <TableRow role="row">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Equipments
              </Typography>
              <MuiTable size="small" aria-label="equipments">
                <TableHead>
                  <TableRow role="row">
                    <TableCell>Actions</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.equipments.map((equipment: ScheduledEventEquipment) => (
                    <TableRow key={equipment.id} role="row">
                      <TableCell component="th" scope="row">
                        <IconButton
                          size="small"
                          data-cy="btn-delete-assignment"
                          disabled={readOnly}
                          onClick={() =>
                            onDeleteAssignment(equipment.id, row.id)
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell>{equipment.name}</TableCell>
                      <TableCell data-cy="equipment-row-status">
                        {equipment.status}
                      </TableCell>
                    </TableRow>
                  ))}
                  {row.equipments.length === 0 && (
                    <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                      No records to show
                    </TableCell>
                  )}
                </TableBody>
              </MuiTable>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function TimeSlotEquipmentTable({
  rows,
  readOnly,
  onDeleteAssignment,
}: {
  rows: ScheduledEventWithEquipments[];
  readOnly?: boolean;
  onDeleteAssignment: (equipmentId: number, scheduledEventId: number) => void;
}) {
  return (
    <TableContainer component={Paper}>
      <MuiTable aria-label="time slot table with equipments">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Starts at</TableCell>
            <TableCell>Ends at</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row
              key={row.id}
              row={row}
              readOnly={readOnly}
              onDeleteAssignment={onDeleteAssignment}
            />
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                No records to show
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
