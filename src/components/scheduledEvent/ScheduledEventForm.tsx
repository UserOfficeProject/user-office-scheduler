import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MenuItem, TextField as MuiTextField } from '@mui/material';
import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { KeyboardDateTimePicker } from 'formik-material-ui-pickers';
import React from 'react';

import {
  ProposalBookingStatusCore,
  ScheduledEventBookingType,
} from 'generated/sdk';
import useUserInstruments from 'hooks/instrument/useUserInstruments';
import { TZ_LESS_DATE_TIME_FORMAT } from 'utils/date';

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
      <MuiPickersUtilsProvider utils={MomentUtils}>
        {instrumentSelection}
        <Field
          component={KeyboardDateTimePicker}
          required
          name="startsAt"
          margin="normal"
          label="Starts at"
          format={TZ_LESS_DATE_TIME_FORMAT}
          ampm={false}
          minutesStep={60}
          fullWidth
          data-cy="startsAt"
        />
        <Field
          component={KeyboardDateTimePicker}
          required
          name="endsAt"
          margin="normal"
          label="Ends at"
          format={TZ_LESS_DATE_TIME_FORMAT}
          ampm={false}
          minutesStep={60}
          fullWidth
          data-cy="endsAt"
        />
      </MuiPickersUtilsProvider>
      <Field
        component={TextField}
        select
        required
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
        margin="normal"
        fullWidth
        data-cy="description"
      />
    </>
  );
}
