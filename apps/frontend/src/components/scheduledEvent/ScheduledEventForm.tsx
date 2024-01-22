import { MenuItem, TextField as MuiTextField } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Field } from 'formik';
import { TextField } from 'formik-mui';
import { DateTimePicker } from 'formik-mui-x-date-pickers';
import React from 'react';

import {
  ProposalBookingStatusCore,
  ScheduledEventBookingType,
} from 'generated/sdk';
import useUserInstruments from 'hooks/instrument/useUserInstruments';
import { TZ_LESS_DATE_TIME_LOW_PREC_FORMAT } from 'utils/date';

export type BookingTypes = typeof ScheduledEventBookingType;

export const BookingTypesMap: Record<keyof BookingTypes, string> = {
  MAINTENANCE: 'Maintenance',
  SHUTDOWN: 'Shutdown',
  USER_OPERATIONS: 'User operations',
  EQUIPMENT: 'Equipment booking',
};

export const CalendarExplicitBookableTypes: Record<
  keyof Pick<BookingTypes, 'SHUTDOWN' | 'MAINTENANCE'>,
  string
> = {
  MAINTENANCE: 'Maintenance',
  SHUTDOWN: 'Shutdown',
};

export type ProposalBookingStatusCoreType = typeof ProposalBookingStatusCore;

export const ScheduledEventStatusMap: Record<
  keyof ProposalBookingStatusCoreType,
  string
> = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
};

type ScheduledEventFormProps = {
  minEndDate: moment.Moment;
};

export default function ScheduledEventForm({
  minEndDate,
}: ScheduledEventFormProps) {
  const { instruments, loading } = useUserInstruments();

  /**
   * Looks like if the items for a select are updated
   * after the  select field was mounted
   * you will get warning about out of range values.
   * To fix that just avoid mounting the real select until it's loaded
   */
  const instrumentSelection = loading ? (
    <MuiTextField
      label="Instrument"
      defaultValue="Loading..."
      disabled
      variant="standard"
      margin="normal"
      InputLabelProps={{
        shrink: true,
      }}
      fullWidth
      required
    />
  ) : (
    <Field
      component={TextField}
      variant="standard"
      select
      required
      name="instrument"
      label="Instrument"
      margin="normal"
      fullWidth
      data-cy="instrument"
    >
      {instruments.map((instrument) => (
        <MenuItem key={instrument.id} value={instrument.id}>
          {instrument.name}
        </MenuItem>
      ))}
    </Field>
  );

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        {instrumentSelection}
        <Field
          component={DateTimePicker}
          required
          name="startsAt"
          views={['year', 'month', 'day', 'hours']}
          slotProps={{
            textField: {
              variant: 'standard',
              margin: 'normal',
              label: 'Starts at',
              fullWidth: true,
              required: true,
              'data-cy': 'startsAt',
            },
          }}
          format={TZ_LESS_DATE_TIME_LOW_PREC_FORMAT}
          ampm={false}
        />
        <Field
          component={DateTimePicker}
          required
          name="endsAt"
          views={['year', 'month', 'day', 'hours']}
          slotProps={{
            textField: {
              variant: 'standard',
              margin: 'normal',
              label: 'Ends at',
              fullWidth: true,
              required: true,
              'data-cy': 'endsAt',
            },
          }}
          format={TZ_LESS_DATE_TIME_LOW_PREC_FORMAT}
          ampm={false}
          minDateTime={minEndDate}
        />
      </LocalizationProvider>
      <Field
        component={TextField}
        select
        required
        variant="standard"
        name="bookingType"
        label="Booking type"
        margin="normal"
        fullWidth
        data-cy="bookingType"
      >
        <MenuItem value={ScheduledEventBookingType.MAINTENANCE}>
          {BookingTypesMap[ScheduledEventBookingType.MAINTENANCE]}
        </MenuItem>
        <MenuItem value={ScheduledEventBookingType.SHUTDOWN}>
          {BookingTypesMap[ScheduledEventBookingType.SHUTDOWN]}
        </MenuItem>
      </Field>
      <Field
        component={TextField}
        name="description"
        label="Short description"
        helperText="Optional"
        variant="standard"
        margin="normal"
        fullWidth
        data-cy="description"
      />
    </>
  );
}
