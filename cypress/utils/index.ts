import moment, { DurationInputArg2 } from 'moment';
import { toTzLessDateTime } from '../../src/utils/date';

export const getCurrentHourDateTime = () => {
  const now = new Date();
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);

  return toTzLessDateTime(now);
};

export const currentHourDateTime = getCurrentHourDateTime();

export const getHourDateTimeAfter = (
  amount: number,
  unit: DurationInputArg2 = 'hour'
) => {
  const currentHourDateTimePlusHours = moment(currentHourDateTime).add(
    amount,
    unit
  );

  return toTzLessDateTime(currentHourDateTimePlusHours);
};

export const getFormattedDateAfter = (
  format = 'DD',
  amount = 0,
  unit: DurationInputArg2 = 'days'
) => moment(currentHourDateTime).add(amount, unit).format(format);
