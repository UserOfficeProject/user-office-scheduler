import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import React from 'react';

export type AlertOptionalOptions = {
  title?: string | React.ReactNode;
  buttonText?: string;
};

type AlertDialogProps = {
  open: boolean;
  message: string | React.ReactNode;
  onClose: () => void;
} & AlertOptionalOptions;

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
      id="alert-dialog"
    >
      <DialogTitle id="alert-dialog-title">{title ?? 'Warning'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus data-cy="btn-back">
          {buttonText ?? 'Back'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
