import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
import {
  DialogContent,
  Typography,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

import Loader from 'components/common/Loader';
import { useUnauthorizedApi } from 'hooks/common/useDataApi';
import { DetailedProposalBooking } from 'hooks/proposalBooking/useProposalBooking';

type ReviewFeedbackStepProps = {
  proposalBooking: DetailedProposalBooking;
  handleBack: () => void;
  handleNext: () => void;
};

export default function ReviewFeedbackStep({
  proposalBooking,
  handleBack,
  handleNext,
}: ReviewFeedbackStepProps) {
  const { enqueueSnackbar } = useSnackbar();
  const api = useUnauthorizedApi();

  const [isLoading, setIsLoading] = useState(false);
  const [warningAccepted, setWarningAccepted] = useState(false);

  const handleActivateSubmit = async () => {
    try {
      setIsLoading(true);

      const {
        activateProposalBooking: { error },
      } = await api().activateProposalBooking({
        id: proposalBooking.id,
      });

      if (error) {
        enqueueSnackbar(getTranslation(error as ResourceId), {
          variant: 'error',
        });

        setIsLoading(false);
      } else {
        handleNext();
      }
    } catch (e) {
      // TODO
      setIsLoading(false);
      console.error(e);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography align="center">
          Not implemented yet, please proceed
        </Typography>
        <div
          style={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'flex-end',
            marginTop: 3 * 8,

            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
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
            <Button
              variant="contained"
              color="primary"
              disabled={!warningAccepted}
              onClick={handleActivateSubmit}
            >
              Activate booking
            </Button>
          </div>
          <div style={{ marginTop: 8 }}>
            <Alert severity="warning">
              <AlertTitle>Warning</AlertTitle>
              Lorem ipsum
            </Alert>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleBack}>
          Back
        </Button>
      </DialogActions>
    </>
  );
}
