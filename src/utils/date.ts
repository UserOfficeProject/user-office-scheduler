import moment, { Moment } from 'moment';

export const TZ_LESS_DATE_TIME_FORMAT = 'yyyy-MM-DD HH:mm:ss';

export const TZ_LESS_DATE_TIME_LOW_PREC_FORMAT = 'yyyy-MM-DD HH:mm';

export function parseTzLessDateTime(tzLessDateTime: string): Moment {
  return moment(tzLessDateTime, TZ_LESS_DATE_TIME_FORMAT);
}

export function toTzLessDateTime(dateTime: Moment | Date | string): string {
  if (dateTime instanceof Date || typeof dateTime === 'string') {
    dateTime = moment(dateTime);
  }

  return dateTime.format(TZ_LESS_DATE_TIME_FORMAT);
}
