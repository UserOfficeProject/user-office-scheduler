import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
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
import { ProposalBookingStatus } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import useScheduledEventsWithEquipments from 'hooks/scheduledEvent/useScheduledEventsWithEquipments';

import { ProposalBookingDialogStepProps } from '../ProposalBookingDialog';
import SelectTimeSlotsDialog from './equipmentBooking/SelectTimeSlotsDialog';
import TimeSlotEquipmentTable from './equipmentBooking/TimeSlotEquipmentTable';

export type EquipmentTableRow = {
  id: string;
  name: string;
  autoAccept: boolean;
};

const useStyles = makeStyles((theme) => ({
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

export default function EquipmentBookingStep({
  activeStatus,
  proposalBooking,
  handleNext,
  handleBack,
  handleSetActiveStepByStatus,
}: ProposalBookingDialogStepProps) {
  const isStepReadOnly = activeStatus !== ProposalBookingStatus.DRAFT;

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

  const handleActivateSubmit = async () => {
    showConfirmation({
      message: (
        <>
          Are you sure you want to <strong>activate</strong> booking?
        </>
      ),
      cb: async () => {
        try {
          setLoading(true);

          const {
            activateProposalBooking: { error },
          } = await api().activateProposalBooking({
            id: proposalBooking.id,
          });

          if (error) {
            enqueueSnackbar(getTranslation(error as ResourceId), {
              variant: 'error',
            });

            setLoading(false);
          } else {
            handleNext();
            handleSetActiveStepByStatus(ProposalBookingStatus.BOOKED);
          }
        } catch (e) {
          // TODO
          setLoading(false);
          console.error(e);
        }
      },
    });
  };

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

        const { deleteEquipmentAssignment: success } =
          await api().deleteEquipmentAssignment({
            deleteEquipmentAssignmentInput: {
              equipmentId,
              scheduledEventId,
              proposalBookingId: proposalBooking.id,
            },
          });

        if (success) {
          refresh();
          enqueueSnackbar('Removed', { variant: 'success' });
        } else {
          enqueueSnackbar('Failed to remove selected assignment', {
            variant: 'error',
          });
        }

        setLoading(false);
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
              disabled={isStepReadOnly}
            >
              Book equipment
            </Button>
          </Typography>
        </Toolbar>
        <TimeSlotEquipmentTable
          rows={scheduledEvents}
          onDeleteAssignment={handleDeleteAssignment}
          readOnly={isStepReadOnly}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          data-cy="btn-back"
          disabled={isStepReadOnly}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={isStepReadOnly}
          onClick={handleActivateSubmit}
        >
          Activate booking
        </Button>
      </DialogActions>
    </>
  );
}
