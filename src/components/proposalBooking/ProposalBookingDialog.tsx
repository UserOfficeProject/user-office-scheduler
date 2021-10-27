import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';

import Loader from 'components/common/Loader';
import { AppContext } from 'context/AppContext';
import { useCheckAccess } from 'context/UserContext';
import {
  ProposalBookingFinalizeAction,
  ProposalBookingStatusCore,
  UserRole,
} from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import useProposalBooking from 'hooks/proposalBooking/useProposalBooking';

import ProposalBookingLostTimeTable from './ProposalBookingLostTimeTable';
import ProposalDetailsAndBookingEvents from './ProposalDetailsAndBookingEvents';

const useStyles = makeStyles(() => ({
  fullHeight: {
    height: '100%',
  },
  stepper: {
    overflowX: 'auto',
    overflowY: 'hidden',
  },
}));

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
  const { enqueueSnackbar } = useSnackbar();
  const api = useDataApi();
  const isUserOfficer = useCheckAccess([UserRole.USER_OFFICER]);

  const { showConfirmation } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [openedEventId, setOpenedEventId] = useState<number | null>(null);

  const { loading, proposalBooking, setProposalBooking } = useProposalBooking(
    activeProposalBookingId
  );

  const handleCloseDialog = () => {
    closeDialog(true);
  };

  if (loading || !proposalBooking) {
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

  const isStepReadOnly = proposalBooking.scheduledEvents.every(
    (scheduledEvent) =>
      scheduledEvent.status === ProposalBookingStatusCore.COMPLETED
  );

  const completeBooking = () => {
    showConfirmation({
      message: (
        <>
          Are you sure you want to <strong>complete</strong> the selected
          booking with all the events?
        </>
      ),
      cb: async () => {
        try {
          setIsLoading(true);

          const {
            finalizeProposalBooking: { error },
          } = await api().finalizeProposalBooking({
            action: ProposalBookingFinalizeAction.COMPLETE,
            id: proposalBooking.id,
          });

          if (error) {
            enqueueSnackbar(getTranslation(error as ResourceId), {
              variant: 'error',
            });

            setIsLoading(false);
          } else {
            enqueueSnackbar('Proposal booking completed', {
              variant: 'success',
            });
            setIsLoading(false);

            const newScheduledEvents = proposalBooking.scheduledEvents.map(
              (event) => ({
                ...event,
                status: ProposalBookingStatusCore.COMPLETED,
              })
            );

            setProposalBooking({
              ...proposalBooking,
              scheduledEvents: newScheduledEvents,
              status: ProposalBookingStatusCore.COMPLETED,
            });
          }
        } catch (e) {
          // TODO

          setIsLoading(false);
          console.error(e);
        }
      },
    });
  };

  const reopenBooking = () => {
    showConfirmation({
      message: (
        <>
          Are you sure you want to <strong>re-open</strong> the selected booking
          with all the events?
        </>
      ),
      cb: async () => {
        try {
          setIsLoading(true);

          const {
            reopenProposalBooking: { error },
          } = await api().reopenProposalBooking({
            id: proposalBooking.id,
          });

          if (error) {
            enqueueSnackbar(getTranslation(error as ResourceId), {
              variant: 'error',
            });

            setIsLoading(false);
          } else {
            enqueueSnackbar('Proposal booking re-opened', {
              variant: 'success',
            });
            setIsLoading(false);

            const newScheduledEvents = proposalBooking.scheduledEvents.map(
              (event) => ({
                ...event,
                status: ProposalBookingStatusCore.ACTIVE,
              })
            );

            setProposalBooking({
              ...proposalBooking,
              scheduledEvents: newScheduledEvents,
              status: ProposalBookingStatusCore.ACTIVE,
            });
          }
        } catch (e) {
          // TODO

          setIsLoading(false);
          console.error(e);
        }
      },
    });
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleCloseDialog}
      fullWidth
      maxWidth="lg"
      data-cy="proposal-booking-dialog"
      PaperProps={{
        className: classes.fullHeight,
      }}
    >
      <DialogTitle>Proposal booking</DialogTitle>
      <DialogContent>
        {isLoading && <Loader />}
        <ProposalDetailsAndBookingEvents
          proposalBooking={proposalBooking}
          setProposalBooking={setProposalBooking}
          openedEventId={openedEventId}
          setOpenedEventId={setOpenedEventId}
        />
        {isStepReadOnly && (
          <ProposalBookingLostTimeTable
            proposalBooking={proposalBooking}
            handleOnViewEvent={setOpenedEventId}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={handleCloseDialog}
          data-cy="btn-close-dialog"
        >
          Close
        </Button>
        {!isStepReadOnly && (
          <Button
            variant="contained"
            color="primary"
            onClick={completeBooking}
            data-cy="btn-complete-booking"
          >
            Complete proposal booking
          </Button>
        )}
        {isStepReadOnly && isUserOfficer && (
          <Button
            variant="contained"
            color="primary"
            onClick={reopenBooking}
            data-cy="btn-reopen-booking"
          >
            Reopen proposal booking
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
