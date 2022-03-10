import { ScheduledEventBookingType } from '../../src/generated/sdk';
import {
  defaultEventBookingHourDateTime,
  getHourDateTimeAfter,
} from '../utils';

context('Permission tests', () => {
  beforeEach(() => {
    cy.resetDB(true);
    cy.resetSchedulerDB(true);
    cy.clearCookies();
    cy.configureClock();
  });

  describe('Users with wrong roles', () => {
    it('should show the `Not authenticated` page', () => {
      cy.configureSession('NotUserInstrumentScientist');

      cy.visit('/calendar');

      cy.url().should('include', '/not-authenticated');
      cy.contains(/you are not authenticated/i);
      cy.contains(/click here to authenticate/i);
    });
  });

  describe('Users with right roles', () => {
    it('should show all instruments for user with `User officer` role', () => {
      cy.configureSession('UserOfficer');

      cy.visit('/calendar');

      cy.finishedLoading();

      cy.get('[data-cy=input-instrument-select] input').should(
        'not.be.disabled'
      );

      cy.get('[data-cy=input-instrument-select] [aria-label="Open"]').click();

      cy.get('[aria-labelledby=input-instrument-select-label]').as(
        'instruments'
      );

      cy.get('@instruments').children().should('have.length', 3);
      cy.get('@instruments')
        .children()
        .contains(/instrument 1/i);
      cy.get('@instruments')
        .children()
        .contains(/instrument 2/i);
      cy.get('@instruments')
        .children()
        .contains(/instrument 3/i);
    });

    it('should show only assigned instruments for user with `Instrument scientist` role', () => {
      cy.configureSession('InstrumentScientist_1');

      cy.visit('/calendar');

      cy.finishedLoading();

      cy.get('[data-cy=input-instrument-select] input').should(
        'not.be.disabled'
      );

      cy.get('[data-cy=input-instrument-select] [aria-label="Open"]').click();

      cy.get('[aria-labelledby=input-instrument-select-label]').as(
        'instruments'
      );

      cy.get('@instruments').children().should('have.length', 1);
      cy.get('@instruments')
        .children()
        .contains(/instrument 1/i);

      cy.configureSession('InstrumentScientist_2');
      cy.visit('/calendar');

      cy.finishedLoading();

      cy.get('[data-cy=input-instrument-select] input').should(
        'not.be.disabled'
      );

      cy.get('[data-cy=input-instrument-select] [aria-label="Open"]').click();

      cy.get('[aria-labelledby=input-instrument-select-label]').as(
        'instruments'
      );

      cy.get('@instruments').children().should('have.length', 1);

      cy.get('@instruments')
        .children()
        .contains(/instrument 2/i);
    });

    it('should show only scheduled events assigned to specific instrument', () => {
      const newScheduledEvent = {
        instrumentId: 1,
        bookingType: ScheduledEventBookingType.MAINTENANCE,
        endsAt: getHourDateTimeAfter(1),
        startsAt: defaultEventBookingHourDateTime,
        description: 'Test maintenance event',
      };
      const newScheduledEvent2 = {
        instrumentId: 2,
        bookingType: ScheduledEventBookingType.MAINTENANCE,
        endsAt: getHourDateTimeAfter(-1),
        startsAt: getHourDateTimeAfter(-2),
        description: 'Test maintenance event 2',
      };
      cy.createEvent({ input: newScheduledEvent });
      cy.createEvent({ input: newScheduledEvent2 });

      cy.configureSession('InstrumentScientist_1');

      cy.visit('/calendar?instrument=1');

      let scheduledEventSlot = new Date(
        defaultEventBookingHourDateTime
      ).toISOString();
      cy.get(`.rbc-event [data-cy='event-${scheduledEventSlot}']`).should(
        'exist'
      );
      let scheduledEventSlot2 = new Date(
        getHourDateTimeAfter(-2)
      ).toISOString();
      cy.get(`.rbc-event [data-cy='event-${scheduledEventSlot2}']`).should(
        'not.exist'
      );

      cy.configureSession('InstrumentScientist_2');
      cy.visit('/calendar?instrument=2');

      scheduledEventSlot = new Date(
        defaultEventBookingHourDateTime
      ).toISOString();
      cy.get(`.rbc-event [data-cy='event-${scheduledEventSlot}']`).should(
        'not.exist'
      );
      scheduledEventSlot2 = new Date(getHourDateTimeAfter(-2)).toISOString();
      cy.get(`.rbc-event [data-cy='event-${scheduledEventSlot2}']`).should(
        'exist'
      );
    });
  });
});
