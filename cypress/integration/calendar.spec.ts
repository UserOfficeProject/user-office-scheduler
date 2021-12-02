import {
  currentHourDateTime,
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
  before(() => {
    cy.resetDB();
    cy.resetSchedulerDB();
  });

  beforeEach(() => {
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

      cy.wait(1000);

      cy.get('[data-cy="collapsible-event-toolbar"]').should('be.hidden');
      cy.get('[data-cy="collapsible-event-toolbar"]').should(
        'have.css',
        'height',
        '0px'
      );
      cy.get('[data-cy="close-event-toolbar"]').should('not.exist');

      cy.get('[data-cy="open-event-toolbar"]').click();

      cy.wait(1000);

      cy.get('[data-cy="collapsible-event-toolbar"]').should('be.visible');

      cy.get('[data-cy="open-event-toolbar"]').should('not.exist');
    });

    it('should show the selected calendar view', () => {
      cy.get('.rbc-time-view').should('be.visible');

      cy.finishedLoading();

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
      cy.finishedLoading();
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
      cy.finishedLoading();
      const slot = new Date(currentHourDateTime).toISOString();
      cy.get(`.rbc-day-slot [data-cy='event-slot-${slot}']`).scrollIntoView();

      clickOnEventSlot(slot);

      cy.contains(/Warning/i);
      cy.contains(/You have to select an instrument/i);
    });

    it('should create a new event with right input', () => {
      cy.finishedLoading();
      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.finishedLoading();

      const slot = new Date(currentHourDateTime).toISOString();
      cy.get(`.rbc-day-slot [data-cy='event-slot-${slot}']`).scrollIntoView();

      clickOnEventSlot(slot);

      cy.get('[data-cy=startsAt] input').should(
        'have.value',
        currentHourDateTime
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
      cy.finishedLoading();

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.finishedLoading();

      const slot = new Date(currentHourDateTime).toISOString();
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
