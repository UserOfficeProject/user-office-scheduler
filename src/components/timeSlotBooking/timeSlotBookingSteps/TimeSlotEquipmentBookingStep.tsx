import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
import {
  DialogContent,
  Typography,
  DialogActions,
  Button,
  makeStyles,
  Toolbar,
  Box,
  TableHead,
  TableRow,
  TableCell,
  Table as MuiTable,
  TableBody,
  IconButton,
} from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { useSnackbar } from 'notistack';
import React, { useState, useContext } from 'react';

import Loader from 'components/common/Loader';
import SelectTimeSlotsDialog from 'components/proposalBooking/bookingSteps/equipmentBooking/SelectTimeSlotsDialog';
import { AppContext } from 'context/AppContext';
import {
  EquipmentAssignmentStatus,
  ProposalBooking,
  ProposalBookingStatus,
} from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import { DetailedProposalBooking } from 'hooks/proposalBooking/useProposalBooking';
import useScheduledEventEquipments from 'hooks/scheduledEvent/useScheduledEventEquipments';
import { ScheduledEventEquipment } from 'hooks/scheduledEvent/useScheduledEventWithEquipment';

import { TimeSlotBookingDialogStepProps } from '../TimeSlotBookingDialog';

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
  spacingTop: {
    marginTop: theme.spacing(2),
  },
}));

export default function TimeSlotEquipmentBookingStep({
  activeStatus,
  scheduledEvent,
  handleNext,
  handleBack,
  handleSetActiveStepByStatus,
  handleCloseDialog,
}: TimeSlotBookingDialogStepProps) {
  const proposalBooking = scheduledEvent.proposalBooking as ProposalBooking;
  const isStepReadOnly = activeStatus !== ProposalBookingStatus.DRAFT;

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [equipmentDialog, setEquipmentDialog] = useState(false);

  const {
    equipments: scheduledEventEquipments,
    loading: loadingEquipments,
    refresh,
  } = useScheduledEventEquipments({
    proposalBookingId: proposalBooking.id,
    scheduledEventId: scheduledEvent.id,
  });

  const isLoading = loading || loadingEquipments;

  const allEquipmentsAccepted = scheduledEventEquipments.every(
    (equipment) => equipment.status === EquipmentAssignmentStatus.ACCEPTED
  );

  const handleEquipmentCloseDialog = () => {
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
            activateScheduledEvent: { error },
          } = await api().activateScheduledEvent({
            input: { id: scheduledEvent.id },
          });

          if (error) {
            enqueueSnackbar(getTranslation(error as ResourceId), {
              variant: 'error',
            });

            setLoading(false);
          } else {
            handleNext();
            handleSetActiveStepByStatus(ProposalBookingStatus.ACTIVE);
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
    equipmentId: number,
    scheduledEventId: number
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
          scheduledEvent={scheduledEvent}
          proposalBooking={proposalBooking as DetailedProposalBooking}
          closeDialog={handleEquipmentCloseDialog}
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
            Time Slot Equipments
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
        <Box margin={1}>
          <MuiTable size="small" aria-label="equipments">
            <TableHead>
              <TableRow role="row">
                <TableCell>Actions</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scheduledEventEquipments.map(
                (equipment: ScheduledEventEquipment) => (
                  <TableRow key={equipment.id} role="row">
                    <TableCell component="th" scope="row">
                      <IconButton
                        size="small"
                        data-cy="btn-delete-assignment"
                        disabled={isStepReadOnly}
                        onClick={() =>
                          handleDeleteAssignment(
                            equipment.id,
                            scheduledEvent.id
                          )
                        }
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell>{equipment.name}</TableCell>
                    <TableCell data-cy="equipment-row-status">
                      {equipment.status}
                    </TableCell>
                  </TableRow>
                )
              )}
              {scheduledEventEquipments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                    No records to show
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </MuiTable>
        </Box>
        {!allEquipmentsAccepted && (
          <Alert
            severity="warning"
            className={classes.spacingTop}
            data-cy="accepted-equipment-warning"
          >
            <AlertTitle>Warning</AlertTitle>
            All booked equipments must be accepted before activating the booking
          </Alert>
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
          data-cy="activate-time-slot-booking"
          disabled={isStepReadOnly || !allEquipmentsAccepted}
          onClick={handleActivateSubmit}
        >
          Activate booking
        </Button>
      </DialogActions>
    </>
  );
}
