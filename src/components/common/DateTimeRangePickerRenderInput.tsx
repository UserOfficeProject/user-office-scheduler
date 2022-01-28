import ClockIcon from '@mui/icons-material/AccessTime';
import { DateRange } from '@mui/lab/DateRangePicker';
import DesktopDateTimePicker from '@mui/lab/DesktopDateTimePicker';
import { ParseableDate } from '@mui/lab/internal/pickers/constants/prop-types';
import { MuiTextFieldProps } from '@mui/lab/internal/pickers/PureDateInput';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import moment from 'moment';
import { Moment } from 'moment';
import React from 'react';

import {
  TZ_LESS_DATE_TIME_LOW_PREC_FORMAT,
  TZ_LESS_DATE_TIME_LOW_PREC_MASK,
} from 'utils/date';

type DateTimeRangePickerRenderInputProps = {
  value: [ParseableDate<Moment>, ParseableDate<Moment>];
  startProps: MuiTextFieldProps;
  endProps: MuiTextFieldProps;
  startText?: React.ReactNode;
  endText?: React.ReactNode;
  isPortraitMode?: boolean;
  betweenDatesText?: string;
  onChange?: (
    date: DateRange<moment.Moment>,
    keyboardInputValue?: string | undefined
  ) => void;
  'data-cy'?: string;
  fieldName?: string;
  setFieldTouched?: (
    field: string,
    isTouched?: boolean | undefined,
    shouldValidate?: boolean | undefined
  ) => void;
  setFieldValue?: (
    field: string,
    value: DateRange<moment.Moment>,
    shouldValidate?: boolean | undefined
  ) => void;
  textField?: TextFieldProps;
  showError?: boolean;
  fieldError?: Error;
};

const DateTimeRangePickerRenderInput = ({
  value: [startValue, endValue],
  startProps,
  endProps,
  startText,
  endText,
  isPortraitMode,
  betweenDatesText,
  onChange,
  fieldName,
  setFieldTouched,
  setFieldValue,
  showError,
  fieldError,
  textField,
  ...props
}: DateTimeRangePickerRenderInputProps) => (
  <Grid container alignItems="center">
    <Grid item xs={12} sm={isPortraitMode ? 12 : 5}>
      <DesktopDateTimePicker
        value={startValue}
        inputFormat={TZ_LESS_DATE_TIME_LOW_PREC_FORMAT}
        mask={TZ_LESS_DATE_TIME_LOW_PREC_MASK}
        renderInput={(params) => (
          <TextField
            {...params}
            id="start"
            error={showError}
            helperText={showError ? fieldError : textField?.helperText}
            onBlur={
              textField?.onBlur ??
              function () {
                fieldName && setFieldTouched?.(fieldName, true, true);
              }
            }
            onFocus={startProps.inputProps?.onFocus}
            placeholder={startText?.toString()}
            label={startText}
            onTouchEnd={(e) => {
              /* 
                NOTE: When using DesktopDateTimePicker on mobile views we need to prevent the regular touch event and call click event
                so when touching the field it opens the date range picker instead of nothing.
                If we use normal DateTimePicker it doesnt open range picker on mobile but normal date time picker
              **/
              if ((e.target as HTMLInputElement).id === 'start') {
                e.preventDefault();
                endProps.inputProps?.onClick?.(
                  e as unknown as React.MouseEvent<HTMLInputElement, MouseEvent>
                );
              }
            }}
            variant="standard"
            fullWidth
            data-cy={`start-${props['data-cy']}`}
            {...textField}
          />
        )}
        onChange={(newValue) => {
          if (fieldName) {
            setFieldTouched?.(fieldName, true, false);
            setFieldValue?.(fieldName, [newValue, moment(endValue)], true);
          }
          if (newValue && newValue.isValid()) {
            onChange?.([newValue, moment(endValue)]);
          }
        }}
        components={{
          OpenPickerIcon: ClockIcon,
        }}
        views={['hours', 'minutes']}
        // NOTE: For now hideTabs is not working on desktop variant would be better if they fix this https://github.com/mui-org/material-ui/issues/30771
        // hideTabs={true}
      />
    </Grid>
    <Grid item xs={12} sm={isPortraitMode ? 12 : 2} textAlign="center">
      <Box sx={{ mx: 3, mt: isPortraitMode ? 1 : 0 }}>
        {' '}
        {betweenDatesText ? betweenDatesText : ''}{' '}
      </Box>
    </Grid>
    <Grid item xs={12} sm={isPortraitMode ? 12 : 5}>
      <DesktopDateTimePicker
        value={endValue}
        inputFormat={TZ_LESS_DATE_TIME_LOW_PREC_FORMAT}
        mask={TZ_LESS_DATE_TIME_LOW_PREC_MASK}
        renderInput={(params) => (
          <TextField
            {...params}
            id="end"
            error={showError}
            helperText={showError ? fieldError : textField?.helperText}
            onBlur={
              textField?.onBlur ??
              function () {
                fieldName && setFieldTouched?.(fieldName, true, true);
              }
            }
            onFocus={endProps.inputProps?.onFocus}
            variant="standard"
            fullWidth
            onTouchEnd={(e) => {
              /* 
                NOTE: When using DesktopDateTimePicker on mobile views we need to prevent the regular touch event and call click event
                so when touching the field it opens the date range picker instead of nothing.
                If we use normal DateTimePicker it doesnt open range picker on mobile but normal date time picker
              **/
              if ((e.target as HTMLInputElement).id === 'end') {
                e.preventDefault();
                endProps.inputProps?.onClick?.(
                  e as unknown as React.MouseEvent<HTMLInputElement, MouseEvent>
                );
              }
            }}
            label={endText}
            placeholder={endText?.toString()}
            data-cy={`end-${props['data-cy']}`}
          />
        )}
        onChange={(newValue) => {
          if (fieldName) {
            setFieldTouched?.(fieldName, true, false);
            setFieldValue?.(fieldName, [moment(startValue), newValue], true);
          }
          if (newValue && newValue.isValid()) {
            onChange?.([moment(startValue), newValue]);
          }
        }}
        components={{
          OpenPickerIcon: ClockIcon,
        }}
        views={['hours', 'minutes']}
        // NOTE: For now hideTabs is not working on desktop variant would be better if they fix this https://github.com/mui-org/material-ui/issues/30771
        // hideTabs={true}
      />
    </Grid>
  </Grid>
);

export default DateTimeRangePickerRenderInput;
