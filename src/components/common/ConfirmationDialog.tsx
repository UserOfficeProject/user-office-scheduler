import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import React from 'react';

export type ConfirmationOptionalOptions = {
  title?: string | React.ReactNode;
  cancelButtonText?: string;
  confirmButtonText?: string;
};

type ConfirmationDialogProps = {
  open: boolean;
  message: string | React.ReactNode;
  onClose: (confirmed: boolean) => void;
} & ConfirmationOptionalOptions;

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
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      maxWidth="sm"
      fullWidth
      id="confirmation-dialog"
    >
      <DialogTitle id="confirmation-dialog-title">
        {title ?? 'Confirmation'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose(false)}
          color="primary"
          autoFocus
          data-cy="btn-cancel"
        >
          {cancelButtonText ?? 'Cancel'}
        </Button>
        <Button onClick={() => onClose(true)} color="primary" data-cy="btn-ok">
          {confirmButtonText ?? 'Ok'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
