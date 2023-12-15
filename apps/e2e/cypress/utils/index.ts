import moment, { DurationInputArg2, Moment } from 'moment';

export const TZ_LESS_DATE_TIME_FORMAT = 'yyyy-MM-DD HH:mm:ss';
export const TZ_LESS_DATE_TIME_LOW_PREC_FORMAT = 'yyyy-MM-DD HH:mm';

export const toTzLessDateTime = (dateTime: Moment | Date | string): string => {
  if (dateTime instanceof Date || typeof dateTime === 'string') {
    dateTime = moment(dateTime);
  }

  return dateTime.format(TZ_LESS_DATE_TIME_FORMAT);
};

// NOTE: Scheduler default event booking time is 9.00 o'clock
export const getDefaultEventBookingHourDateTime = () => {
  const now = new Date();
  now.setHours(9);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);

  return toTzLessDateTime(now);
};

export const getCurrentHourDateTime = () => {
  const now = new Date();
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);

  return toTzLessDateTime(now);
};

export const defaultEventBookingHourDateTime =
  getDefaultEventBookingHourDateTime();

export const getHourDateTimeAfter = (
  amount: number,
  unit: DurationInputArg2 = 'hour',
  date = defaultEventBookingHourDateTime
) => {
  const defaultEventBookingHourDateTimePlusHours = moment(date).add(
    amount,
    unit
  );

  return toTzLessDateTime(defaultEventBookingHourDateTimePlusHours);
};

export const getHourDateTimeAfterWithoutSpaces = (
  amount: number,
  unit: DurationInputArg2 = 'hour',
  date = defaultEventBookingHourDateTime
) => getHourDateTimeAfter(amount, unit, date).replace(/\s/g, '');

export const getFormattedDateAfter = (
  format = 'DD',
  amount = 0,
  unit: DurationInputArg2 = 'days',
  date = defaultEventBookingHourDateTime
) => moment(date).add(amount, unit).format(format);

export const getFormattedBeginningOfSelectedWeek = (
  format = 'DD',
  selectedWeek = 0
) =>
  moment(defaultEventBookingHourDateTime)
    .add(selectedWeek, 'week')
    .startOf('isoWeek')
    .format(format);

export const getFormattedEndOfSelectedWeek = (selectedWeek = 0) => {
  const beginningOfSelectedWeek = moment(defaultEventBookingHourDateTime)
    .add(selectedWeek, 'week')
    .startOf('isoWeek');
  const endOfSelectedWeek = moment(defaultEventBookingHourDateTime)
    .add(selectedWeek, 'week')
    .endOf('isoWeek');

  const areBeginningAndEndSameMonth = moment(beginningOfSelectedWeek).isSame(
    endOfSelectedWeek,
    'month'
  );

  const format = areBeginningAndEndSameMonth ? 'DD' : 'MMMM DD';

  return endOfSelectedWeek.format(format);
};

export const selectInstrument = (instrument?: string) => {
  cy.get('[data-cy=input-instrument-select] input').should('not.be.disabled');

  cy.get('[data-cy=input-instrument-select]').then((body) => {
    if (body.find('[aria-label="Open"]').length > 0) {
      cy.get('[data-cy=input-instrument-select] [aria-label="Open"]').click();
    }
  });

  if (instrument) {
    cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
      .contains(instrument)
      .click();
  } else {
    cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
      .first()
      .click();
  }
};

export const openProposalBookingFromRightToolbar = () => {
  cy.get('#instrument-calls-tree-view [role=treeitem]').first().click();

  cy.get(
    '#instrument-calls-tree-view [role=treeitem] [role=group] [role=treeitem]'
  )
    .first()
    .click();
};
