import { currentHourDateTime, getHourDateTimeAfter } from '../utils';

context('Permission tests', () => {
  before(() => {
    cy.resetDB();
    cy.resetSchedulerDB();
  });

  beforeEach(() => {
    cy.clearCookies();
    cy.configureClock();
  });

  describe('Users with wrong roles', () => {
    it('should show the `Not authenticated` page', () => {
      cy.configureSession('NotUserInstrumentScientist');

      cy.visit({
        url: '/calendar',
        timeout: 15000,
      });

      cy.url().should('include', '/not-authenticated');
      cy.contains(/you are not authenticated/i);
      cy.contains(/click here to authenticate/i);
    });
  });

  describe('Users with right roles', () => {
    it('should show all instruments for user with `User officer` role', () => {
      cy.configureSession('UserOfficer');

      cy.visit({
        url: '/calendar',
        timeout: 15000,
      });

      cy.finishedLoading();

      cy.get('[data-cy=input-instrument-select]').click();

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

      cy.visit({
        url: '/calendar',
        timeout: 15000,
      });

      cy.finishedLoading();

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label]').as(
        'instruments'
      );

      cy.get('@instruments').children().should('have.length', 1);
      cy.get('@instruments')
        .children()
        .contains(/instrument 1/i);

      cy.configureSession('InstrumentScientist_2');
      cy.visit({
        url: '/calendar',
        timeout: 15000,
      });

      cy.finishedLoading();

      cy.get('[data-cy=input-instrument-select]').click();

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
        instrumentId: '1',
        bookingType: 'MAINTENANCE',
        endsAt: getHourDateTimeAfter(1),
        startsAt: currentHourDateTime,
        description: 'Test maintenance event',
      };
      const newScheduledEvent2 = {
        instrumentId: '2',
        bookingType: 'MAINTENANCE',
        endsAt: getHourDateTimeAfter(-1),
        startsAt: getHourDateTimeAfter(-2),
        description: 'Test maintenance event 2',
      };
      cy.createEvent(newScheduledEvent);
      cy.createEvent(newScheduledEvent2);

      cy.configureSession('InstrumentScientist_1');

      cy.visit({
        url: '/calendar?instrument=1',
        timeout: 15000,
      });

      let scheduledEventSlot = new Date(currentHourDateTime).toISOString();
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
      cy.visit({
        url: '/calendar?instrument=2',
        timeout: 15000,
      });

      scheduledEventSlot = new Date(currentHourDateTime).toISOString();
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
