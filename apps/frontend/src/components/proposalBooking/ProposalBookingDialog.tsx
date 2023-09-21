import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import React, { Dispatch, SetStateAction } from 'react';

import Loader from 'components/common/Loader';
import useProposalBooking, {
  DetailedProposalBooking,
} from 'hooks/proposalBooking/useProposalBooking';

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
      <IconButton
        aria-label="close"
        onClick={handleCloseDialog}
        data-cy="btn-close-dialog"
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
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
