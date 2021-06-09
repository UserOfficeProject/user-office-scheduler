import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import React from 'react';

import ViewEquipment from './ViewEquipment';

const useStyles = makeStyles(() => ({
  fullHeight: {
    height: '100%',
  },
}));

type EquipmentBookingDialogProps = {
  activeEquipmentBookingId: string;
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
