import CloseIcon from '@mui/icons-material/Close';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import React from 'react';

const CloseDialogButton = (props: IconButtonProps) => (
  <IconButton
    {...props}
    aria-label="close"
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
);

export default CloseDialogButton;
