import {
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  Step,
  Stepper,
  StepButton,
} from '@material-ui/core';
import React, { Dispatch, useContext, useEffect, useState } from 'react';

import Loader from 'components/common/Loader';
import { AppContext } from 'context/AppContext';
import { ProposalBookingStatus } from 'generated/sdk';
import useScheduledEventWithEquipment, {
  ScheduledEventWithEquipments,
} from 'hooks/scheduledEvent/useScheduledEventWithEquipment';

import TimeSlotBookingEventStep from './timeSlotBookingSteps/TimeSlotBookingEventStep';
import TimeSlotClosedStep from './timeSlotBookingSteps/TimeSlotClosedStep';
import TimeSlotEquipmentBookingStep from './timeSlotBookingSteps/TimeSlotEquipmentBookingStep';
import TimeSlotFinalizeStep from './timeSlotBookingSteps/TimeSlotFinalizeStep';

const useStyles = makeStyles(() => ({
  fullHeight: {
    height: '100%',
  },
}));

export enum ProposalBookingSteps {
  BOOK_EVENTS = 0,
  BOOK_EQUIPMENT,
  FINALIZE,

  CLOSED,
}

const ProposalBookingStepNameMap: Record<
  keyof typeof ProposalBookingSteps,
  string
> = {
  BOOK_EVENTS: 'Scheduled event details',
  BOOK_EQUIPMENT: 'Equipment booking',
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
  scheduledEvent: ScheduledEventWithEquipments;
  setScheduledEvent: Dispatch<
    React.SetStateAction<ScheduledEventWithEquipments | null>
  >;
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
      return <TimeSlotBookingEventStep {...props} />;
    case ProposalBookingSteps.BOOK_EQUIPMENT:
      return <TimeSlotEquipmentBookingStep {...props} />;
    case ProposalBookingSteps.FINALIZE:
      return <TimeSlotFinalizeStep {...props} />;

    case ProposalBookingSteps.CLOSED:
      return <TimeSlotClosedStep {...props} />;

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
  activeTimeSlotScheduledEventId?: number;
  isDialogOpen: boolean;
  closeDialog: (shouldRefresh?: boolean) => void;
  isOpenedOverProposalBookingDialog?: boolean;
};

export default function ProposalBookingDialog({
  activeProposalBookingId,
  activeTimeSlotScheduledEventId,
  isDialogOpen,
  closeDialog,
  isOpenedOverProposalBookingDialog = false,
}: ProposalBookingDialogProps) {
  const classes = useStyles();

  const { showConfirmation } = useContext(AppContext);
  const [activeStep, setActiveStep] = useState(-1);
  const [activeStatus, setActiveStatus] =
    useState<ProposalBookingStatus | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { loading, scheduledEvent, setScheduledEvent } =
    useScheduledEventWithEquipment({
      proposalBookingId: activeProposalBookingId,
      scheduledEventId: activeTimeSlotScheduledEventId,
    });

  useEffect(() => {
    if (!loading && scheduledEvent) {
      setActiveStep(getActiveStepByStatus(scheduledEvent.status));
      setActiveStatus(scheduledEvent.status);
    }
  }, [loading, scheduledEvent]);

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
      hideBackdrop={isOpenedOverProposalBookingDialog}
      maxWidth="lg"
      PaperProps={{
        className: classes.fullHeight,
      }}
    >
      <DialogTitle>
        Time slot booking - (
        {`${scheduledEvent?.startsAt} - ${scheduledEvent?.endsAt}`})
      </DialogTitle>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton
              data-cy={`time-slot-booking-step-${ProposalBookingSteps[index]}`}
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
      {scheduledEvent &&
        getActiveStep({
          activeStep,
          activeStatus,
          scheduledEvent,
          setScheduledEvent,
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
