import {
  DialogContent,
  DialogActions,
  Button,
  TableCell,
  IconButton,
  Dialog,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';

import Loader from 'components/common/Loader';
import Table from 'components/common/Table';
import {
  TimeTableRow,
  defaultHeadCells as timeTableHeadCells,
} from 'components/proposalBooking/TimeTable';
import { DetailedProposalBooking } from 'hooks/proposalBooking/useProposalBooking';
import useProposalBookingScheduledEvents from 'hooks/scheduledEvent/useProposalBookingScheduledEvents';
import { parseTzLessDateTime, toTzLessDateTime } from 'utils/date';

import SelectEquipmentDialog from './SelectEquipmentDialog';

export type EquipmentTableRow = {
  id: string;
  name: string;
  autoAccept: boolean;
};

export default function SelectTimeSlotsDialog({
  isDialogOpen,
  proposalBooking,
  closeDialog,
}: {
  isDialogOpen: boolean;
  proposalBooking: DetailedProposalBooking;
  closeDialog: () => void;
}) {
  const { loading, scheduledEvents } = useProposalBookingScheduledEvents(
    proposalBooking.id
  );
  const [rows, setRows] = useState<TimeTableRow[]>([]);
  const [selectedScheduledEvent, setSelectedScheduledEvent] =
    useState<TimeTableRow | null>(null);

  useEffect(() => {
    if (!loading) {
      setRows(
        scheduledEvents.map(({ startsAt, endsAt, ...rest }) => ({
          ...rest,
          startsAt: parseTzLessDateTime(startsAt),
          endsAt: parseTzLessDateTime(endsAt),
        }))
      );
    }
  }, [loading, scheduledEvents]);

  const handleCloseDialog = (closeAll?: boolean) => {
    setSelectedScheduledEvent(null);

    if (closeAll) {
      closeDialog();
    }
  };

  const RowActions = ({ row }: { row: TimeTableRow }) => {
    return (
      <IconButton
        data-cy="btn-assign-to-scheduled-event"
        onClick={() => setSelectedScheduledEvent(row)}
      >
        <AddIcon />
      </IconButton>
    );
  };

  return (
    <Dialog open={isDialogOpen} maxWidth="md" fullWidth>
      {loading && <Loader />}
      {isDialogOpen && selectedScheduledEvent && (
        <SelectEquipmentDialog
          isDialogOpen={true}
          closeDialog={handleCloseDialog}
          proposalBooking={proposalBooking}
          scheduledEvent={selectedScheduledEvent}
        />
      )}
      <DialogContent>
        <Table
          tableContainerMaxHeight={600}
          defaultOrderBy="startsAt"
          tableTitle="Time Slots"
          headCells={timeTableHeadCells}
          rowActions={RowActions}
          showEmptyRows
          rows={rows}
          extractKey={(el) => el.id}
          renderRow={(row) => {
            return (
              <>
                <TableCell align="left">
                  {toTzLessDateTime(row.startsAt)}
                </TableCell>
                <TableCell align="left">
                  {toTzLessDateTime(row.endsAt)}
                </TableCell>
              </>
            );
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => closeDialog()}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
