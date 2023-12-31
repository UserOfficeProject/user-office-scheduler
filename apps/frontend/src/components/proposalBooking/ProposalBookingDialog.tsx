import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles } from 'tss-react/mui';

import CloseDialogButton from 'components/common/CloseDialogButton';
import Loader from 'components/common/Loader';
import useProposalBooking, {
  DetailedProposalBooking,
} from 'hooks/proposalBooking/useProposalBooking';

import ProposalDetailsAndBookingEvents from './ProposalDetailsAndBookingEvents';

const useStyles = makeStyles()(() => ({
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
  const { classes } = useStyles();

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
      <CloseDialogButton onClick={handleCloseDialog} />
      <DialogContent className="tinyScroll">
        <ProposalDetailsAndBookingEvents
          proposalBooking={proposalBooking as DetailedProposalBooking}
          setProposalBooking={
            setProposalBooking as Dispatch<
              SetStateAction<DetailedProposalBooking>
            >
          }
          openedEventId={scheduledEventId}
        />
      </DialogContent>
    </Dialog>
  );
}
