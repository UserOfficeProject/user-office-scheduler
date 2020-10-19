import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
import {
  Button,
  Checkbox,
  DialogContent,
  FormControlLabel,
  makeStyles,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';

import Loader from 'components/common/Loader';
import SplitButton from 'components/common/SplitButton';
import { AppContext } from 'context/AppContext';
import { ProposalBookingFinalizeAction } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import useProposalBookingLostTimes from 'hooks/lostTime/useProposalBookingLostTimes';
import { DetailedProposalBooking } from 'hooks/proposalBooking/useProposalBooking';
import { parseTzLessDateTime, toTzLessDateTime } from 'utils/date';
import { hasOverlappingEvents } from 'utils/scheduledEvent';

import TimeTable, { TimeTableRow } from '../TimeTable';

const useStyles = makeStyles(theme => ({
  spacing: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(3, 1, 1),
  },
  spacingLeft: {
    marginLeft: theme.spacing(2),
  },
}));

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
  const classes = useStyles();

  const { loading, lostTimes } = useProposalBookingLostTimes(
    proposalBooking.id
  );

  const { showConfirmation } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const api = useDataApi();
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
      setIsLoading(true);

      const {
        bulkUpsertLostTimes: { error, lostTime: updatedLostTime },
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
                className={classes.spacingLeft}
                onClick={handleAdd}
                data-cy="btn-add-lost-time"
              >
                Add
              </Button>
            </>
          }
        />
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            data-cy="btn-save"
          >
            Save
          </Button>
        </div>
        <div className={classes.spacing}>
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
            disabled={!warningAccepted}
          />
        </div>
        <div>
          <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
            Lorem ipsum
          </Alert>
        </div>
      </DialogContent>
    </>
  );
}
