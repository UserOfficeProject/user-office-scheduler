import {
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from '@material-ui/core';
import React from 'react';

import { ProposalBookingDialogStepProps } from '../ProposalBookingDialog';

export default function RequestReviewStep({
  handleBack,
  handleNext,
}: ProposalBookingDialogStepProps) {
  return (
    <>
      <DialogContent>
        <Typography align="center">
          Not implemented yet, please proceed
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          data-cy="btn-back"
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          data-cy="btn-next"
        >
          Next
        </Button>
      </DialogActions>
    </>
  );
}
