import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';

import ConfirmationDialog from 'components/common/ConfirmationDialog';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';

import BookingEventStep from './bookingSteps/BookingEventStep';
import ClosedStep from './bookingSteps/ClosedStep';
import FinalizeStep from './bookingSteps/FinalizeStep';

type ProposalBookingDialogProps = {
  proposalBooking: InstrumentProposalBooking | null;
  isDialogOpen: boolean;
  closeDialog: (shouldRefresh?: boolean) => void;
};

const steps = ['Book events', 'Request review', 'Review feedbacks', 'Finalize'];
const maxSteps = steps.length - 1;

function getActiveStep({
  step,
  isDirty,
  proposalBooking,
  handleNext,
  handleBack,
  handleSetDirty,
}: {
  step: number;
  proposalBooking: InstrumentProposalBooking;
  isDirty: boolean;
  handleNext: () => void;
  handleBack: () => void;
  handleSetDirty: (isDirty: boolean) => void;
}) {
  switch (step) {
    case 0:
      return (
        <BookingEventStep
          proposalBooking={proposalBooking}
          handleNext={handleNext}
          handleSetDirty={handleSetDirty}
          isDirty={isDirty}
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
            <Button variant="contained" color="primary" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          </DialogActions>
        </>
      );
    case 3:
      return (
        <FinalizeStep
          proposalBooking={proposalBooking}
          handleSetDirty={handleSetDirty}
          isDirty={isDirty}
        />
      );

    default:
      return <div>Unknown step</div>;
  }
}

const useStyles = makeStyles(() => ({
  fullHeight: {
    height: '100%',
  },
}));

export default function ProposalBookingDialog({
  proposalBooking,
  isDialogOpen,
  closeDialog,
}: ProposalBookingDialogProps) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(3);
  const [isDirty, setIsDirty] = useState(false);
  const [activeConfirmation, setActiveConfirmation] = useState<
    (() => void) | null
  >(null);

  const handleNext = () => {
    setActiveStep(prevStep => Math.min(prevStep + 1, maxSteps));
    setIsDirty(false);
  };

  const handleBack = () => {
    setActiveStep(prevStep => Math.max(prevStep - 1, 0));
    setIsDirty(false);
  };

  const handleCloseDialog = (shouldRefresh?: boolean) => {
    isDirty
      ? // double callback, as set{ActionName} accepts function too
        setActiveConfirmation(() => () => closeDialog(shouldRefresh))
      : closeDialog(shouldRefresh);
  };

  const handleSetDirty = (isDirty: boolean) => {
    setIsDirty(isDirty);
  };

  const handleConfirmationClose = (confirmed: boolean) => {
    setActiveConfirmation(null);

    if (confirmed) {
      activeConfirmation?.();
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => handleCloseDialog()}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        className: classes.fullHeight,
      }}
    >
      <ConfirmationDialog
        open={activeConfirmation !== null}
        onClose={handleConfirmationClose}
        message={
          <>
            You have <strong>unsaved work</strong>, are you sure you want to
            continue?
          </>
        }
      />
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
        (activeStep === steps.length ? (
          <ClosedStep />
        ) : (
          getActiveStep({
            step: activeStep,
            proposalBooking,
            isDirty,
            handleNext,
            handleBack,
            handleSetDirty,
          })
        ))}
      <DialogActions>
        <Button
          color="primary"
          onClick={() => handleCloseDialog()}
          data-cy="btn-close-dialog"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
