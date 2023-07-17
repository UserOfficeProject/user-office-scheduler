import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

import ViewEquipment from './ViewEquipment';

const useStyles = makeStyles(() => ({
  fullHeight: {
    height: '100%',
  },
}));

type EquipmentBookingDialogProps = {
  activeEquipmentBookingId: number;
  isDialogOpen: boolean;
  closeDialog: (shouldRefresh?: boolean) => void;
};

export default function ProposalBookingDialog({
  activeEquipmentBookingId,
  isDialogOpen,
  closeDialog,
}: EquipmentBookingDialogProps) {
  const classes = useStyles();

  const handleCloseDialog = () => {
    closeDialog(true);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleCloseDialog}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        className: classes.fullHeight,
      }}
      data-cy="equipment-booking-dialog"
    >
      <DialogTitle>Equipment booking</DialogTitle>
      <DialogContent>
        <ViewEquipment equipmentId={activeEquipmentBookingId} />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={handleCloseDialog}
          data-cy="btn-close-dialog"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
