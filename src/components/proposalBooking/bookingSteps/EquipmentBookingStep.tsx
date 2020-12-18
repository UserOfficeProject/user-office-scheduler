import {
  DialogContent,
  Typography,
  DialogActions,
  Button,
  makeStyles,
  Toolbar,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import React, { useState, useContext } from 'react';

import Loader from 'components/common/Loader';
import { AppContext } from 'context/AppContext';
import { useDataApi } from 'hooks/common/useDataApi';
import { DetailedProposalBooking } from 'hooks/proposalBooking/useProposalBooking';
import useScheduledEventsWithEquipments from 'hooks/scheduledEvent/useScheduledEventsWithEquipments';

import SelectTimeSlotsDialog from './equipmentBooking/SelectTimeSlotsDialog';
import TimeSlotEquipmentTable from './equipmentBooking/TimeSlotEquipmentTable';

export type EquipmentTableRow = {
  id: string;
  name: string;
  autoAccept: boolean;
};

const useStyles = makeStyles(theme => ({
  toolbarRoot: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    flex: '1 1 100%',
    alignItems: 'center',
    display: 'flex',
  },
  spacingLeft: {
    marginLeft: theme.spacing(2),
  },
}));

type EquipmentBookingStepProps = {
  proposalBooking: DetailedProposalBooking;
  isDirty: boolean;
  handleNext: () => void;
  handleBack: () => void;
  handleSetDirty: (isDirty: boolean) => void;
};

export default function EquipmentBookingStep({
  proposalBooking,
  handleNext,
  handleBack,
}: EquipmentBookingStepProps) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [equipmentDialog, setEquipmentDialog] = useState(false);
  const {
    loading: scheduledEventsLoading,
    scheduledEvents,
    refresh,
  } = useScheduledEventsWithEquipments(proposalBooking.id);

  const isLoading = scheduledEventsLoading || loading;

  const handleCloseDialog = () => {
    setEquipmentDialog(false);
    refresh();
  };

  const { showConfirmation } = useContext(AppContext);
  const api = useDataApi();
  const handleDeleteAssignment = (
    equipmentId: string,
    scheduledEventId: string
  ) => {
    showConfirmation({
      message: (
        <>
          Are you sure you want to <strong>remove</strong> the selected
          equipment?
        </>
      ),
      cb: async () => {
        setLoading(true);

        const success = await api().deleteEquipmentAssignment({
          deleteEquipmentAssignmentInput: {
            equipmentId,
            scheduledEventId,
            proposalBookingId: proposalBooking.id,
          },
        });

        if (success) {
          refresh();
          setLoading(false);
          enqueueSnackbar('Removed', { variant: 'success' });
        } else {
          enqueueSnackbar('Failed to remove selected assignment', {
            variant: 'error',
          });
        }
      },
    });
  };

  return (
    <>
      {isLoading && <Loader />}

      {equipmentDialog && (
        <SelectTimeSlotsDialog
          isDialogOpen={equipmentDialog}
          proposalBooking={proposalBooking}
          closeDialog={handleCloseDialog}
        />
      )}

      <DialogContent>
        <Toolbar className={classes.toolbarRoot}>
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Time Slots with Equipments
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              className={classes.spacingLeft}
              onClick={() => setEquipmentDialog(true)}
              data-cy="btn-book-equipment"
            >
              Book equipment
            </Button>
          </Typography>
        </Toolbar>
        <TimeSlotEquipmentTable
          rows={scheduledEvents}
          onDeleteAssignment={handleDeleteAssignment}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          data-cy="btn-back"
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          data-cy="btn-next"
        >
          Next
        </Button>
      </DialogActions>
    </>
  );
}
