import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import { Save as SaveIcon } from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { Dispatch, useContext, useState } from 'react';

import Loader from 'components/common/Loader';
import SplitButton from 'components/common/SplitButton';
import { AppContext } from 'context/AppContext';
import {
  EquipmentAssignmentStatus,
  ProposalBookingFinalizeAction,
  ProposalBookingStatusCore,
} from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import useProposalBookingLostTimes, {
  ProposalBookingLostTime,
} from 'hooks/lostTime/useProposalBookingLostTimes';
import useScheduledEventWithEquipment, {
  ScheduledEventWithEquipments,
} from 'hooks/scheduledEvent/useScheduledEventWithEquipment';
import { toTzLessDateTime } from 'utils/date';
import { hasOverlappingEvents } from 'utils/scheduledEvent';

import TimeSlotDetails from './TimeSlotDetails';
import TimeSlotEquipmentBookingTable from './TimeSlotEquipmentBookingTable';
import TimeSlotLostTimeTable from './TimeSlotLostTimeTable';

const useStyles = makeStyles((theme) => ({
  fullHeight: {
    height: '100%',
  },
  spacingTop: {
    marginTop: theme.spacing(2),
  },
}));

export type TimeSlotBookingDialogStepProps = {
  scheduledEvent: ScheduledEventWithEquipments;
  setScheduledEvent: Dispatch<
    React.SetStateAction<ScheduledEventWithEquipments | null>
  >;
  isDirty: boolean;
  handleSetDirty: (isDirty: boolean) => void;
};

type TimeSlotBookingDialogProps = {
  activeProposalBookingId: number;
  activeTimeSlotScheduledEventId?: number;
  isDialogOpen: boolean;
  closeDialog: (scheduledEvent: ScheduledEventWithEquipments | null) => void;
  isOpenedOverProposalBookingDialog?: boolean;
};

export default function TimeSlotBookingDialog({
  activeProposalBookingId,
  activeTimeSlotScheduledEventId,
  isDialogOpen,
  closeDialog,
  isOpenedOverProposalBookingDialog = false,
}: TimeSlotBookingDialogProps) {
  const classes = useStyles();
  const api = useDataApi();
  const { enqueueSnackbar } = useSnackbar();

  const { showConfirmation, showAlert } = useContext(AppContext);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { loading, scheduledEvent, setScheduledEvent } =
    useScheduledEventWithEquipment({
      proposalBookingId: activeProposalBookingId,
      scheduledEventId: activeTimeSlotScheduledEventId,
    });

  // TODO: Query lost times by scheduled event id as well.
  const {
    loading: loadingLostTimes,
    lostTimes,
    setLostTimes,
  } = useProposalBookingLostTimes(
    scheduledEvent?.proposalBooking?.id,
    scheduledEvent?.id
  );

  const allAccepted = scheduledEvent
    ? scheduledEvent.equipments.every(
        (equipment) => equipment.status === EquipmentAssignmentStatus.ACCEPTED
      )
    : true;

  const [allEquipmentsAccepted, setAllEquipmentsAccepted] =
    useState(allAccepted);

  const handleCloseDialog = () => {
    isDirty
      ? showConfirmation({
          message: (
            <>
              You have <strong>unsaved work</strong>, are you sure you want to
              continue?
            </>
          ),
          cb: () => closeDialog(null),
        })
      : closeDialog(scheduledEvent);
  };

  if (loading || !scheduledEvent) {
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

  const canUpdateDetailsAndEquipments =
    scheduledEvent.status === ProposalBookingStatusCore.DRAFT;
  const canUpdateAddLostTimes =
    scheduledEvent.status === ProposalBookingStatusCore.ACTIVE;
  const isReadOnly =
    scheduledEvent.status === ProposalBookingStatusCore.COMPLETED;

  const handleFinalizeSubmit = async (
    selectedKey: ProposalBookingFinalizeAction
  ) => {
    showConfirmation({
      message: (
        <>
          Are you sure you want to{' '}
          <strong>
            {selectedKey === ProposalBookingFinalizeAction.COMPLETE
              ? 'complete'
              : 'restart'}
          </strong>{' '}
          the selected booking?
          {selectedKey === ProposalBookingFinalizeAction.COMPLETE && (
            <Alert severity="warning" className={classes.spacingTop}>
              <AlertTitle>Warning</AlertTitle>
              Completing proposal booking disallows any further edit
            </Alert>
          )}
        </>
      ),
      cb: async () => {
        try {
          setIsLoading(true);

          const {
            finalizeScheduledEvent: { error },
          } = await api().finalizeScheduledEvent({
            input: {
              action: selectedKey,
              id: scheduledEvent.id,
            },
          });

          if (error) {
            enqueueSnackbar(getTranslation(error as ResourceId), {
              variant: 'error',
            });
          } else {
            if (selectedKey === ProposalBookingFinalizeAction.COMPLETE) {
              setScheduledEvent({
                ...scheduledEvent,
                status: ProposalBookingStatusCore.COMPLETED,
              });
              enqueueSnackbar('Scheduled event completed', {
                variant: 'success',
              });
            } else {
              setScheduledEvent({
                ...scheduledEvent,
                status: ProposalBookingStatusCore.DRAFT,
              });
              enqueueSnackbar('Scheduled event restarted', {
                variant: 'success',
              });
            }
          }
        } catch (e) {
          // TODO
          console.error(e);
        }

        setIsLoading(false);
      },
    });
  };

  const getProposalLostTimesForOverlapCheck = (
    lostTimesToCheck: ProposalBookingLostTime[]
  ) =>
    lostTimesToCheck.map((lostTime) => {
      return {
        id: lostTime.id,
        startsAt: moment(lostTime.startsAt),
        endsAt: moment(lostTime.endsAt),
      };
    }) || [];

  const handleFinalize = (selectedKey: ProposalBookingFinalizeAction) => {
    hasOverlappingEvents(getProposalLostTimesForOverlapCheck(lostTimes)) &&
    selectedKey === ProposalBookingFinalizeAction.COMPLETE
      ? showConfirmation({
          message: (
            <>
              You have <strong>overlapping events</strong>, are you sure you
              want to continue?
            </>
          ),
          cb: () => handleFinalizeSubmit(selectedKey),
        })
      : handleFinalizeSubmit(selectedKey);
  };

  const getProposalBookingEventsForOverlapCheck = () =>
    scheduledEvent.proposalBooking?.scheduledEvents.map((event) => {
      if (
        event.id === scheduledEvent.id &&
        scheduledEvent.startsAt &&
        scheduledEvent.endsAt
      ) {
        return {
          id: event.id,
          startsAt: moment(scheduledEvent.startsAt),
          endsAt: moment(scheduledEvent.endsAt),
        };
      } else {
        return {
          id: event.id,
          startsAt: moment(event.startsAt),
          endsAt: moment(event.endsAt),
        };
      }
    }) || [];

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!scheduledEvent.startsAt || !scheduledEvent.endsAt) {
        return;
      }

      if (scheduledEvent.startsAt >= scheduledEvent.endsAt) {
        // when the starting date is after ending date
        // it may be less obvious for the user, show alert
        showAlert({
          message: 'The starting date needs to be before the ending date',
        });

        return;
      }

      const {
        updateScheduledEvent: { error, scheduledEvent: updatedScheduledEvent },
      } = await api().updateScheduledEvent({
        input: {
          scheduledEventId: scheduledEvent.id,
          startsAt: toTzLessDateTime(scheduledEvent.startsAt),
          endsAt: toTzLessDateTime(scheduledEvent.endsAt),
        },
      });

      if (error) {
        enqueueSnackbar(getTranslation(error as ResourceId), {
          variant: 'error',
        });
      } else {
        updatedScheduledEvent &&
          setScheduledEvent({
            ...scheduledEvent,
            startsAt: updatedScheduledEvent.startsAt,
            endsAt: updatedScheduledEvent.endsAt,
          });

        enqueueSnackbar('Scheduled event updated', {
          variant: 'success',
        });
      }
      setIsDirty(false);
    } catch (e) {
      // TODO
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    hasOverlappingEvents(getProposalBookingEventsForOverlapCheck())
      ? showConfirmation({
          message: (
            <>
              You have <strong>overlapping bookings</strong>, are you sure you
              want to continue?
            </>
          ),
          cb: handleSubmit,
        })
      : handleSubmit();
  };

  const handleActivateSubmit = async () => {
    showConfirmation({
      message: (
        <>
          Are you sure you want to <strong>activate</strong> booking?
        </>
      ),
      cb: async () => {
        try {
          setIsLoading(true);

          const {
            activateScheduledEvent: { error },
          } = await api().activateScheduledEvent({
            input: { id: scheduledEvent.id },
          });

          if (error) {
            enqueueSnackbar(getTranslation(error as ResourceId), {
              variant: 'error',
            });
          } else {
            setScheduledEvent({
              ...scheduledEvent,
              status: ProposalBookingStatusCore.ACTIVE,
            });
            enqueueSnackbar('Scheduled event activated!', {
              variant: 'success',
            });
          }
        } catch (e) {
          // TODO
          console.error(e);
        }

        setIsDirty(false);
        setIsLoading(false);
      },
    });
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleCloseDialog}
      fullWidth
      hideBackdrop={isOpenedOverProposalBookingDialog}
      maxWidth="lg"
      data-cy="time-slot-booking-dialog"
      PaperProps={{
        className: classes.fullHeight,
      }}
    >
      <DialogTitle>Time slot booking</DialogTitle>
      <DialogContent>
        {scheduledEvent && (
          <>
            {isLoading && <Loader />}
            <TimeSlotDetails
              isDirty={isDirty}
              handleSetDirty={setIsDirty}
              scheduledEvent={scheduledEvent}
              setScheduledEvent={setScheduledEvent}
            />
            <TimeSlotEquipmentBookingTable
              allEquipmentsAccepted={allEquipmentsAccepted}
              setAllEquipmentsAccepted={setAllEquipmentsAccepted}
              scheduledEvent={scheduledEvent}
            />
            {scheduledEvent.status !== ProposalBookingStatusCore.DRAFT && (
              <TimeSlotLostTimeTable
                handleSetDirty={setIsDirty}
                scheduledEvent={scheduledEvent}
                lostTimes={lostTimes}
                setLostTimes={setLostTimes}
                loading={loadingLostTimes}
              />
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={handleCloseDialog}
          data-cy="btn-close-event-dialog"
        >
          Close
        </Button>
        {canUpdateDetailsAndEquipments && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveDraft}
            data-cy="btn-save"
            disabled={isReadOnly || !isDirty}
          >
            Save
          </Button>
        )}
        {canUpdateDetailsAndEquipments && (
          <Button
            variant="contained"
            color="primary"
            data-cy="activate-time-slot-booking"
            disabled={isReadOnly || !allEquipmentsAccepted || isDirty}
            onClick={handleActivateSubmit}
          >
            Activate booking
          </Button>
        )}

        {canUpdateAddLostTimes && (
          <SplitButton
            label="proposal-booking-finalization-strategy"
            options={[
              {
                key: ProposalBookingFinalizeAction.COMPLETE,
                label: 'Complete the time slot booking',
              },
              {
                key: ProposalBookingFinalizeAction.RESTART,
                label: 'Restart the time slot booking',
              },
            ]}
            onClick={handleFinalize}
            disabled={isReadOnly || isDirty}
            dropdownDisabled={isReadOnly || isDirty}
          />
        )}
      </DialogActions>
    </Dialog>
  );
}
