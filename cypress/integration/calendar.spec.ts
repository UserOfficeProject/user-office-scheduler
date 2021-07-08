function clickOnEventSlot(slot: string) {
  cy.get(`[data-cy='event-slot-${slot}']`).then(($el) => {
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

      cy.wait(500);

      cy.get('[data-cy=select-active-view]').click();
      cy.get('[role=listbox] [role=option][data-value="month"]').click();

      cy.wait(500);

      cy.get('.rbc-month-view').should('be.visible');

      cy.wait(500);

      cy.get('[data-cy=select-active-view]').click();
      cy.get('[role=listbox] [role=option][data-value="week"]').click();
      cy.get('.rbc-time-view').should('be.visible');
    });

    it('should show the selected day', () => {
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'September 21 – 27'
      );

      cy.wait(500);
      cy.get('[data-cy=btn-view-next]').click();
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'September 28 – October 04'
      );

      cy.wait(500);
      cy.get('[data-cy=btn-view-next]').click();
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'October 05 – 11'
      );

      cy.wait(500);
      cy.get('[data-cy=btn-view-prev]').click();
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'September 28 – October 04'
      );

      cy.wait(500);
      cy.get('[data-cy=btn-view-today]').click();
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'September 21 – 27'
      );

      cy.wait(500);
      cy.get('[data-cy=btn-view-prev]').click();
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'September 14 – 20'
      );

      cy.wait(500);
      cy.get('[data-cy=btn-view-prev]').click();
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'September 07 – 13'
      );

      cy.wait(500);
      cy.get('[data-cy=btn-view-next]').click();
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'September 14 – 20'
      );

      cy.wait(500);
      cy.get('[data-cy=btn-view-today]').click();
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'September 21 – 27'
      );
    });

    it('should show the selected month', () => {
      cy.get('[data-cy=select-active-view]').click();

      cy.get('[role=listbox] [role=option][data-value="month"]').click();

      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'September 2020'
      );

      cy.wait(500);
      cy.get('[data-cy=btn-view-next]').click();
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'October 2020'
      );

      cy.wait(500);
      cy.get('[data-cy=btn-view-next]').click();
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'November 2020'
      );

      cy.wait(500);
      cy.get('[data-cy=btn-view-prev]').click();
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'October 2020'
      );

      cy.wait(500);
      cy.get('[data-cy=btn-view-today]').click();
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'September'
      );

      cy.wait(500);
      cy.get('[data-cy=btn-view-prev]').click();
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'August 2020'
      );

      cy.wait(500);
      cy.get('[data-cy=btn-view-prev]').click();
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'July'
      );

      cy.wait(500);
      cy.get('[data-cy=btn-view-next]').click();
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'August 2020'
      );

      cy.wait(500);
      cy.get('[data-cy=btn-view-today]').click();
      cy.get('[data-cy=content-calendar-toolbar]').should(
        'contain.text',
        'September'
      );
    });
  });

  describe('Creating new event', () => {
    it('should show warning when no instrument selected', () => {
      //
      const slot = new Date(2020, 8, 25, 14, 0, 0).toISOString();
      cy.get(`[data-cy='event-slot-${slot}']`).scrollIntoView();

      clickOnEventSlot(slot);

      cy.contains(/Warning/i);
      cy.contains(/You have to select an instrument/i);
    });

    it('should create a new event with right input', () => {
      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      const slot = new Date(2020, 8, 25, 14, 0, 0).toISOString();
      cy.get(`[data-cy='event-slot-${slot}']`).scrollIntoView();

      clickOnEventSlot(slot);

      cy.get('[data-cy=startsAt] input').should(
        'have.value',
        '2020-09-25 14:00:00'
      );
      cy.get('[data-cy=endsAt] input').should(
        'have.value',
        '2020-09-25 15:00:00'
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
      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      const slot = new Date(2020, 8, 25, 14, 0, 0).toISOString();
      cy.get(`[data-cy='event-slot-${slot}']`).scrollIntoView();

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
