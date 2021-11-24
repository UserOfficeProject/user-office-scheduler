import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
import { Button, makeStyles } from '@material-ui/core';
import { Save as SaveIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { Dispatch, SetStateAction, useContext, useState } from 'react';

import { ActionButtonContainer } from 'components/common/ActionButtonContainer';
import Loader from 'components/common/Loader';
import SplitButton from 'components/common/SplitButton';
import { AppContext } from 'context/AppContext';
import { useCheckAccess } from 'context/UserContext';
import {
  EquipmentAssignmentStatus,
  ProposalBookingFinalizeAction,
  ProposalBookingStatusCore,
  ScheduledEvent,
  UserRole,
} from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import useProposalBookingLostTimes, {
  ProposalBookingLostTime,
} from 'hooks/lostTime/useProposalBookingLostTimes';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';
import useScheduledEventEquipments from 'hooks/scheduledEvent/useScheduledEventEquipments';
import { ScheduledEventWithEquipments } from 'hooks/scheduledEvent/useScheduledEventWithEquipment';
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

type TimeSlotBookingProps = {
  proposalBooking: InstrumentProposalBooking;
  setProposalBooking: Dispatch<
    SetStateAction<InstrumentProposalBooking | null>
  >;
  activeScheduledEvent: ScheduledEvent;
  onDelete: (scheduledEvent: ScheduledEventWithEquipments) => Promise<void>;
};

export default function TimeSlotBooking({
  proposalBooking,
  setProposalBooking,
  activeScheduledEvent,
  onDelete,
}: TimeSlotBookingProps) {
  const classes = useStyles();
  const api = useDataApi();
  const { enqueueSnackbar } = useSnackbar();

  const { showConfirmation, showAlert } = useContext(AppContext);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isUserOfficer = useCheckAccess([UserRole.USER_OFFICER]);

  const { equipments, loading: loadingEquipments } =
    useScheduledEventEquipments({
      proposalBookingId: proposalBooking.id,
      scheduledEventId: proposalBooking.id,
    });

  const shouldShowLostTimes =
    activeScheduledEvent.status !== ProposalBookingStatusCore.DRAFT;

  // TODO: Query lost times by scheduled event id as well.
  const {
    loading: loadingLostTimes,
    lostTimes,
    setLostTimes,
  } = useProposalBookingLostTimes(
    proposalBooking.id,
    activeScheduledEvent.id,
    shouldShowLostTimes
  );

  const allAccepted = equipments.every(
    (equipment) => equipment.status === EquipmentAssignmentStatus.ACCEPTED
  );

  const [allEquipmentsAccepted, setAllEquipmentsAccepted] =
    useState(allAccepted);

  const canUpdateDetailsAndEquipments =
    activeScheduledEvent.status === ProposalBookingStatusCore.DRAFT;
  const canUpdateAddLostTimes =
    activeScheduledEvent.status === ProposalBookingStatusCore.ACTIVE;
  const isReadOnly =
    activeScheduledEvent.status === ProposalBookingStatusCore.COMPLETED;

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
        setIsLoading(true);
        try {
          const {
            finalizeScheduledEvent: { error },
          } = await api().finalizeScheduledEvent({
            input: {
              action: selectedKey,
              id: activeScheduledEvent.id,
            },
          });

          if (error) {
            enqueueSnackbar(getTranslation(error as ResourceId), {
              variant: 'error',
            });
          } else {
            let newStatus = ProposalBookingStatusCore.DRAFT;
            if (selectedKey === ProposalBookingFinalizeAction.COMPLETE) {
              newStatus = ProposalBookingStatusCore.COMPLETED;
              enqueueSnackbar('Scheduled event completed', {
                variant: 'success',
              });
            } else {
              enqueueSnackbar('Scheduled event restarted', {
                variant: 'success',
              });
            }

            const newScheduledEvents = proposalBooking.scheduledEvents.map(
              (event) => ({
                ...event,
                status:
                  event.id === activeScheduledEvent.id
                    ? newStatus
                    : event.status,
              })
            );

            setProposalBooking({
              ...proposalBooking,
              scheduledEvents: newScheduledEvents,
            });
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
    proposalBooking.scheduledEvents.map((event) => {
      if (
        event.id === activeScheduledEvent.id &&
        activeScheduledEvent.startsAt &&
        activeScheduledEvent.endsAt
      ) {
        return {
          id: event.id,
          startsAt: moment(activeScheduledEvent.startsAt),
          endsAt: moment(activeScheduledEvent.endsAt),
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
    setIsLoading(true);
    try {
      if (!activeScheduledEvent.startsAt || !activeScheduledEvent.endsAt) {
        return;
      }

      if (activeScheduledEvent.startsAt >= activeScheduledEvent.endsAt) {
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
          scheduledEventId: activeScheduledEvent.id,
          startsAt: toTzLessDateTime(activeScheduledEvent.startsAt),
          endsAt: toTzLessDateTime(activeScheduledEvent.endsAt),
        },
      });

      if (error) {
        enqueueSnackbar(getTranslation(error as ResourceId), {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Scheduled event updated', {
          variant: 'success',
        });

        const newScheduledEvents = proposalBooking.scheduledEvents.map(
          (event) => ({
            ...event,
            startsAt:
              event.id === updatedScheduledEvent?.id
                ? updatedScheduledEvent.startsAt
                : event.startsAt,
            endsAt:
              event.id === updatedScheduledEvent?.id
                ? updatedScheduledEvent.endsAt
                : event.endsAt,
          })
        );

        setProposalBooking({
          ...proposalBooking,
          scheduledEvents: newScheduledEvents,
        });
      }
      setIsDirty(false);
    } catch (e) {
      // TODO
      console.error(e);
    }
    setIsLoading(false);
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
        setIsLoading(true);
        try {
          const {
            activateScheduledEvent: { error },
          } = await api().activateScheduledEvent({
            input: { id: activeScheduledEvent.id },
          });

          if (error) {
            enqueueSnackbar(getTranslation(error as ResourceId), {
              variant: 'error',
            });
          } else {
            enqueueSnackbar('Scheduled event activated!', {
              variant: 'success',
            });

            const newScheduledEvents = proposalBooking.scheduledEvents.map(
              (event) => ({
                ...event,
                status:
                  event.id === activeScheduledEvent.id
                    ? ProposalBookingStatusCore.ACTIVE
                    : event.status,
              })
            );

            setProposalBooking({
              ...proposalBooking,
              scheduledEvents: newScheduledEvents,
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

  const handleDelete = async () => {
    showConfirmation({
      message: (
        <>
          Are you sure you want to <strong>delete</strong> scheduled event?
        </>
      ),
      cb: async () => {
        setIsLoading(true);
        await onDelete(activeScheduledEvent);
        setIsLoading(false);
      },
    });
  };

  const reopenTimeSlotBooking = () => {
    showConfirmation({
      message: (
        <>
          Are you sure you want to <strong>re-open</strong> the selected time
          slot?
        </>
      ),
      cb: async () => {
        setIsLoading(true);
        try {
          const {
            reopenScheduledEvent: { error },
          } = await api().reopenScheduledEvent({
            id: activeScheduledEvent.id,
          });

          if (error) {
            enqueueSnackbar(getTranslation(error as ResourceId), {
              variant: 'error',
            });
          } else {
            enqueueSnackbar('Scheduled event re-opened', {
              variant: 'success',
            });

            const newScheduledEvents = proposalBooking.scheduledEvents.map(
              (event) => ({
                ...event,
                status:
                  event.id === activeScheduledEvent.id
                    ? ProposalBookingStatusCore.ACTIVE
                    : event.status,
              })
            );

            setProposalBooking({
              ...proposalBooking,
              scheduledEvents: newScheduledEvents,
            });
          }
        } catch (e) {
          // TODO
          console.error(e);
        }

        setIsLoading(false);
      },
    });
  };

  const onEventDateChangeSave = (updatedEvent: ScheduledEvent) => {
    const newScheduledEvents = proposalBooking.scheduledEvents.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );

    setProposalBooking({
      ...proposalBooking,
      scheduledEvents: newScheduledEvents,
    });
  };

  return (
    <>
      {isLoading && <Loader />}
      <TimeSlotDetails
        isDirty={isDirty}
        handleSetDirty={setIsDirty}
        scheduledEvent={activeScheduledEvent}
        proposalBooking={proposalBooking}
        onSave={onEventDateChangeSave}
      />
      <TimeSlotEquipmentBookingTable
        allEquipmentsAccepted={allEquipmentsAccepted}
        loadingEquipments={loadingEquipments}
        setAllEquipmentsAccepted={setAllEquipmentsAccepted}
        scheduledEvent={activeScheduledEvent}
        proposalBookingId={proposalBooking.id}
        scheduledEventEquipments={equipments}
      />
      {shouldShowLostTimes && (
        <TimeSlotLostTimeTable
          handleSetDirty={setIsDirty}
          proposalBookingId={proposalBooking.id}
          scheduledEvent={activeScheduledEvent}
          lostTimes={lostTimes}
          setLostTimes={setLostTimes}
          loading={loadingLostTimes}
        />
      )}

      <ActionButtonContainer>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          data-cy="btn-save"
        >
          Delete
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
        {isReadOnly && isUserOfficer && (
          <Button
            variant="contained"
            color="primary"
            onClick={reopenTimeSlotBooking}
            data-cy="btn-reopen-time-slot-booking"
          >
            Reopen time slot booking
          </Button>
        )}
      </ActionButtonContainer>
    </>
  );
}
