import {
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  Step,
  Stepper,
  StepButton,
} from '@material-ui/core';
import React, {
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import Loader from 'components/common/Loader';
import { AppContext } from 'context/AppContext';
import { ProposalBookingStatusCore } from 'generated/sdk';
import useScheduledEventWithEquipment, {
  ScheduledEventWithEquipments,
} from 'hooks/scheduledEvent/useScheduledEventWithEquipment';

import TimeSlotCompletedStep from './timeSlotBookingSteps/TimeSlotCompletedStep';
import TimeSlotDetailsStep from './timeSlotBookingSteps/TimeSlotDetailsStep';
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
  COMPLETED,
}

const ProposalBookingStepNameMap: Record<
  keyof typeof ProposalBookingSteps,
  string
> = {
  BOOK_EVENTS: 'Scheduled event details',
  BOOK_EQUIPMENT: 'Equipment booking',
  FINALIZE: 'Finalize',
  COMPLETED: 'Completed',
};

const steps = [
  ProposalBookingStepNameMap.BOOK_EVENTS,
  ProposalBookingStepNameMap.BOOK_EQUIPMENT,
  ProposalBookingStepNameMap.FINALIZE,
  ProposalBookingStepNameMap.COMPLETED,
];
const maxSteps = steps.length;

export type TimeSlotBookingDialogStepProps = {
  activeStep: number;
  activeStatus: ProposalBookingStatusCore | null;
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
  handleSetActiveStepByStatus: (status: ProposalBookingStatusCore) => void;
};

function getActiveStep(props: TimeSlotBookingDialogStepProps) {
  switch (props.activeStep) {
    case ProposalBookingSteps.BOOK_EVENTS:
      return <TimeSlotDetailsStep {...props} />;
    case ProposalBookingSteps.BOOK_EQUIPMENT:
      return <TimeSlotEquipmentBookingStep {...props} />;
    case ProposalBookingSteps.FINALIZE:
      return <TimeSlotFinalizeStep {...props} />;

    case ProposalBookingSteps.COMPLETED:
      return <TimeSlotCompletedStep {...props} />;

    default:
      return <DialogContent>Unknown step</DialogContent>;
  }
}

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
    useState<ProposalBookingStatusCore | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { loading, scheduledEvent, setScheduledEvent } =
    useScheduledEventWithEquipment({
      proposalBookingId: activeProposalBookingId,
      scheduledEventId: activeTimeSlotScheduledEventId,
    });

  const getActiveStepByStatus = useCallback(
    (status: ProposalBookingStatusCore | null): number => {
      switch (status) {
        case ProposalBookingStatusCore.DRAFT:
          if (scheduledEvent?.equipments?.length) {
            return ProposalBookingSteps.BOOK_EQUIPMENT;
          }

          return ProposalBookingSteps.BOOK_EVENTS;
        case ProposalBookingStatusCore.ACTIVE:
          return ProposalBookingSteps.FINALIZE;
        case ProposalBookingStatusCore.COMPLETED:
          return ProposalBookingSteps.COMPLETED;

        default:
          return -1;
      }
    },
    [scheduledEvent?.equipments?.length]
  );

  useEffect(() => {
    if (!loading && scheduledEvent) {
      setActiveStep(getActiveStepByStatus(scheduledEvent.status));
      setActiveStatus(scheduledEvent.status);
    }
  }, [loading, scheduledEvent, getActiveStepByStatus]);

  const handleResetSteps = () => {
    setActiveStep(ProposalBookingSteps.BOOK_EVENTS);
    setIsDirty(false);
  };

  const handleNext = () => {
    setActiveStep(Math.min(activeStep + 1, maxSteps));
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

  const handleSetActiveStepByStatus = (status: ProposalBookingStatusCore) => {
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
