import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { makeStyles } from 'tss-react/mui';

import ViewEquipment from './ViewEquipment';

const useStyles = makeStyles()(() => ({
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
  const { classes } = useStyles();

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
      <IconButton
        aria-label="close"
        onClick={() => closeDialog()}
        data-cy="btn-close-dialog"
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <ViewEquipment equipmentId={activeEquipmentBookingId} />
      </DialogContent>
    </Dialog>
  );
}
