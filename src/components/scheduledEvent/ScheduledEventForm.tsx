import MomentUtils from '@date-io/moment';
import { MenuItem } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { KeyboardDateTimePicker } from 'formik-material-ui-pickers';
import React from 'react';

import { ScheduledEventBookingType } from 'generated/sdk';
import { TZ_LESS_DATE_TIME_FORMAT } from 'utils/date';

export const BookingTypesMap: Record<
  keyof typeof ScheduledEventBookingType,
  string
> = {
  COMMISSIONING: 'Commissioning',
  MAINTENANCE: 'Maintenance',
  SHUTDOWN: 'Shutdown',
  USER_OPERATIONS: 'User operations',
};

export default function ScheduledEventForm() {
  return (
    <>
      <MuiPickersUtilsProvider utils={MomentUtils}>
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
        <MenuItem value={ScheduledEventBookingType.COMMISSIONING} disabled>
          {BookingTypesMap[ScheduledEventBookingType.COMMISSIONING]}
        </MenuItem>
        <MenuItem value={ScheduledEventBookingType.USER_OPERATIONS} disabled>
          {BookingTypesMap[ScheduledEventBookingType.USER_OPERATIONS]}
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
