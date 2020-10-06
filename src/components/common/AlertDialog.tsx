import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import React from 'react';

type AlertDialogProps = {
  open: boolean;
  message: string | React.ReactNode;
  title?: string | React.ReactNode;
  buttonText?: string;
  onClose: () => void;
};

export default function AlertDialog({
  open,
  message,
  title,
  buttonText,
  onClose,
}: AlertDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title ?? 'Warning'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          {buttonText ?? 'Back'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
