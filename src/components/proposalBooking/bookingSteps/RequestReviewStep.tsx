import {
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from '@material-ui/core';
import React from 'react';

import { DetailedProposalBooking } from 'hooks/proposalBooking/useProposalBooking';

type RequestReviewStepProps = {
  proposalBooking: DetailedProposalBooking;
  handleBack: () => void;
  handleNext: () => void;
};

export default function RequestReviewStep({
  handleBack,
  handleNext,
}: RequestReviewStepProps) {
  return (
    <>
      <DialogContent>
        <Typography align="center">
          Not implemented yet, please proceed
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          Next
        </Button>
      </DialogActions>
    </>
  );
}
