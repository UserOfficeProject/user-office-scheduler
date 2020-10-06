import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import React from 'react';

type ConfirmationDialogProps = {
  open: boolean;
  message: string | React.ReactNode;
  title?: string | React.ReactNode;
  cancelButtonText?: string;
  confirmButtonText?: string;
  onClose: (confirmed: boolean) => void;
};

export default function ConfirmationDialog({
  open,
  message,
  title,
  cancelButtonText,
  confirmButtonText,
  onClose,
}: ConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">
        {title ?? 'Confirmation'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary" autoFocus>
          {cancelButtonText ?? 'Cancel'}
        </Button>
        <Button onClick={() => onClose(true)} color="primary">
          {confirmButtonText ?? 'Ok'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
