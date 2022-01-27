import { DateRange, DateRangePicker, DateRangePickerProps } from '@mui/lab';
import { TextFieldProps } from '@mui/material/TextField';
import { FieldProps, getIn } from 'formik';
import { Moment } from 'moment';
import * as React from 'react';

import DateTimeRangePickerRenderInput from './DateTimeRangePickerRenderInput';

function createErrorHandler(
  fieldError: unknown,
  fieldName: string,
  setFieldError: (field: string, message?: string) => void
) {
  return (error?: React.ReactNode) => {
    if (error !== fieldError && error !== '') {
      setFieldError(fieldName, error ? String(error) : undefined);
    }
  };
}

interface DateTimeRangePickerProps
  extends FieldProps<DateRange<Moment>>,
    Omit<
      DateRangePickerProps<Moment>,
      'renderInput' | 'value' | 'name' | 'error'
    > {
  betweenDatesText?: string;
  'data-cy'?: string;
  textField?: TextFieldProps;
}

export function fieldToDateTimePicker({
  startText,
  endText,
  field: {
    onChange: _onChange,
    value: [startValue, endValue],
    ...field
  },
  form: {
    isSubmitting,
    touched,
    errors,
    setFieldValue,
    setFieldError,
    setFieldTouched,
  },
  textField,
  disabled,
  onChange,
  onError,
  orientation,
  ...props
}: DateTimeRangePickerProps): DateRangePickerProps<Moment> {
  const fieldError = getIn(errors, field.name);
  const showError = getIn(touched, field.name) && !!fieldError;

  const onChangeHandler = (date: DateRange<Moment>) => {
    // Do not switch this order, otherwise you might cause a race condition
    // See https://github.com/formium/formik/issues/2083#issuecomment-884831583
    setFieldTouched(field.name, true, false);
    setFieldValue(field.name, date, true);
  };

  return {
    renderInput: (startProps, endProps) =>
      DateTimeRangePickerRenderInput({
        startProps,
        endProps,
        value: [startValue, endValue],
        startText,
        endText,
        onChange: onChange ?? onChangeHandler,
        fieldName: field.name,
        setFieldTouched,
        setFieldValue,
        isPortraitMode: orientation === 'portrait',
        showError,
        fieldError,
        textField,
      }),
    disabled: disabled ?? isSubmitting,
    onChange: onChange ?? onChangeHandler,
    onError:
      onError ?? createErrorHandler(fieldError, field.name, setFieldError),
    ...field,
    ...props,
    value: [startValue, endValue],
  };
}

export default function FormikDateTimeRangePicker({
  children,
  ...props
}: DateTimeRangePickerProps) {
  return (
    <DateRangePicker {...fieldToDateTimePicker(props)}>
      {children}
    </DateRangePicker>
  );
}
