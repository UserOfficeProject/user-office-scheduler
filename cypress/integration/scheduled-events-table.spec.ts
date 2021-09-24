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
    const newScheduledEvent_1 = {
      instrumentId: '1',
      bookingType: 'MAINTENANCE',
      startsAt: currentHourDateTime,
      endsAt: getHourDateTimeAfter(1),
      description: 'Test maintenance event',
    };
    const newScheduledEvent_2 = {
      instrumentId: '1',
      bookingType: 'SHUTDOWN',
      startsAt: getHourDateTimeAfter(-2),
      endsAt: getHourDateTimeAfter(-1),
      description: 'Test shutdown event',
    };
    const newScheduledEvent_3 = {
      instrumentId: '1',
      bookingType: 'MAINTENANCE',
      startsAt: getHourDateTimeAfter(8, 'days'),
      endsAt: getHourDateTimeAfter(9, 'days'),
      description: 'Test maintenance event',
    };
    it('should be able to switch between scheduled events table view and calendar view', () => {
      cy.get('[data-cy="toggle-table-view"]').click();

      cy.get('[data-cy="scheduled-events-table"]').should('exist');

      cy.get('.rbc-time-view').should('not.exist');

      cy.get('[data-cy="toggle-table-view"]').click();

      cy.get('.rbc-time-view').should('exist');

      cy.get('[data-cy="scheduled-events-table"]').should('not.exist');
    });

    it('should be able to see scheduled events in table view when instrument is selected', () => {
      cy.finishedLoading();
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

      cy.get('[title="Add time slot"]').click();

      cy.contains(currentHourDateTime);
      cy.contains(getHourDateTimeAfter(24));

      cy.wait(100);

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
        .should('have.attr', 'style')
        .and('include', 'background-color: rgba(');
    });

    it('should show table view of events in different colors depending on the event type', () => {
      cy.finishedLoading();
      cy.createEvent(newScheduledEvent_1);
      cy.createEvent(newScheduledEvent_2);

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.get('#instrument-calls-tree-view [role=treeitem]').first().click();

      cy.get('[data-cy="toggle-table-view"]').click();

      cy.get('[data-cy="scheduled-events-table"]').should('exist');

      cy.contains(newScheduledEvent_1.endsAt)
        .parent()
        .should('have.attr', 'style')
        .and('include', 'background-color: rgb(');

      cy.contains(newScheduledEvent_2.endsAt)
        .parent()
        .should('have.attr', 'style')
        .and('include', 'background-color: rgb(');
    });

    it('should be able to filter events based on the table toolbar filters', () => {
      cy.finishedLoading();
      cy.createEvent(newScheduledEvent_3);

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.get('#instrument-calls-tree-view [role=treeitem]').first().click();

      cy.get('[data-cy="toggle-table-view"]').click();

      cy.get('[data-cy="scheduled-events-table"]').should('exist');

      cy.get('[data-cy=table-toolbar-instrument-select]').should('exist');
      cy.get('[data-cy=table-toolbar-equipment-select]').should('exist');
      cy.get('[data-cy=table-toolbar-startsAt]').should('exist');
      cy.get('[data-cy=table-toolbar-endsAt]').should('exist');

      cy.contains(newScheduledEvent_1.endsAt);

      cy.get('[data-cy="scheduled-events-table"]').should(
        'not.contain',
        newScheduledEvent_3.startsAt
      );

      cy.get('[data-cy=table-toolbar-endsAt] input').clear();

      cy.get('[data-cy=table-toolbar-endsAt] input').type(
        getHourDateTimeAfter(9, 'days')
      );

      cy.finishedLoading();

      cy.contains(newScheduledEvent_1.endsAt);
      cy.contains(newScheduledEvent_3.startsAt);

      cy.get('[data-cy=table-toolbar-startsAt] input').clear();

      cy.get('[data-cy=table-toolbar-startsAt] input').type(
        getHourDateTimeAfter(-10, 'days')
      );

      cy.get('[data-cy=table-toolbar-endsAt] input').clear();

      cy.get('[data-cy=table-toolbar-endsAt] input').type(
        getHourDateTimeAfter(-5, 'days')
      );

      cy.get('[data-cy="scheduled-events-table"]').should(
        'not.contain',
        newScheduledEvent_1.endsAt
      );

      cy.get('[data-cy="scheduled-events-table"]').should(
        'contain.text',
        'No records to display'
      );
    });

    it('should be able to click and open events in table view', () => {
      cy.finishedLoading();

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.get('#instrument-calls-tree-view [role=treeitem]').first().click();

      cy.get('[data-cy="toggle-table-view"]').click();

      cy.contains(newScheduledEvent_1.endsAt)
        .parent()
        .find('[title="View event"]')
        .click();

      cy.get('[role="none presentation"] [data-cy="startsAt"]').should('exist');
      cy.get('[role="none presentation"] [data-cy="endsAt"]').should('exist');
      cy.get('[role="none presentation"] [data-cy="bookingType"]').should(
        'exist'
      );

      cy.get('[data-cy="btn-close-dialog"]').click();

      cy.contains('User operations')
        .first()
        .parent()
        .find('[title="View event"]')
        .click();

      cy.get(
        '[role="none presentation"] [data-cy="btn-close-event-dialog"]'
      ).should('exist');

      cy.get('[role="none presentation"] [data-cy="btn-save"]').should('exist');
      cy.get('[role="none presentation"] [data-cy="btn-next"]').should('exist');
    });

    it('should be able to filter events based on the table toolbar filters', () => {
      cy.finishedLoading();
      const newScheduledEvent = {
        instrumentId: '1',
        bookingType: 'MAINTENANCE',
        endsAt: getHourDateTimeAfter(9, 'days'),
        startsAt: getHourDateTimeAfter(8, 'days'),
        description: 'Test maintenance event',
      };
      cy.createEvent(newScheduledEvent);

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.get('#instrument-calls-tree-view [role=treeitem]').first().click();

      cy.get('[data-cy="toggle-table-view"]').click();

      cy.get('[data-cy="scheduled-events-table"]').should('exist');

      cy.get('[data-cy=table-toolbar-instrument-select]').should('exist');
      cy.get('[data-cy=table-toolbar-equipment-select]').should('exist');
      cy.get('[data-cy=table-toolbar-startsAt]').should('exist');
      cy.get('[data-cy=table-toolbar-endsAt]').should('exist');

      cy.contains(getHourDateTimeAfter(1));

      cy.get('[data-cy="scheduled-events-table"]').should(
        'not.contain',
        getHourDateTimeAfter(8, 'days')
      );

      cy.get('[data-cy=table-toolbar-endsAt] input').clear();

      cy.get('[data-cy=table-toolbar-endsAt] input').type(
        getHourDateTimeAfter(9, 'days')
      );

      cy.finishedLoading();

      cy.contains(getHourDateTimeAfter(1));
      cy.contains(getHourDateTimeAfter(8, 'days'));

      cy.get('[data-cy=table-toolbar-startsAt] input').clear();

      cy.get('[data-cy=table-toolbar-startsAt] input').type(
        getHourDateTimeAfter(-10, 'days')
      );

      cy.get('[data-cy=table-toolbar-endsAt] input').clear();

      cy.get('[data-cy=table-toolbar-endsAt] input').type(
        getHourDateTimeAfter(-5, 'days')
      );

      cy.get('[data-cy="scheduled-events-table"]').should(
        'not.contain',
        getHourDateTimeAfter(1)
      );

      cy.get('[data-cy="scheduled-events-table"]').should(
        'contain.text',
        'No records to display'
      );
    });

    it('should not reset dates if instrument is changed in filters', () => {
      cy.initializeSession('UserOfficer');
      cy.finishedLoading();

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.get('#instrument-calls-tree-view [role=treeitem]').first().click();

      cy.get('[data-cy="toggle-table-view"]').click();

      cy.get('[data-cy="scheduled-events-table"]').should('exist');

      cy.get('[data-cy=table-toolbar-endsAt] input').clear();

      cy.get('[data-cy=table-toolbar-endsAt] input').type(
        getHourDateTimeAfter(9, 'days')
      );

      cy.finishedLoading();

      cy.get('[data-cy=table-toolbar-instrument-select]').click();
      cy.get(
        '[aria-labelledby=table-toolbar-instrument-select-label] [role=option]'
      )
        .last()
        .click();

      cy.finishedLoading();

      cy.get('[data-cy=table-toolbar-endsAt] input').should(
        'have.value',
        getHourDateTimeAfter(9, 'days').split(' ')[0]
      );

      cy.reload();

      cy.finishedLoading();

      cy.get('[data-cy="toggle-table-view"]').click();

      cy.get('[data-cy=table-toolbar-endsAt] input').should(
        'have.value',
        getHourDateTimeAfter(9, 'days').split(' ')[0]
      );
    });
  });
});
