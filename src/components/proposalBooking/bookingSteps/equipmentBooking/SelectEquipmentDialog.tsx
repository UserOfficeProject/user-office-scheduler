import {
  DialogContent,
  DialogActions,
  Button,
  TableCell,
  Dialog,
} from '@material-ui/core';
import { DoneAll as DoneAllIcon } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import React from 'react';

import Loader from 'components/common/Loader';
import Table, { HeadCell } from 'components/common/Table';
import { TimeTableRow } from 'components/proposalBooking/TimeTable';
import { useDataApi } from 'hooks/common/useDataApi';
import useAvailableEquipments from 'hooks/equipment/useAvailableEquipments';
import { DetailedProposalBooking } from 'hooks/proposalBooking/useProposalBooking';

export type EquipmentTableRow = {
  id: string;
  name: string;
  autoAccept: boolean;
};

const defaultHeadCells: HeadCell<EquipmentTableRow>[] = [
  { id: 'name', label: 'Name' },
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

  const handleAssign = async (ids: string[]) => {
    const {
      assignToScheduledEvents: success,
    } = await api().assignEquipmentToScheduledEvent({
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

  const selectActions = [
    {
      tooltip: 'Assign equipment',
      icon: <DoneAllIcon data-cy="btn-assign-all" />,
      onClick: handleAssign,
    },
  ];

  return (
    <Dialog open={isDialogOpen} maxWidth="md" fullWidth>
      {loading && <Loader />}
      <DialogContent>
        <Table
          selectable
          defaultOrderBy="name"
          tableTitle="Equipments"
          headCells={defaultHeadCells}
          tableContainerMaxHeight={600}
          showEmptyRows
          tooltipActions={selectActions}
          rows={equipments}
          extractKey={el => el.id}
          renderRow={row => {
            return (
              <>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">
                  {row.autoAccept ? 'yes' : 'no'}
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
