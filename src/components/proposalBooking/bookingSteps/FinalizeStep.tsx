import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
import {
  Button,
  Checkbox,
  DialogContent,
  FormControlLabel,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

import ConfirmationDialog from 'components/common/ConfirmationDialog';
import Loader from 'components/common/Loader';
import SplitButton from 'components/common/SplitButton';
import { ProposalBookingFinalizeAction } from 'generated/sdk';
import { useUnauthorizedApi } from 'hooks/common/useDataApi';
import useProposalBookingLostTimes from 'hooks/lostTime/useProposalBookingLostTimes';
import { DetailedProposalBooking } from 'hooks/proposalBooking/useProposalBooking';
import { parseTzLessDateTime, toTzLessDateTime } from 'utils/date';
import { hasOverlappingEvents } from 'utils/scheduledEvent';

import TimeTable, { TimeTableRow } from '../TimeTable';

type FinalizeStepProps = {
  proposalBooking: DetailedProposalBooking;
  isDirty: boolean;
  handleSetDirty: (isDirty: boolean) => void;
  handleNext: () => void;
  handleResetSteps: () => void;
};

export default function FinalizeStep({
  proposalBooking,
  isDirty,
  handleSetDirty,
  handleNext,
  handleResetSteps,
}: FinalizeStepProps) {
  const { loading, lostTimes } = useProposalBookingLostTimes(
    proposalBooking.id
  );

  const { enqueueSnackbar } = useSnackbar();
  const api = useUnauthorizedApi();
  const [warningAccepted, setWarningAccepted] = useState(false);
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
    handleRowsChange(rows => [
      ...rows,
      {
        id: `tmp-${Date.now()}`,
        newlyCreated: true,
        startsAt: moment().startOf('hour'),
        endsAt: moment()
          .startOf('hour')
          .add(1, 'hour'),
      },
    ]);
  };

  const handleSaveSubmit = async () => {
    try {
      console.log('handle submit');
      setIsLoading(true);

      const {
        bulkUpsertLostTimes: { error, lostTime },
      } = await api().bulkUpsertLostTimes({
        input: {
          proposalBookingId: proposalBooking.id,
          lostTimes: rows.map(({ id, startsAt, endsAt }) => ({
            id,
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
        console.log({ lostTime });
      }

      handleSetDirty(false);
    } catch (e) {
      // TODO
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const [activeConfirmation, setActiveConfirmation] = useState<{
    message: string | React.ReactNode;
    cb: () => void;
  } | null>(null);

  const showConfirmation = (
    confirmationDialog: 'saveLostTime' | 'unsavedWork',
    cb: () => void
  ) => {
    switch (confirmationDialog) {
      case 'saveLostTime':
        setActiveConfirmation({
          message: (
            <>
              You have <strong>overlapping events</strong>, are you sure you
              want to continue?
            </>
          ),
          cb,
        });
        break;
      case 'unsavedWork':
        setActiveConfirmation({
          message: (
            <>
              You have <strong>unsaved work</strong>, are you sure you want to
              continue?
            </>
          ),
          cb,
        });
        break;
    }
  };

  const handleConfirmationClose = (confirmed: boolean) => {
    setActiveConfirmation(null);

    if (confirmed) {
      activeConfirmation?.cb();
    }
  };

  const handleSave = () => {
    hasOverlappingEvents(rows)
      ? showConfirmation('saveLostTime', handleSaveSubmit)
      : handleSaveSubmit();
  };

  const handleFinalizeSubmit = async (
    selectedKey: ProposalBookingFinalizeAction
  ) => {
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
      }
    } catch (e) {
      // TODO

      setIsLoading(false);
      console.error(e);
    }
  };

  const handleFinalize = (selectedKey: ProposalBookingFinalizeAction) => {
    isDirty
      ? showConfirmation('unsavedWork', () => handleFinalizeSubmit(selectedKey))
      : handleFinalizeSubmit(selectedKey);
  };

  return (
    <>
      {isLoading && <Loader />}

      <ConfirmationDialog
        open={activeConfirmation !== null}
        message={activeConfirmation?.message ?? ''}
        onClose={handleConfirmationClose}
      />

      <DialogContent>
        <TimeTable
          editable
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
                style={{ marginLeft: 16 }}
                onClick={handleAdd}
              >
                Add
              </Button>
            </>
          }
        />
        <div>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 3 * 8,
            marginLeft: 8,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={warningAccepted}
                onChange={() => setWarningAccepted(prev => !prev)}
                name="warningAccepted"
                color="primary"
              />
            }
            label="I wish to proceed"
          />
          <SplitButton
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
            disabled={!warningAccepted}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
            Lorem ipsum
          </Alert>
        </div>
      </DialogContent>
    </>
  );
}
