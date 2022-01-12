import { ScheduledEventBookingType } from '../../src/generated/sdk';
import {
  defaultEventBookingHourDateTime,
  getFormattedBeginningOfSelectedWeek,
  getFormattedEndOfSelectedWeek,
  getFormattedDateAfter,
  getHourDateTimeAfter,
} from '../utils';

function clickOnEventSlot(slot: string) {
  cy.get(`.rbc-day-slot [data-cy='event-slot-${slot}']`).then(($el) => {
    const el = $el[0] as HTMLDivElement;
    const elRect = el.getBoundingClientRect();

    cy.get('.rbc-time-content').then(($tarEl) => {
      const tar = $tarEl[0] as HTMLDivElement;
      const tarRect = tar.getBoundingClientRect();

      const y = elRect.top - tarRect.top + 10;
      const x = elRect.left - tarRect.left;
      cy.get('.rbc-time-content').click(x, y);
    });
  });
}

context('Calendar tests', () => {
  beforeEach(() => {
    cy.resetDB(true);
    cy.resetSchedulerDB(true);
    cy.initializeSession('InstrumentScientist_1');
    cy.visit({
      url: '/calendar',
      timeout: 15000,
    });
  });

  describe('Calendar navigation', () => {
    it('should save calendar state when navigating inside the app but not when reload and visit /calendar', () => {
      cy.finishedLoading();
      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();
      cy.finishedLoading();
      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Timeline"]').click();

      cy.get('.rbc-toolbar button')
        .contains('month', { matchCase: false })
        .click();
      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('today', { matchCase: false })
        .click();
      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('next', { matchCase: false })
        .click();

      cy.finishedLoading();

      cy.contains('Equipment list').click();

      cy.finishedLoading();

      cy.contains('Calendar').click();

      cy.finishedLoading();

      cy.get('[data-cy="calendar-timeline-view"]').should('exist');
      cy.get('.rbc-toolbar button.rbc-active').should('contain.text', 'Month');
      cy.get('.react-calendar-timeline .rct-sidebar-row')
        .should('exist')
        .and('contain.text', 'Instrument 1');

      cy.visit('/calendar');
      cy.finishedLoading();

      cy.get('[data-cy="calendar-timeline-view"]').should('not.exist');
      cy.get('.rbc-toolbar button.rbc-active').should(
        'not.contain.text',
        'Month'
      );
    });

    it('should be able to collapse the event toolbar from the right', () => {
      cy.get('[data-cy="close-event-toolbar"]').click();

      cy.get('[data-cy="collapsible-event-toolbar"]').should('be.hidden');
      cy.get('[data-cy="collapsible-event-toolbar"]').should(
        'have.css',
        'height',
        '0px'
      );
      cy.get('[data-cy="close-event-toolbar"]').should('not.exist');

      cy.get('[data-cy="open-event-toolbar"]').click();

      cy.get('[data-cy="collapsible-event-toolbar"]').should('be.visible');

      cy.get('[data-cy="open-event-toolbar"]').should('not.exist');
    });

    it('should show the selected calendar view', () => {
      cy.get('.rbc-time-view').should('be.visible');

      cy.get('.rbc-toolbar button')
        .contains('month', { matchCase: false })
        .click();

      cy.finishedLoading();

      cy.get('.rbc-month-view').should('be.visible');

      cy.finishedLoading();

      cy.get('.rbc-toolbar button')
        .contains('week', { matchCase: false })
        .click();
      cy.get('.rbc-time-view').should('be.visible');
    });

    it('should show the selected day', () => {
      cy.get('.rbc-toolbar').should(
        'contain.text',
        `${getFormattedBeginningOfSelectedWeek(
          'MMMM DD'
        )} – ${getFormattedEndOfSelectedWeek()}`
      );

      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('next', { matchCase: false })
        .click();
      cy.get('.rbc-toolbar').should(
        'contain.text',
        `${getFormattedBeginningOfSelectedWeek(
          'MMMM DD',
          1
        )} – ${getFormattedEndOfSelectedWeek(1)}`
      );

      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('next', { matchCase: false })
        .click();
      cy.get('.rbc-toolbar').should(
        'contain.text',
        `${getFormattedBeginningOfSelectedWeek(
          'MMMM DD',
          2
        )} – ${getFormattedEndOfSelectedWeek(2)}`
      );

      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('back', { matchCase: false })
        .click();
      cy.get('.rbc-toolbar').should(
        'contain.text',
        `${getFormattedBeginningOfSelectedWeek(
          'MMMM DD',
          1
        )} – ${getFormattedEndOfSelectedWeek(1)}`
      );

      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('today', { matchCase: false })
        .click();
      cy.get('.rbc-toolbar').should(
        'contain.text',
        `${getFormattedBeginningOfSelectedWeek(
          'MMMM DD'
        )} – ${getFormattedEndOfSelectedWeek()}`
      );

      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('back', { matchCase: false })
        .click();
      cy.get('.rbc-toolbar').should(
        'contain.text',
        `${getFormattedBeginningOfSelectedWeek(
          'MMMM DD',
          -1
        )} – ${getFormattedEndOfSelectedWeek(-1)}`
      );

      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('back', { matchCase: false })
        .click();
      cy.get('.rbc-toolbar').should(
        'contain.text',
        `${getFormattedBeginningOfSelectedWeek(
          'MMMM DD',
          -2
        )} – ${getFormattedEndOfSelectedWeek(-2)}`
      );

      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('next', { matchCase: false })
        .click();
      cy.get('.rbc-toolbar').should(
        'contain.text',
        `${getFormattedBeginningOfSelectedWeek(
          'MMMM DD',
          -1
        )} – ${getFormattedEndOfSelectedWeek(-1)}`
      );

      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('today', { matchCase: false })
        .click();
      cy.get('.rbc-toolbar').should(
        'contain.text',
        `${getFormattedBeginningOfSelectedWeek(
          'MMMM DD'
        )} – ${getFormattedEndOfSelectedWeek()}`
      );
    });

    it('should show the selected month', () => {
      cy.get('.rbc-toolbar button')
        .contains('month', { matchCase: false })
        .click();
      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('today', { matchCase: false })
        .click();

      cy.get('.rbc-toolbar').should(
        'contain.text',
        getFormattedDateAfter('MMMM YYYY')
      );

      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('next', { matchCase: false })
        .click();
      cy.get('.rbc-toolbar').should(
        'contain.text',
        getFormattedDateAfter('MMMM YYYY', 1, 'month')
      );

      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('next', { matchCase: false })
        .click();
      cy.get('.rbc-toolbar').should(
        'contain.text',
        getFormattedDateAfter('MMMM YYYY', 2, 'months')
      );

      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('back', { matchCase: false })
        .click();
      cy.get('.rbc-toolbar').should(
        'contain.text',
        getFormattedDateAfter('MMMM YYYY', 1, 'month')
      );

      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('today', { matchCase: false })
        .click();
      cy.get('.rbc-toolbar').should(
        'contain.text',
        getFormattedDateAfter('MMMM YYYY')
      );

      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('back', { matchCase: false })
        .click();
      cy.get('.rbc-toolbar').should(
        'contain.text',
        getFormattedDateAfter('MMMM YYYY', -1, 'month')
      );

      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('back', { matchCase: false })
        .click();
      cy.get('.rbc-toolbar').should(
        'contain.text',
        getFormattedDateAfter('MMMM YYYY', -2, 'months')
      );

      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('next', { matchCase: false })
        .click();
      cy.get('.rbc-toolbar').should(
        'contain.text',
        getFormattedDateAfter('MMMM YYYY', -1, 'month')
      );

      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('today', { matchCase: false })
        .click();
      cy.get('.rbc-toolbar').should(
        'contain.text',
        getFormattedDateAfter('MMMM YYYY')
      );
    });
  });

  describe('Creating new event', () => {
    it('should show warning when no instrument selected', () => {
      const slot = new Date(defaultEventBookingHourDateTime).toISOString();
      cy.get(`.rbc-day-slot [data-cy='event-slot-${slot}']`).scrollIntoView();

      clickOnEventSlot(slot);

      cy.contains(/Warning/i);
      cy.contains(/You have to select an instrument/i);
    });

    it('should be able to select multiple instruments and select instrument on event creation', () => {
      cy.initializeSession('UserOfficer');
      cy.visit({
        url: '/calendar',
        timeout: 15000,
      });

      const newScheduledEvent = {
        instrumentId: 1,
        bookingType: ScheduledEventBookingType.MAINTENANCE,
        startsAt: defaultEventBookingHourDateTime,
        endsAt: getHourDateTimeAfter(1),
        description: 'Test maintenance event on instrument 1',
      };
      cy.createEvent({ input: newScheduledEvent });
      const newScheduledEvent2 = {
        instrumentId: 3,
        bookingType: ScheduledEventBookingType.SHUTDOWN,
        startsAt: getHourDateTimeAfter(2),
        endsAt: getHourDateTimeAfter(3),
        description: 'Test maintenance event on instrument 3',
      };
      cy.createEvent({ input: newScheduledEvent2 });
      cy.finishedLoading();

      cy.get('[data-cy=input-instrument-select]').click();
      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.finishedLoading();

      cy.get('[data-cy=input-instrument-select] input').click();
      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .last()
        .click();

      cy.finishedLoading();

      cy.get('[data-cy=input-instrument-select]').should('contain.text', '+1');

      const slot = new Date(defaultEventBookingHourDateTime).toISOString();
      cy.get(`.rbc-day-slot [data-cy='event-slot-${slot}']`).should('exist');
      const slot1 = new Date(getHourDateTimeAfter(2)).toISOString();
      cy.get(`.rbc-day-slot [data-cy='event-slot-${slot1}']`).should('exist');

      cy.get('[data-cy="btn-new-event"]').click();

      cy.get('[data-cy="instrument"]')
        .should('exist')
        .find('input')
        .should('not.be.disabled');

      cy.get('[data-cy="instrument"]').click();

      cy.get('#menu-instrument ul li').should('have.length', '3');
    });

    it('should create a new event with right input', () => {
      cy.finishedLoading();
      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.finishedLoading();

      const slot = new Date(defaultEventBookingHourDateTime).toISOString();
      cy.get(`.rbc-day-slot [data-cy='event-slot-${slot}']`).scrollIntoView();

      clickOnEventSlot(slot);

      cy.get('[data-cy=startsAt] input').should(
        'have.value',
        defaultEventBookingHourDateTime
      );
      cy.get('[data-cy=endsAt] input').should(
        'have.value',
        getHourDateTimeAfter(1)
      );

      cy.get('[data-cy=bookingType] input').should('have.value', '');

      cy.get('[data-cy=bookingType]').click();

      cy.get('[role=listbox] [role=option]').first().click();

      cy.get('[data-cy=bookingType] input').should('not.have.value', '');

      cy.get('[data-cy=btn-save-event]').click();

      cy.get(`[data-cy='event-${slot}']`).should('exist');
    });
  });

  describe('Viewing existing event', () => {
    it('should display a disabled form', () => {
      const newScheduledEvent = {
        instrumentId: 1,
        bookingType: ScheduledEventBookingType.MAINTENANCE,
        endsAt: getHourDateTimeAfter(1),
        startsAt: defaultEventBookingHourDateTime,
        description: 'Test maintenance event',
      };
      cy.createEvent({ input: newScheduledEvent });
      cy.finishedLoading();
      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.finishedLoading();

      const slot = new Date(defaultEventBookingHourDateTime).toISOString();
      cy.get(`.rbc-day-slot [data-cy='event-slot-${slot}']`).scrollIntoView();

      clickOnEventSlot(slot);

      cy.get('[data-cy=startsAt] input').should('be.disabled');
      cy.get('[data-cy=endsAt] input').should('be.disabled');

      cy.get('[data-cy=bookingType] input').should('not.have.value', '');
      cy.get('[data-cy=bookingType]').click();

      cy.get('[role=listbox] [role=option]').should('not.exist');

      cy.get('[data-cy=btn-save-event]').should('be.disabled');
      cy.get('[data-cy=btn-close-dialog]').should('not.be.disabled');
    });
  });
});
