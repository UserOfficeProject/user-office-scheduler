import moment, { Moment } from 'moment';

export const TZ_LESS_DATE_TIME_FORMAT = 'yyyy-MM-DD HH:mm:ss';
export const TZ_LESS_DATE_TIME_MASK = '____-__-__ __:__:__';

export const TZ_LESS_DATE_TIME_LOW_PREC_FORMAT = 'yyyy-MM-DD HH:mm';
export const TZ_LESS_DATE_TIME_LOW_PREC_MASK = '____-__-__ __:__';

export const parseTzLessDateTime = (tzLessDateTime: string): Moment =>
  moment(tzLessDateTime, TZ_LESS_DATE_TIME_FORMAT);

export const toTzLessDateTime = (dateTime: Moment | Date | string): string => {
  if (dateTime instanceof Date || typeof dateTime === 'string') {
    dateTime = moment(dateTime);
  }

  return dateTime.format(TZ_LESS_DATE_TIME_FORMAT);
};

export const isStartDateInCurrentMonth = (startDate: string | Date) => {
  return moment(startDate).month() === moment().month();
};

export const getMiddleOfTheMonth = (startDate: string | Date) => {
  const momentDate = moment(startDate);

  return momentDate.startOf('month').add(momentDate.daysInMonth() / 2, 'days');
};
