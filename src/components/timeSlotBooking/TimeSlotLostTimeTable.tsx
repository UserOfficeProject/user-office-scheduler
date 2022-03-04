import MaterialTable, {
  Column,
  EditComponentProps,
} from '@material-table/core';
import { Add as AddIcon } from '@mui/icons-material';
import AdapterMoment from '@mui/lab/AdapterMoment';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {
  getTranslation,
  ResourceId,
} from '@user-office-software/duo-localisation';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';

import { tableIcons } from 'components/common/TableIcons';
import { ProposalBookingStatusCore } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';
import { ProposalBookingLostTime } from 'hooks/lostTime/useProposalBookingLostTimes';
import { DetailedProposalBookingScheduledEvent } from 'hooks/proposalBooking/useProposalBooking';
import {
  toTzLessDateTime,
  TZ_LESS_DATE_TIME_LOW_PREC_FORMAT,
  TZ_LESS_DATE_TIME_LOW_PREC_MASK,
} from 'utils/date';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(4, 0, 0),

    '& .MuiToolbar-root': {
      padding: 0,

      '& button.MuiIconButton-root': {
        backgroundColor: 'unset !important',
        padding: 0,
      },
    },
  },
  spacingLeft: {
    marginLeft: theme.spacing(2),
  },
}));

type TimeSlotLostTimeTableProps = {
  scheduledEvent: DetailedProposalBookingScheduledEvent;
  proposalBookingId: number;
  handleSetDirty: (isDirty: boolean) => void;
  lostTimes: ProposalBookingLostTime[];
  setLostTimes: Dispatch<SetStateAction<ProposalBookingLostTime[]>>;
  loading: boolean;
};

function TimeSlotLostTimeTable({
  scheduledEvent,
  handleSetDirty,
  proposalBookingId,
  loading,
  lostTimes,
  setLostTimes,
}: TimeSlotLostTimeTableProps) {
  const isStepReadOnly =
    scheduledEvent.status === ProposalBookingStatusCore.COMPLETED;

  const theme = useTheme();
  const classes = useStyles();
  const api = useDataApi();
  const { enqueueSnackbar } = useSnackbar();
  const [isAddingNewLostTime, setIsAddingNewLostTime] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    setIsAddingNewLostTime(true);
    handleSetDirty(false);
    try {
      setIsLoading(true);

      const newLostTimeStart = lostTimes.length
        ? moment(lostTimes[lostTimes.length - 1].endsAt).startOf('hour')
        : moment().startOf('hour');
      const newLostTimeEnd = lostTimes.length
        ? moment(lostTimes[lostTimes.length - 1].endsAt)
            .startOf('hour')
            .add(1, 'hour')
        : moment().startOf('hour').add(1, 'hour');

      const {
        addLostTime: { error, lostTime: addedLostTime },
      } = await api().addLostTime({
        input: {
          proposalBookingId: proposalBookingId,
          lostTime: {
            scheduledEventId: scheduledEvent.id,
            startsAt: toTzLessDateTime(newLostTimeStart),
            endsAt: toTzLessDateTime(newLostTimeEnd),
          },
        },
      });

      if (error) {
        enqueueSnackbar(getTranslation(error as ResourceId), {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Lost time added', {
          variant: 'success',
        });
        addedLostTime && setLostTimes([...lostTimes, addedLostTime]);
      }
    } catch (e) {
      // TODO
      console.error(e);
    } finally {
      setIsLoading(false);
    }
    setIsAddingNewLostTime(false);
  };

  const handleRowDelete = async (data: ProposalBookingLostTime) => {
    const {
      deleteLostTime: { error, lostTime: deletedLostTime },
    } = await api().deleteLostTime({
      input: {
        id: data.id,
      },
    });

    if (error) {
      enqueueSnackbar(getTranslation(error as ResourceId), {
        variant: 'error',
      });
    } else {
      enqueueSnackbar('Lost time deleted', {
        variant: 'success',
      });
      if (deletedLostTime) {
        const updatedLostTimes = lostTimes.filter(
          (lostTime) => lostTime.id !== deletedLostTime.id
        );
        setLostTimes(updatedLostTimes);
      }
    }
  };

  const handleRowUpdate = async (data: ProposalBookingLostTime) => {
    handleSetDirty(false);

    const {
      updateLostTime: { error, lostTime: updatedLostTime },
    } = await api().updateLostTime({
      input: {
        id: data.id,
        startsAt: toTzLessDateTime(data.startsAt),
        endsAt: toTzLessDateTime(data.endsAt),
      },
    });

    if (error) {
      enqueueSnackbar(getTranslation(error as ResourceId), {
        variant: 'error',
      });
    } else {
      enqueueSnackbar('Lost time updated', {
        variant: 'success',
      });
      if (updatedLostTime) {
        const updatedLostTimes = lostTimes.map((lostTime) =>
          lostTime.id === updatedLostTime.id ? updatedLostTime : lostTime
        );
        setLostTimes(updatedLostTimes);
      }
    }

    setIsLoading(false);
  };

  // NOTE: Using useCallback to avoid console warning(https://github.com/material-table-core/core/issues/286)
  const validateInput = useCallback((data) => {
    if (moment(data.startsAt).isSameOrAfter(moment(data.endsAt))) {
      return {
        isValid: false,
        helperText: 'End date should be after start date',
      };
    } else {
      return {
        isValid: true,
        helperText: '',
      };
    }
  }, []);

  // NOTE: Using useCallback to avoid console warning(https://github.com/material-table-core/core/issues/286)
  const startsAtEditComponent = useCallback(
    (props: EditComponentProps<ProposalBookingLostTime>) => (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateTimePicker
          label="Starts at"
          desktopModeMediaQuery={theme.breakpoints.up('sm')}
          renderInput={(props) => (
            <TextField
              {...props}
              variant="standard"
              required
              margin="none"
              size="small"
              fullWidth
              data-cy="startsAt"
            />
          )}
          mask={TZ_LESS_DATE_TIME_LOW_PREC_MASK}
          inputFormat={TZ_LESS_DATE_TIME_LOW_PREC_FORMAT}
          ampm={false}
          minutesStep={60}
          value={props.value}
          onChange={(value) => {
            handleSetDirty(true);
            props.onChange(value);
          }}
        />
      </LocalizationProvider>
    ),
    [handleSetDirty, theme.breakpoints]
  );

  // NOTE: Using useCallback to avoid console warning(https://github.com/material-table-core/core/issues/286)
  const endsAtEditComponent = useCallback(
    (
      props: EditComponentProps<ProposalBookingLostTime> & {
        helperText?: string;
      }
    ) => (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateTimePicker
          label="Ends at"
          desktopModeMediaQuery={theme.breakpoints.up('sm')}
          renderInput={(inputProps) => (
            <TextField
              {...inputProps}
              variant="standard"
              required
              margin="none"
              size="small"
              fullWidth
              helperText={props.helperText}
              error={props.error}
              data-cy="endsAt"
            />
          )}
          mask={TZ_LESS_DATE_TIME_LOW_PREC_MASK}
          inputFormat={TZ_LESS_DATE_TIME_LOW_PREC_FORMAT}
          ampm={false}
          minutesStep={60}
          value={props.value}
          onChange={(value) => {
            handleSetDirty(true);
            props.onChange(value);
          }}
        />
      </LocalizationProvider>
    ),
    [handleSetDirty, theme.breakpoints]
  );

  const columns: Column<ProposalBookingLostTime>[] = [
    {
      title: 'Starts at',
      field: 'startsAt',
      editComponent: startsAtEditComponent,
    },
    {
      title: 'Ends at',
      field: 'endsAt',
      validate: validateInput,
      editComponent: endsAtEditComponent,
    },
  ];

  return (
    <div className={classes.root} data-cy="time-slot-lost-times-table">
      <MaterialTable
        icons={tableIcons}
        title={
          <Typography component="h4" variant="h6">
            Lost times
          </Typography>
        }
        isLoading={loading || isLoading}
        columns={columns}
        data={lostTimes}
        options={{
          search: false,
          paging: false,
        }}
        editable={
          !isStepReadOnly
            ? {
                onRowUpdate: handleRowUpdate,
                onRowUpdateCancelled: () => handleSetDirty(false),
                onRowDelete: handleRowDelete,
              }
            : {}
        }
        actions={[
          {
            icon: () => (
              <Button
                variant="outlined"
                color="primary"
                component="span"
                data-cy="btn-add-lost-time"
                startIcon={
                  isAddingNewLostTime ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <AddIcon />
                  )
                }
                disabled={isAddingNewLostTime}
              >
                Add lost time
              </Button>
            ),
            disabled: isAddingNewLostTime,
            hidden: isStepReadOnly,
            onClick: handleAdd,
            isFreeAction: true,
            tooltip: isAddingNewLostTime
              ? undefined
              : 'Add experiment lost time',
          },
        ]}
      />
    </div>
  );
}

export default React.memo(TimeSlotLostTimeTable);
