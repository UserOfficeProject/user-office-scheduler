import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

import Loader from 'components/common/Loader';
import useProposalBooking from 'hooks/proposalBooking/useProposalBooking';

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
  scheduledEventId?: number;
  isDialogOpen: boolean;
  closeDialog: (shouldRefresh?: boolean) => void;
};

export default function ProposalBookingDialog({
  activeProposalBookingId,
  isDialogOpen,
  scheduledEventId,
  closeDialog,
}: ProposalBookingDialogProps) {
  const classes = useStyles();

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
      <DialogContent className="tinyScroll">
        <ProposalDetailsAndBookingEvents
          proposalBooking={proposalBooking}
          setProposalBooking={setProposalBooking}
          openedEventId={scheduledEventId}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={handleCloseDialog}
          data-cy="btn-close-dialog"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
