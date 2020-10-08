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
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';

import Loader from 'components/common/Loader';
import { AppContext } from 'context/AppContext';
import { ProposalBookingStatus } from 'generated/sdk';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';
import useProposalBooking from 'hooks/proposalBooking/useProposalBooking';

import BookingEventStep from './bookingSteps/BookingEventStep';
import ClosedStep from './bookingSteps/ClosedStep';
import FinalizeStep from './bookingSteps/FinalizeStep';
import RequestReviewStep from './bookingSteps/RequestReviewStep';
import ReviewFeedbackStep from './bookingSteps/ReviewFeedbackStep';

const useStyles = makeStyles(() => ({
  fullHeight: {
    height: '100%',
  },
}));

const steps = ['Book events', 'Request review', 'Review feedbacks', 'Finalize'];
const maxSteps = steps.length;

function getActiveStep({
  activeStep,
  isDirty,
  proposalBooking,
  handleNext,
  handleBack,
  handleResetSteps,
  handleSetDirty,
}: {
  activeStep: number;
  proposalBooking: InstrumentProposalBooking;
  isDirty: boolean;
  handleNext: () => void;
  handleBack: () => void;
  handleResetSteps: () => void;
  handleSetDirty: (isDirty: boolean) => void;
}) {
  switch (activeStep) {
    case 0:
      return (
        <BookingEventStep
          {...{
            proposalBooking,
            isDirty,
            handleSetDirty,
            handleNext,
          }}
        />
      );
    case 1:
      return (
        <RequestReviewStep
          {...{
            proposalBooking,
            handleBack,
            handleNext,
          }}
        />
      );
    case 2:
      return (
        <ReviewFeedbackStep
          {...{
            proposalBooking,
            handleBack,
            handleNext,
          }}
        />
      );
    case 3:
      return (
        <FinalizeStep
          {...{
            proposalBooking,
            handleSetDirty,
            isDirty,
            handleNext,
            handleResetSteps,
          }}
        />
      );

    default:
      return <DialogContent>Unknown step</DialogContent>;
  }
}

const getActiveStepByStatus = (status: ProposalBookingStatus): number => {
  switch (status) {
    case ProposalBookingStatus.DRAFT:
      return 0;
    case ProposalBookingStatus.BOOKED:
      return 3;
    case ProposalBookingStatus.CLOSED:
      return 4;

    default:
      return -1;
  }
};

type ProposalBookingDialogProps = {
  activeProposalBookingId: string;
  isDialogOpen: boolean;
  closeDialog: (shouldRefresh?: boolean) => void;
};

export default function ProposalBookingDialog({
  activeProposalBookingId,
  isDialogOpen,
  closeDialog,
}: ProposalBookingDialogProps) {
  const classes = useStyles();

  const { showConfirmation } = useContext(AppContext);
  const [activeStep, setActiveStep] = useState(-1);
  const [isDirty, setIsDirty] = useState(false);

  const { loading, proposalBooking } = useProposalBooking(
    activeProposalBookingId
  );

  useEffect(() => {
    if (!loading && proposalBooking) {
      setActiveStep(getActiveStepByStatus(proposalBooking.status));
    }
  }, [loading, proposalBooking]);

  const handleResetSteps = () => {
    setActiveStep(0);
    setIsDirty(false);
  };

  const handleNext = () => {
    setActiveStep(prevStep => Math.min(prevStep + 1, maxSteps));
    setIsDirty(false);
  };

  const handleBack = () => {
    setActiveStep(prevStep => Math.max(prevStep - 1, 0));
    setIsDirty(false);
  };

  const handleCloseDialog = () => {
    isDirty
      ? showConfirmation({
          message: (
            <>
              You have <strong>unsaved work</strong>, are you sure you want to
              continue?
            </>
          ),
          cb: () => closeDialog(true),
        })
      : closeDialog(true);
  };

  const handleSetDirty = (isDirty: boolean) => {
    setIsDirty(isDirty);
  };

  if (loading) {
    return (
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          className: classes.fullHeight,
        }}
      >
        <Loader />
      </Dialog>
    );
  }

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleCloseDialog}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        className: classes.fullHeight,
      }}
    >
      <DialogTitle>Proposal booking</DialogTitle>
      <Stepper activeStep={activeStep}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {proposalBooking &&
        (activeStep === steps.length ? (
          <ClosedStep proposalBooking={proposalBooking} />
        ) : (
          getActiveStep({
            activeStep,
            proposalBooking,
            isDirty,
            handleNext,
            handleBack,
            handleSetDirty,
            handleResetSteps,
          })
        ))}
      <DialogActions>
        <Button color="primary" onClick={handleCloseDialog}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
