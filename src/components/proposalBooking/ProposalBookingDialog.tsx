import {
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  Step,
  Stepper,
  StepButton,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';

import Loader from 'components/common/Loader';
import { AppContext } from 'context/AppContext';
import { ProposalBookingStatus } from 'generated/sdk';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';
import useProposalBooking from 'hooks/proposalBooking/useProposalBooking';

import BookingEventStep from './bookingSteps/BookingEventStep';
import ClosedStep from './bookingSteps/ClosedStep';
import EquipmentBookingStep from './bookingSteps/EquipmentBookingStep';
import FinalizeStep from './bookingSteps/FinalizeStep';
// import RequestReviewStep from './bookingSteps/RequestReviewStep';
// import ReviewFeedbackStep from './bookingSteps/ReviewFeedbackStep';

const useStyles = makeStyles(() => ({
  fullHeight: {
    height: '100%',
  },
}));

export enum ProposalBookingSteps {
  BOOK_EVENTS = 0,
  BOOK_EQUIPMENT,
  // REQUEST_REVIEW,
  // REVIEW_FEEDBACKS,
  FINALIZE,

  CLOSED,
}

const ProposalBookingStepNameMap: Record<
  keyof typeof ProposalBookingSteps,
  string
> = {
  BOOK_EVENTS: 'Book events',
  BOOK_EQUIPMENT: 'Equipment booking',
  // REQUEST_REVIEW: 'Request review',
  // REVIEW_FEEDBACKS: 'Review feedbacks',
  FINALIZE: 'Finalize',
  CLOSED: 'Closed',
};

const steps = [
  ProposalBookingStepNameMap.BOOK_EVENTS,
  ProposalBookingStepNameMap.BOOK_EQUIPMENT,
  ProposalBookingStepNameMap.FINALIZE,
  ProposalBookingStepNameMap.CLOSED,
];
const maxSteps = steps.length;

export type ProposalBookingDialogStepProps = {
  activeStep: number;
  activeStatus: ProposalBookingStatus | null;
  proposalBooking: InstrumentProposalBooking;
  isDirty: boolean;
  handleNext: () => void;
  handleBack: () => void;
  handleResetSteps: () => void;
  handleSetDirty: (isDirty: boolean) => void;
  handleCloseDialog: () => void;
  handleSetActiveStepByStatus: (status: ProposalBookingStatus) => void;
};

function getActiveStep(props: ProposalBookingDialogStepProps) {
  switch (props.activeStep) {
    case ProposalBookingSteps.BOOK_EVENTS:
      return <BookingEventStep {...props} />;
    case ProposalBookingSteps.BOOK_EQUIPMENT:
      return <EquipmentBookingStep {...props} />;
    // case ProposalBookingSteps.REQUEST_REVIEW:
    //   return (
    //     <RequestReviewStep
    //       {...props}
    //     />
    //   );
    // case ProposalBookingSteps.REVIEW_FEEDBACKS:
    //   return (
    //     <ReviewFeedbackStep
    //       {...props}
    //     />
    //   );
    case ProposalBookingSteps.FINALIZE:
      return <FinalizeStep {...props} />;

    case ProposalBookingSteps.CLOSED:
      return <ClosedStep {...props} />;

    default:
      return <DialogContent>Unknown step</DialogContent>;
  }
}

const getActiveStepByStatus = (
  status: ProposalBookingStatus | null
): number => {
  switch (status) {
    case ProposalBookingStatus.DRAFT:
      return ProposalBookingSteps.BOOK_EVENTS;
    case ProposalBookingStatus.BOOKED:
      return ProposalBookingSteps.FINALIZE;
    case ProposalBookingStatus.CLOSED:
      return ProposalBookingSteps.CLOSED;

    default:
      return -1;
  }
};

type ProposalBookingDialogProps = {
  activeProposalBookingId: number;
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
  const [activeStatus, setActiveStatus] =
    useState<ProposalBookingStatus | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { loading, proposalBooking } = useProposalBooking(
    activeProposalBookingId
  );

  useEffect(() => {
    if (!loading && proposalBooking) {
      setActiveStep(getActiveStepByStatus(proposalBooking.status));
      setActiveStatus(proposalBooking.status);
    }
  }, [loading, proposalBooking]);

  const handleResetSteps = () => {
    setActiveStep(ProposalBookingSteps.BOOK_EVENTS);
    setIsDirty(false);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, maxSteps));
    setIsDirty(false);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
    setIsDirty(false);
  };

  const handleSetStep = (step: number) => () => {
    setActiveStep(step);
    setIsDirty(false);
  };

  const handleSetActiveStepByStatus = (status: ProposalBookingStatus) => {
    setActiveStatus(status);
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
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton
              data-cy={`booking-step-${ProposalBookingSteps[index]}`}
              onClick={handleSetStep(index)}
              completed={
                index <=
                Math.max(getActiveStepByStatus(activeStatus), activeStep)
              }
              disabled={index > getActiveStepByStatus(activeStatus)}
            >
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      {proposalBooking &&
        getActiveStep({
          activeStep,
          activeStatus,
          proposalBooking,
          isDirty,
          handleNext,
          handleBack,
          handleSetDirty,
          handleResetSteps,
          handleSetActiveStepByStatus,
          handleCloseDialog,
        })}
    </Dialog>
  );
}
