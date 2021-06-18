import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
import { Button, DialogContent, makeStyles } from '@material-ui/core';
import { Add as AddIcon, Save as SaveIcon } from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';

import Loader from 'components/common/Loader';
import SplitButton from 'components/common/SplitButton';
import { AppContext } from 'context/AppContext';
import {
  ProposalBookingFinalizeAction,
  ProposalBookingStatus,
} from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import useProposalBookingLostTimes from 'hooks/lostTime/useProposalBookingLostTimes';
import { parseTzLessDateTime, toTzLessDateTime } from 'utils/date';
import { hasOverlappingEvents } from 'utils/scheduledEvent';

import { ProposalBookingDialogStepProps } from '../ProposalBookingDialog';
import TimeTable, { TimeTableRow } from '../TimeTable';

const useStyles = makeStyles((theme) => ({
  spacing: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(3, 1, 1),
    gap: theme.spacing(1),
  },
  spacingLeft: {
    marginLeft: theme.spacing(2),
  },
}));

export default function FinalizeStep({
  activeStatus,
  proposalBooking,
  isDirty,
  handleSetDirty,
  handleNext,
  handleResetSteps,
  handleSetActiveStepByStatus,
}: ProposalBookingDialogStepProps) {
  const isStepReadOnly = activeStatus !== ProposalBookingStatus.BOOKED;

  const classes = useStyles();

  const { loading, lostTimes } = useProposalBookingLostTimes(
    proposalBooking.id
  );

  const { showConfirmation } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const api = useDataApi();
  const [rows, setRows] = useState<TimeTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setRows(
        lostTimes.map(({ startsAt, endsAt, ...rest }) => ({
          ...rest,
          startsAt: parseTzLessDateTime(startsAt),
          endsAt: parseTzLessDateTime(endsAt),
        }))
      );

      setIsLoading(false);
    }
  }, [loading, lostTimes]);

  const handleRowsChange = (cb: React.SetStateAction<TimeTableRow[]>) => {
    !isDirty && handleSetDirty(true);
    setRows(cb);
  };

  const handleAdd = () => {
    handleRowsChange((rows) => [
      ...rows,
      {
        id: `t-${Date.now()}`,
        newlyCreated: true,
        startsAt: moment().startOf('hour'),
        endsAt: moment().startOf('hour').add(1, 'hour'),
      },
    ]);
  };

  const handleSaveSubmit = async () => {
    try {
      setIsLoading(true);

      const {
        bulkUpsertLostTimes: { error, lostTime: updatedLostTime },
      } = await api().bulkUpsertLostTimes({
        input: {
          proposalBookingId: proposalBooking.id,
          lostTimes: rows.map(({ startsAt, endsAt, ...rest }) => ({
            ...rest,
            startsAt: toTzLessDateTime(startsAt),
            endsAt: toTzLessDateTime(endsAt),
          })),
        },
      });

      if (error) {
        enqueueSnackbar(getTranslation(error as ResourceId), {
          variant: 'error',
        });
      } else {
        updatedLostTime &&
          setRows(
            updatedLostTime.map(({ startsAt, endsAt, ...rest }) => ({
              ...rest,
              startsAt: parseTzLessDateTime(startsAt),
              endsAt: parseTzLessDateTime(endsAt),
            }))
          );
      }

      handleSetDirty(false);
    } catch (e) {
      // TODO
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    hasOverlappingEvents(rows)
      ? showConfirmation({
          message: (
            <>
              You have <strong>overlapping events</strong>, are you sure you
              want to continue?
            </>
          ),
          cb: handleSaveSubmit,
        })
      : handleSaveSubmit();
  };

  const handleFinalizeSubmit = async (
    selectedKey: ProposalBookingFinalizeAction
  ) => {
    showConfirmation({
      message: (
        <>
          Are you sure you want to{' '}
          <strong>
            {selectedKey === ProposalBookingFinalizeAction.CLOSE
              ? 'close'
              : 'restart'}
          </strong>{' '}
          the selected booking?
        </>
      ),
      cb: async () => {
        try {
          setIsLoading(true);

          const {
            finalizeProposalBooking: { error },
          } = await api().finalizeProposalBooking({
            action: selectedKey,
            id: proposalBooking.id,
          });

          if (error) {
            enqueueSnackbar(getTranslation(error as ResourceId), {
              variant: 'error',
            });

            setIsLoading(false);
          } else {
            selectedKey === ProposalBookingFinalizeAction.CLOSE
              ? handleNext()
              : handleResetSteps();

            handleSetActiveStepByStatus(
              selectedKey === ProposalBookingFinalizeAction.CLOSE
                ? ProposalBookingStatus.CLOSED
                : ProposalBookingStatus.DRAFT
            );
          }
        } catch (e) {
          // TODO

          setIsLoading(false);
          console.error(e);
        }
      },
    });
  };

  const handleFinalize = (selectedKey: ProposalBookingFinalizeAction) => {
    isDirty
      ? showConfirmation({
          message: (
            <>
              You have <strong>unsaved work</strong>, are you sure you want to
              continue?
            </>
          ),
          cb: () => handleFinalizeSubmit(selectedKey),
        })
      : handleFinalizeSubmit(selectedKey);
  };

  return (
    <>
      {isLoading && <Loader />}

      <DialogContent>
        <TimeTable
          selectable={!isStepReadOnly}
          editable={!isStepReadOnly}
          maxHeight={380}
          rows={rows}
          handleRowsChange={handleRowsChange}
          titleComponent={
            <>
              Lost time
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                className={classes.spacingLeft}
                onClick={handleAdd}
                data-cy="btn-add-lost-time"
                disabled={isStepReadOnly}
              >
                Add
              </Button>
            </>
          }
        />
        <div className={classes.spacing}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            data-cy="btn-save"
            disabled={isStepReadOnly}
          >
            Save lost time
          </Button>
          <SplitButton
            label="proposal-booking-finalization-strategy"
            options={[
              {
                key: ProposalBookingFinalizeAction.CLOSE,
                label: 'Close proposal booking',
              },
              {
                key: ProposalBookingFinalizeAction.RESTART,
                label: 'Restart the booking process',
              },
            ]}
            onClick={handleFinalize}
            disabled={isStepReadOnly}
            dropdownDisabled={isStepReadOnly}
          />
        </div>
        <div></div>
        {!isStepReadOnly && (
          <div>
            <Alert severity="warning">
              <AlertTitle>Warning</AlertTitle>
              Closing proposal booking disallows any further edit
            </Alert>
          </div>
        )}
      </DialogContent>
    </>
  );
}
