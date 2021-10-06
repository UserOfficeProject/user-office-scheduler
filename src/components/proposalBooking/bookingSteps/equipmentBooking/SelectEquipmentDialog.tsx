import {
  DialogContent,
  DialogActions,
  Button,
  TableCell,
  Dialog,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

import Loader from 'components/common/Loader';
import Table, { HeadCell } from 'components/common/Table';
import { TimeTableRow } from 'components/proposalBooking/TimeTable';
import { useDataApi } from 'hooks/common/useDataApi';
import useAvailableEquipments from 'hooks/equipment/useAvailableEquipments';
import { DetailedProposalBooking } from 'hooks/proposalBooking/useProposalBooking';

export type EquipmentTableRow = {
  id: number;
  name: string;
  description: string | null;
  autoAccept: boolean;
};

const defaultHeadCells: HeadCell<EquipmentTableRow>[] = [
  { id: 'name', label: 'Name' },
  {
    id: 'description',
    label: 'Description',
  },
  {
    id: 'autoAccept',
    label: 'Auto accept',
  },
];

export default function SelectEquipmentDialog({
  isDialogOpen,
  proposalBooking,
  scheduledEvent,
  closeDialog,
}: {
  isDialogOpen: boolean;
  proposalBooking: DetailedProposalBooking;
  scheduledEvent: TimeTableRow;
  closeDialog: (closeAll?: boolean) => void;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const api = useDataApi();
  const { equipments, loading } = useAvailableEquipments(scheduledEvent.id);
  const [selectedEquipments, setSelectedEquipments] = useState<number[]>([]);

  const handleAssign = async (ids: number[]) => {
    const { assignToScheduledEvents: success } =
      await api().assignEquipmentToScheduledEvent({
        assignEquipmentsToScheduledEventInput: {
          equipmentIds: ids,
          scheduledEventId: scheduledEvent.id,
          proposalBookingId: proposalBooking.id,
        },
      });

    success
      ? enqueueSnackbar('Success', { variant: 'success' })
      : enqueueSnackbar('Failed to assign the selected time slots', {
          variant: 'error',
        });

    success && closeDialog(true);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => {
        closeDialog(true);
      }}
      maxWidth="md"
      fullWidth
    >
      {loading && <Loader />}
      <DialogContent>
        <Table
          selectable
          onSelectionChange={(selectedItems) =>
            setSelectedEquipments(selectedItems)
          }
          defaultOrderBy="name"
          tableTitle="Equipments"
          headCells={defaultHeadCells}
          tableContainerMaxHeight={600}
          showEmptyRows
          rows={equipments}
          extractKey={(el) => el.id}
          renderRow={(row) => {
            return (
              <>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.description}</TableCell>
                <TableCell align="left">
                  {row.autoAccept ? 'yes' : 'no'}
                </TableCell>
              </>
            );
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAssign(selectedEquipments)}
          disabled={!selectedEquipments.length}
          data-cy="btn-assign-equipment"
        >
          Assign equipment
        </Button>
        <Button color="primary" onClick={() => closeDialog()}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
