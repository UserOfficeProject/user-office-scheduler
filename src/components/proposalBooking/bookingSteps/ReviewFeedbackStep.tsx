import { getTranslation, ResourceId } from '@esss-swap/duo-localisation';
import {
  DialogContent,
  Typography,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  makeStyles,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

import Loader from 'components/common/Loader';
import { useDataApi } from 'hooks/common/useDataApi';

import { ProposalBookingDialogStepProps } from '../ProposalBookingDialog';

const useStyles = makeStyles((theme) => ({
  root: { display: 'flex', flexDirection: 'column' },
  positionBottom: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  spacing: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(1),
  },
}));

export default function ReviewFeedbackStep({
  proposalBooking,
  handleBack,
  handleNext,
}: ProposalBookingDialogStepProps) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const api = useDataApi();

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
      <DialogContent className={classes.root}>
        <Typography align="center">
          Not implemented yet, please proceed
        </Typography>
        <div className={classes.positionBottom}>
          <div className={clsx(classes.spacing)}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={warningAccepted}
                  onChange={() => setWarningAccepted((prev) => !prev)}
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
          <div>
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
