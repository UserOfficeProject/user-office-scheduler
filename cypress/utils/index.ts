import moment, { DurationInputArg2, Moment } from 'moment';

export const TZ_LESS_DATE_TIME_FORMAT = 'yyyy-MM-DD HH:mm:ss';

export const toTzLessDateTime = (dateTime: Moment | Date | string): string => {
  if (dateTime instanceof Date || typeof dateTime === 'string') {
    dateTime = moment(dateTime);
  }

  return dateTime.format(TZ_LESS_DATE_TIME_FORMAT);
};

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

export const getFormattedBeginningOfSelectedWeek = (
  format = 'DD',
  selectedWeek = 0
) =>
  moment(currentHourDateTime)
    .add(selectedWeek, 'week')
    .startOf('isoWeek')
    .format(format);

export const getFormattedEndOfSelectedWeek = (selectedWeek = 0) => {
  const beginningOfSelectedWeek = moment(currentHourDateTime)
    .add(selectedWeek, 'week')
    .startOf('isoWeek');
  const endOfSelectedWeek = moment(currentHourDateTime)
    .add(selectedWeek, 'week')
    .endOf('isoWeek');

  const areBeginningAndEndSameMonth = moment(beginningOfSelectedWeek).isSame(
    endOfSelectedWeek,
    'month'
  );

  const format = areBeginningAndEndSameMonth ? 'DD' : 'MMMM DD';

  return endOfSelectedWeek.format(format);
};
