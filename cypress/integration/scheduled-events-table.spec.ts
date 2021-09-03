import { currentHourDateTime, getHourDateTimeAfter } from '../utils';

context('Scheduled events table tests', () => {
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

  describe('Scheduled events table', () => {
    it('should be able to switch between scheduled events table view and calendar view', () => {
      cy.get('[data-cy="toggle-table-view"]').click();

      cy.get('[data-cy="scheduled-events-table"]').should('exist');

      cy.get('.rbc-time-view').should('not.exist');

      cy.get('[data-cy="toggle-table-view"]').click();

      cy.get('.rbc-time-view').should('exist');

      cy.get('[data-cy="scheduled-events-table"]').should('not.exist');
    });

    it('should be able to see scheduled events in table view when instrument is selected', () => {
      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.get('#instrument-calls-tree-view [role=treeitem]').first().click();

      cy.get(
        '#instrument-calls-tree-view [role=treeitem] [role=group] [role=treeitem]'
      )
        .first()
        .click();

      cy.get('[data-cy=btn-add-time-slot]').click();

      cy.contains(currentHourDateTime);
      cy.contains(getHourDateTimeAfter(24));

      cy.get('[data-cy=btn-save]').click();

      cy.wait(100);

      cy.get('[data-cy=btn-next]').click();

      cy.contains(/time slots with equipments/i);
      cy.get('[data-cy="btn-close-dialog"]').click();

      cy.get('[data-cy="toggle-table-view"]').click();

      cy.get('[data-cy="scheduled-events-table"]').should('exist');

      cy.get('[data-cy="scheduled-events-table"] table tbody tr').should(
        'have.length.above',
        0
      );

      cy.get('[data-cy="scheduled-events-table"] table tbody tr').should(
        'contain',
        'User operations'
      );

      cy.contains(currentHourDateTime)
        .parent()
        .should('have.css', 'backgroundColor', 'rgb(145, 70, 175)');
      cy.contains(currentHourDateTime)
        .parent()
        .should('have.css', 'opacity', '0.6');
    });

    it('should show table view of events in different colors depending on the event type', () => {
      const newScheduledEvent = {
        instrumentId: '1',
        bookingType: 'MAINTENANCE',
        endsAt: getHourDateTimeAfter(1),
        startsAt: currentHourDateTime,
        description: 'Test maintenance event',
      };
      const newScheduledEvent2 = {
        instrumentId: '1',
        bookingType: 'SHUTDOWN',
        endsAt: getHourDateTimeAfter(-1),
        startsAt: getHourDateTimeAfter(-2),
        description: 'Test shutdown event',
      };
      cy.createEvent(newScheduledEvent);
      cy.createEvent(newScheduledEvent2);

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.get('#instrument-calls-tree-view [role=treeitem]').first().click();

      cy.get('[data-cy="toggle-table-view"]').click();

      cy.get('[data-cy="scheduled-events-table"]').should('exist');

      cy.contains(getHourDateTimeAfter(1))
        .parent()
        .should('have.css', 'backgroundColor', 'rgb(255, 166, 158)');

      cy.contains(getHourDateTimeAfter(-1))
        .parent()
        .should('have.css', 'backgroundColor', 'rgb(170, 68, 101)');
    });
  });
});
