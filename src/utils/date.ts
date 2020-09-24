import moment, { Moment } from 'moment';

export const TZ_LESS_DATE_TIME_FORMAT = 'yyyy-MM-DD HH:mm:ss';

export function parseTzLessDateTime(tzLessDateTime: string): Moment {
  return moment(tzLessDateTime, TZ_LESS_DATE_TIME_FORMAT);
}

export function toTzLessDateTime(dateTime: Moment | Date): string {
  if (dateTime instanceof Date) {
    dateTime = moment(dateTime);
  }

  return dateTime.format(TZ_LESS_DATE_TIME_FORMAT);
}
