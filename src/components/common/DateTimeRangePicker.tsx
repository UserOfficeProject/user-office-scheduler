import ClockIcon from '@mui/icons-material/AccessTime';
import DateRangePicker, {
  DateRangePickerProps,
} from '@mui/lab/DateRangePicker';
import DesktopDateTimePicker from '@mui/lab/DesktopDateTimePicker';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import moment from 'moment';
import { Moment } from 'moment';
import React from 'react';

import {
  TZ_LESS_DATE_TIME_LOW_PREC_FORMAT,
  TZ_LESS_DATE_TIME_LOW_PREC_MASK,
} from 'utils/date';

type DateTimeRangePickerProps = Omit<
  DateRangePickerProps<Moment>,
  'renderInput'
> & {
  betweenDatesText?: string;
  'data-cy'?: string;
};

const DateTimeRangePicker: React.FC<DateTimeRangePickerProps> = ({
  value: [startValue, endValue],
  betweenDatesText,
  onChange,
  startText,
  endText,
  ...props
}) => {
  return (
    <DateRangePicker
      {...props}
      value={[startValue, endValue]}
      onChange={onChange}
      renderInput={(startProps, endProps) => (
        <Grid container alignItems="center">
          <Grid item xs={12} sm={5}>
            <DesktopDateTimePicker
              value={startValue}
              inputFormat={TZ_LESS_DATE_TIME_LOW_PREC_FORMAT}
              mask={TZ_LESS_DATE_TIME_LOW_PREC_MASK}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="start"
                  onFocus={startProps.inputProps?.onFocus}
                  placeholder={startText?.toString()}
                  label={startText}
                  onTouchEnd={(e) => {
                    console.log(e);
                    if ((e.target as any).id === 'start') {
                      e.preventDefault();
                      endProps.inputProps?.onClick?.(e as any);
                    }
                  }}
                  variant="standard"
                  data-cy={`start-${props['data-cy']}`}
                />
              )}
              onChange={(newValue) => {
                if (newValue && newValue.isValid()) {
                  onChange([newValue, moment(endValue)]);
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
          <Grid item xs={12} sm={2} textAlign="center">
            <Box sx={{ mx: 3 }}>
              {' '}
              {betweenDatesText ? betweenDatesText : 'to'}{' '}
            </Box>
          </Grid>
          <Grid item xs={12} sm={5}>
            <DesktopDateTimePicker
              value={endValue}
              inputFormat={TZ_LESS_DATE_TIME_LOW_PREC_FORMAT}
              mask={TZ_LESS_DATE_TIME_LOW_PREC_MASK}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="end"
                  onFocus={endProps.inputProps?.onFocus}
                  variant="standard"
                  // TODO: Find better solution for this event type conversion. Preventing the touch event so the range picker works the same as desktop.
                  onTouchEnd={(e) => {
                    if ((e.target as any).id === 'end') {
                      e.preventDefault();
                      endProps.inputProps?.onClick?.(e as any);
                    }
                  }}
                  label={endText}
                  placeholder={endText?.toString()}
                  data-cy={`end-${props['data-cy']}`}
                />
              )}
              onChange={(newValue) => {
                if (newValue && newValue.isValid()) {
                  onChange([moment(startValue), newValue]);
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
      )}
    />
  );
};

export default DateTimeRangePicker;
