import { Delete as DeleteIcon } from '@mui/icons-material';
import { Alert, AlertTitle, Button } from '@mui/material';
import {
  getTranslation,
  ResourceId,
} from '@user-office-software/duo-localisation';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { stringOrDate } from 'react-big-calendar';
import { makeStyles } from 'tss-react/mui';

import { ActionButtonContainer } from 'components/common/ActionButtonContainer';
import Loader from 'components/common/Loader';
import SplitButton from 'components/common/SplitButton';
import { AppContext } from 'context/AppContext';
import { useCheckAccess } from 'context/UserContext';
import {
  EquipmentAssignmentStatus,
  ProposalBookingFinalizeAction,
  ProposalBookingStatusCore,
  UserRole,
} from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import useProposalBookingLostTimes, {
  ProposalBookingLostTime,
} from 'hooks/lostTime/useProposalBookingLostTimes';
import {
  DetailedProposalBooking,
  DetailedProposalBookingScheduledEvent,
} from 'hooks/proposalBooking/useProposalBooking';
import useScheduledEventEquipments from 'hooks/scheduledEvent/useScheduledEventEquipments';
import { toTzLessDateTime } from 'utils/date';
import { hasOverlappingEvents } from 'utils/scheduledEvent';

import TimeSlotDetails from './TimeSlotDetails';
import TimeSlotEquipmentBookingTable from './TimeSlotEquipmentBookingTable';
import TimeSlotLostTimeTable from './TimeSlotLostTimeTable';

const useStyles = makeStyles()((theme) => ({
  fullHeight: {
    height: '100%',
  },
  spacingTop: {
    marginTop: theme.spacing(2),
  },
}));

type TimeSlotBookingProps = {
  proposalBooking: DetailedProposalBooking;
  setProposalBooking: Dispatch<SetStateAction<DetailedProposalBooking>>;
  activeScheduledEvent: DetailedProposalBookingScheduledEvent;
  onDelete: (
    scheduledEvent: DetailedProposalBookingScheduledEvent
  ) => Promise<void>;
};

export const getProposalBookingEventsForOverlapCheck = (
  scheduledEvents: {
    id: number;
    startsAt: stringOrDate;
    endsAt: stringOrDate;
  }[],
  changedScheduledEvent?: {
    id: number;
    startsAt: stringOrDate;
    endsAt: stringOrDate;
  }
) =>
  scheduledEvents.map((event) => {
    if (
      event.id === changedScheduledEvent?.id &&
      changedScheduledEvent.startsAt &&
      changedScheduledEvent.endsAt
    ) {
      return {
        id: event.id,
        startsAt: moment(changedScheduledEvent.startsAt),
        endsAt: moment(changedScheduledEvent.endsAt),
      };
    } else {
      return {
        id: event.id,
        startsAt: moment(event.startsAt),
        endsAt: moment(event.endsAt),
      };
    }
  }) || [];

export default function TimeSlotBooking({
  proposalBooking,
  setProposalBooking,
  activeScheduledEvent,
  onDelete,
}: TimeSlotBookingProps) {
  const { classes } = useStyles();
  const api = useDataApi();
  const { enqueueSnackbar } = useSnackbar();

  const { showConfirmation, showAlert } = useContext(AppContext);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isUserOfficer = useCheckAccess([UserRole.USER_OFFICER]);

  const { equipments, loading: loadingEquipments } =
    useScheduledEventEquipments({
      proposalBookingId: proposalBooking.id,
      scheduledEventId: activeScheduledEvent.id,
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
          the selected experiment time?
          {selectedKey === ProposalBookingFinalizeAction.COMPLETE && (
            <Alert severity="warning" className={classes.spacingTop}>
              <AlertTitle>Warning</AlertTitle>
              Completing experiment time disallows any further edit
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
              enqueueSnackbar('Experiment time completed', {
                variant: 'success',
              });
            } else {
              enqueueSnackbar('Experiment time restarted', {
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
              You have <strong>overlapping experiment times</strong>, are you
              sure you want to continue?
            </>
          ),
          cb: () => handleFinalizeSubmit(selectedKey),
        })
      : handleFinalizeSubmit(selectedKey);
  };

  const handleSubmit = async (
    updatedEvent: DetailedProposalBookingScheduledEvent
  ) => {
    try {
      if (!updatedEvent.startsAt || !updatedEvent.endsAt) {
        return;
      }

      if (updatedEvent.startsAt >= updatedEvent.endsAt) {
        // when the starting date is after ending date
        // it may be less obvious for the user, show alert
        showAlert({
          message: 'The starting date needs to be before the ending date',
        });

        return;
      }

      setIsLoading(true);

      const {
        updateScheduledEvent: { error, scheduledEvent: updatedScheduledEvent },
      } = await api().updateScheduledEvent({
        input: {
          scheduledEventId: updatedEvent.id,
          startsAt: toTzLessDateTime(updatedEvent.startsAt),
          endsAt: toTzLessDateTime(updatedEvent.endsAt),
          localContact: updatedEvent.localContact?.id,
        },
      });

      if (error) {
        enqueueSnackbar(getTranslation(error as ResourceId), {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Experiment time updated', {
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
            localContact:
              event.id === updatedScheduledEvent?.id
                ? updatedScheduledEvent.localContact
                : event.localContact,
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

  const onEventDateChange = (
    updatedEvent: DetailedProposalBookingScheduledEvent
  ) => {
    hasOverlappingEvents(
      getProposalBookingEventsForOverlapCheck(
        proposalBooking.scheduledEvents,
        updatedEvent
      )
    )
      ? showConfirmation({
          message: (
            <>
              You have <strong>overlapping experiment times</strong>, are you
              sure you want to continue?
            </>
          ),
          cb: () => handleSubmit(updatedEvent),
        })
      : handleSubmit(updatedEvent);
  };

  const handleActivateSubmit = async () => {
    showConfirmation({
      message: (
        <>
          Are you sure you want to <strong>activate</strong> the selected
          experiment time?
        </>
      ),
      cb: async () => {
        setIsLoading(true);
        try {
          const {
            activateScheduledEvents: {
              error,
              scheduledEvents: [activatedScheduledEvent],
            },
          } = await api().activateScheduledEvents({
            input: { ids: [activeScheduledEvent.id] },
          });

          if (error) {
            enqueueSnackbar(getTranslation(error as ResourceId), {
              variant: 'error',
            });
          } else if ('reason' in activatedScheduledEvent) {
            enqueueSnackbar(
              getTranslation(activatedScheduledEvent.reason as ResourceId),
              {
                variant: 'error',
              }
            );
          } else {
            enqueueSnackbar('Experiment time activated!', {
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
          Are you sure you want to <strong>delete</strong> selected experiment
          time?
        </>
      ),
      cb: async () => {
        setIsLoading(true);
        try {
          await onDelete(activeScheduledEvent);
        } catch {
          setIsLoading(false);
        }
      },
    });
  };

  const reopenTimeSlotBooking = () => {
    showConfirmation({
      message: (
        <>
          Are you sure you want to <strong>re-open</strong> the selected
          experiment time?
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
            enqueueSnackbar('Experiment time re-opened', {
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

  return (
    <div data-cy="experiment-time-wrapper">
      {isLoading && <Loader />}
      <TimeSlotDetails
        isDirty={isDirty}
        handleSetDirty={setIsDirty}
        scheduledEvent={activeScheduledEvent}
        proposalBooking={proposalBooking}
        onEventDateChange={onEventDateChange}
        onEventLocalContactChange={handleSubmit}
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
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          data-cy="delete-experiment-time"
        >
          Delete
        </Button>
        {canUpdateDetailsAndEquipments && (
          <Button
            variant="contained"
            color="primary"
            data-cy="activate-experiment-time"
            disabled={isReadOnly || !allEquipmentsAccepted || isDirty}
            onClick={handleActivateSubmit}
          >
            Activate the experiment time
          </Button>
        )}

        {canUpdateAddLostTimes && (
          <SplitButton
            label="experiment-time-finalization-strategy"
            options={[
              {
                key: ProposalBookingFinalizeAction.COMPLETE,
                label: 'Complete the experiment time',
              },
              {
                key: ProposalBookingFinalizeAction.RESTART,
                label: 'Restart the experiment time',
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
            data-cy="btn-reopen-experiment-time"
          >
            Reopen the experiment time
          </Button>
        )}
      </ActionButtonContainer>
    </div>
  );
}
