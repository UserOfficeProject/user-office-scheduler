import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { MenuItem, TextField as MuiTextField } from '@mui/material';
import { Field } from 'formik';
import { TextField } from 'formik-mui';
import { DateTimePicker } from 'formik-mui-lab';
import React from 'react';

import {
  ProposalBookingStatusCore,
  ScheduledEventBookingType,
} from 'generated/sdk';
import useUserInstruments from 'hooks/instrument/useUserInstruments';
import { TZ_LESS_DATE_TIME_FORMAT, TZ_LESS_DATE_TIME_MASK } from 'utils/date';

export type BookingTypes = typeof ScheduledEventBookingType;

export const BookingTypesMap: Record<keyof BookingTypes, string> = {
  COMMISSIONING: 'Commissioning',
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

export default function ScheduledEventForm() {
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
          textField={{
            variant: 'standard',
            margin: 'normal',
            fullWidth: true,
          }}
          label="Starts at"
          mask={TZ_LESS_DATE_TIME_MASK}
          inputFormat={TZ_LESS_DATE_TIME_FORMAT}
          ampm={false}
          minutesStep={60}
          fullWidth
          data-cy="startsAt"
        />
        <Field
          component={DateTimePicker}
          required
          name="endsAt"
          textField={{
            variant: 'standard',
            margin: 'normal',
            fullWidth: true,
          }}
          label="Ends at"
          mask={TZ_LESS_DATE_TIME_MASK}
          inputFormat={TZ_LESS_DATE_TIME_FORMAT}
          ampm={false}
          minutesStep={60}
          fullWidth
          data-cy="endsAt"
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
