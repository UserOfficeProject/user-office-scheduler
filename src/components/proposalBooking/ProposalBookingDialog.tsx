import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';

import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';

import BookingEventStep from './bookingSteps/BookingEventStep';
import ClosedStep from './bookingSteps/ClosedStep';
import FinalizeStep from './bookingSteps/FinalizeStep';

type ProposalBookingDialogProps = {
  proposalBooking: InstrumentProposalBooking | null;
  isDialogOpen: boolean;
  closeDialog: (shouldRefresh?: boolean) => void;
};

const steps = [
  'Book events',
  'Request review',
  'Review feedbacks',
  'Finalize',
  'Closed',
];

const maxSteps = steps.length - 1;

function getActiveStep(
  step: number,
  proposalBooking: InstrumentProposalBooking,
  nextStep: () => void
) {
  switch (step) {
    case 0:
      return (
        <BookingEventStep
          proposalBooking={proposalBooking}
          nextStep={nextStep}
        />
      );
    case 1:
    case 2:
      return (
        <>
          <DialogContent>
            <Typography align="center">
              Not implemented yet, please proceed
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={nextStep}>
              Next
            </Button>
          </DialogActions>
        </>
      );
    case 3:
      return <FinalizeStep proposalBooking={proposalBooking} />;
    case 4:
      return <ClosedStep />;
    default:
      return <div>Unknown step</div>;
  }
}

export default function ProposalBookingDialog({
  proposalBooking,
  isDialogOpen,
  closeDialog,
}: ProposalBookingDialogProps) {
  const [activeStep, setActiveStep] = useState(4);

  const handleNext = () => {
    setActiveStep(prevStep => Math.min(prevStep + 1, maxSteps));
  };

  const handleBack = () => {
    setActiveStep(prevStep => Math.max(prevStep - 1, 0));
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => closeDialog()}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        Proposal booking |
        <Button size="small" onClick={handleBack}>
          Back
        </Button>{' '}
        -
        <Button size="small" onClick={handleNext}>
          Next
        </Button>
      </DialogTitle>
      <Stepper activeStep={activeStep}>
        {steps.map(label => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {proposalBooking &&
        getActiveStep(activeStep, proposalBooking, handleNext)}
      <DialogActions>
        <Button
          color="primary"
          onClick={() => closeDialog()}
          data-cy="btn-close-dialog"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
