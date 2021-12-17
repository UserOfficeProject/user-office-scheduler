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
import { EquipmentAssignmentStatus } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import useAvailableEquipments from 'hooks/equipment/useAvailableEquipments';
import {
  ScheduledEventEquipment,
  ScheduledEventWithEquipments,
} from 'hooks/scheduledEvent/useScheduledEventWithEquipment';

export type EquipmentTableRow = {
  id: number;
  name: string;
  description?: string | null;
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
  scheduledEvent,
  proposalBookingId,
  closeDialog,
}: {
  isDialogOpen: boolean;
  scheduledEvent: ScheduledEventWithEquipments;
  proposalBookingId: number;
  closeDialog: (assignedEquipments?: ScheduledEventEquipment[]) => void;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const api = useDataApi();
  const { equipments, loading } = useAvailableEquipments(scheduledEvent.id);
  const [selectedEquipments, setSelectedEquipments] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAssign = async (ids: number[]) => {
    setIsLoading(true);
    const { assignToScheduledEvents: success } =
      await api().assignEquipmentToScheduledEvent({
        assignEquipmentsToScheduledEventInput: {
          equipmentIds: ids,
          scheduledEventId: scheduledEvent.id,
          proposalBookingId: proposalBookingId,
        },
      });

    success
      ? enqueueSnackbar('Success', { variant: 'success' })
      : enqueueSnackbar('Failed to assign the selected time slots', {
          variant: 'error',
        });

    if (success) {
      const assignedEquipments = equipments
        .filter((equipment) => ids.includes(equipment.id))
        .map((equipment) => ({
          ...equipment,
          status: equipment.autoAccept
            ? EquipmentAssignmentStatus.ACCEPTED
            : EquipmentAssignmentStatus.PENDING,
        }));

      setIsLoading(false);
      closeDialog(assignedEquipments);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => {
        closeDialog();
      }}
      maxWidth="md"
      fullWidth
    >
      {(loading || isLoading) && <Loader />}
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
