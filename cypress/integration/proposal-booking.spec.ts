beforeEach(() => {
  cy.initializeSession();

  cy.visit({
    url: '/calendar',
    timeout: 15000,
  });
});

describe('Proposal booking calls/proposals list', () => {
  it('should inform the user if the instrument has no calls', () => {
    cy.get('[data-cy=input-instrument-select]').click();

    cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
      .first()
      .click();

    cy.get('[data-cy=btn-new-event]').should('exist');
    cy.contains(/instrument has no calls/i);
  });

  it('should show the list of calls of the instrument has calls', () => {
    cy.get('[data-cy=input-instrument-select]').click();

    cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
      .eq(1)
      .click();

    cy.get('[data-cy=btn-new-event]').should('exist');
    cy.should('not.contain', /instrument has no calls/i);

    cy.contains(/call: call 1/i);
  });
});

describe('Proposal booking workflow', () => {
  beforeEach(() => {
    cy.get('[data-cy=input-instrument-select]').click();

    cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
      .eq(1)
      .click();

    cy.get('#instrument-calls-tree-view [role=treeitem]')
      .first()
      .click();

    cy.get(
      '#instrument-calls-tree-view [role=treeitem] [role=group] [role=treeitem] svg'
    )
      .first()
      .click();
  });

  it('should be able to add new time slot', () => {
    cy.get('[data-cy=btn-add-time-slot]').click();

    cy.contains(/2020-09-21 14:00:00/);
    cy.contains(/2020-09-21 15:00:00/);

    cy.get('[data-cy=btn-save]').click();

    cy.wait(100);

    cy.get('[data-cy=btn-next]').click();

    cy.contains(/not implemented yet/i);
  });

  it('should be able to edit time slot', () => {
    cy.get('[data-cy=btn-time-table-edit-row]').click();

    cy.get('[data-cy=startsAt] input').clear();
    cy.get('[data-cy=endsAt] input').clear();

    cy.get('[data-cy=btn-time-table-save-row]').click();

    cy.get('[data-cy=startsAt] input').type('2020-08-23 12:00:00');
    cy.get('[data-cy=endsAt] input').type('2020-08-23 13:00:00');

    cy.get('[data-cy=btn-time-table-save-row]').click();

    cy.contains('2020-08-23 12:00:00');
    cy.contains('2020-08-23 13:00:00');

    cy.get('[data-cy=btn-time-table-edit-row]').click();

    cy.get('[data-cy=startsAt] input')
      .clear()
      .type('2020-08-25 12:00:00');
    cy.get('[data-cy=endsAt] input')
      .clear()
      .type('2020-08-25 13:00:00');

    cy.get('[data-cy=btn-time-table-reset-row]').click();

    cy.contains('2020-08-23 12:00:00');
    cy.contains('2020-08-23 13:00:00');
  });

  it('should be able to delete time slot', () => {
    cy.get('[data-cy=enhanced-table-checkbox-0]').click();

    cy.get('[data-cy=btn-delete]').click();

    cy.contains(/no records to show/i);

    cy.get('[data-cy=btn-add-time-slot]').click();
    cy.get('[data-cy=btn-add-time-slot]').click();

    cy.get('[data-cy=enhanced-table-checkbox-0]').should('exist');
    cy.get('[data-cy=enhanced-table-checkbox-1]').should('exist');

    cy.get('[aria-label="select all"]').click();

    cy.contains(/2 selected/i);

    cy.get('[data-cy=btn-delete]').click();

    cy.contains(/no records to show/i);
  });

  it('should show warning when `startsAt` is after `endsAt`', () => {
    cy.get('[data-cy=btn-time-table-edit-row]').click();

    cy.get('[data-cy=startsAt] input')
      .clear()
      .type('2020-08-25 12:00:00');
    cy.get('[data-cy=endsAt] input')
      .clear()
      .type('2020-08-23 13:00:00');

    cy.get('[data-cy=btn-time-table-save-row]').click();

    cy.contains(/warning/i);
    cy.contains(/the starting date needs to be before the ending date/i);
  });

  it('should show confirmation when there are overlapping events', () => {
    cy.get('[data-cy=btn-add-time-slot]').click();

    cy.get('[data-cy=btn-save]').click();

    cy.contains(/confirmation/i);
    cy.contains(/you have overlapping bookings/i);
  });

  it('should request confirmation to activate proposal booking', () => {
    cy.get('[data-cy=btn-next]').click();
    cy.get('[data-cy=btn-next]').click();

    cy.contains(/warning/i);
    cy.contains(/activate booking/i).as('activateBookingBtn');

    cy.get('@activateBookingBtn').should('be.disabled');

    cy.contains(/i wish to proceed/i).click();

    cy.get('@activateBookingBtn')
      .should('not.be.disabled')
      .click();

    cy.wait(100);

    cy.contains(/lost time/i);
  });

  it('should be able to log lost time', () => {
    cy.get('[data-cy=btn-add-lost-time]').click();

    cy.contains(/2020-09-21 14:00:00/);
    cy.contains(/2020-09-21 15:00:00/);

    cy.get('[data-cy=btn-save]').click();

    cy.contains(/2020-09-21 14:00:00/);
    cy.contains(/2020-09-21 15:00:00/);
  });

  it('should be able to restart the booking process', () => {
    cy.contains(/warning/i);

    cy.contains(/close proposal booking/i).should('be.disabled');

    cy.get('[aria-label=proposal-booking-finalization-strategy]').click();

    cy.contains(/restart the booking process/i).click();
    cy.wait(100);

    cy.contains(/restart the booking process/i).as('restartBooking');

    cy.get('@restartBooking').should('be.disabled');

    cy.contains(/i wish to proceed/i).click();

    cy.get('@restartBooking')
      .should('not.be.disabled')
      .click();

    cy.wait(500);

    cy.get('[data-cy=btn-add-time-slot]').should('exist');
  });

  it('should be able to go through the process again after restarting', () => {
    cy.get('[data-cy=btn-next]').click();
    cy.get('[data-cy=btn-next]').click();

    cy.contains(/warning/i);
    cy.contains(/activate booking/i).as('activateBookingBtn');

    cy.get('@activateBookingBtn').should('be.disabled');

    cy.contains(/i wish to proceed/i).click();

    cy.get('@activateBookingBtn')
      .should('not.be.disabled')
      .click();

    cy.wait(500);
  });

  it('should be able to edit lost time', () => {
    cy.get('[data-cy=btn-time-table-edit-row]').click();

    cy.get('[data-cy=startsAt] input').clear();
    cy.get('[data-cy=endsAt] input').clear();

    cy.get('[data-cy=btn-time-table-save-row]').click();

    cy.get('[data-cy=startsAt] input').type('2020-08-23 12:00:00');
    cy.get('[data-cy=endsAt] input').type('2020-08-23 13:00:00');

    cy.get('[data-cy=btn-time-table-save-row]').click();

    cy.contains('2020-08-23 12:00:00');
    cy.contains('2020-08-23 13:00:00');

    cy.get('[data-cy=btn-time-table-edit-row]').click();

    cy.get('[data-cy=startsAt] input')
      .clear()
      .type('2020-08-25 12:00:00');
    cy.get('[data-cy=endsAt] input')
      .clear()
      .type('2020-08-25 13:00:00');

    cy.get('[data-cy=btn-time-table-reset-row]').click();

    cy.contains('2020-08-23 12:00:00');
    cy.contains('2020-08-23 13:00:00');
  });

  it('should be able to delete lost time', () => {
    cy.get('[data-cy=enhanced-table-checkbox-0]').click();

    cy.get('[data-cy=btn-delete]').click();

    cy.contains(/no records to show/i);

    cy.get('[data-cy=btn-add-lost-time]').click();
    cy.get('[data-cy=btn-add-lost-time]').click();

    cy.get('[data-cy=enhanced-table-checkbox-0]').should('exist');
    cy.get('[data-cy=enhanced-table-checkbox-1]').should('exist');

    cy.get('[aria-label="select all"]').click();

    cy.contains(/2 selected/i);

    cy.get('[data-cy=btn-delete]').click();

    cy.contains(/no records to show/i);
  });

  it('should show warning when `startsAt` is after `endsAt`', () => {
    cy.get('[data-cy=btn-time-table-edit-row]').click();

    cy.get('[data-cy=startsAt] input').clear();
    cy.get('[data-cy=endsAt] input').clear();

    cy.get('[data-cy=startsAt] input').type('2020-08-25 12:00:00');
    cy.get('[data-cy=endsAt] input').type('2020-08-23 13:00:00');

    cy.get('[data-cy=btn-time-table-save-row]').click();

    cy.contains(/warning/i);
    cy.contains(/the starting date needs to be before the ending date/i);
  });

  it('should show confirmation when there are overlapping lost time events', () => {
    cy.get('[data-cy=btn-add-lost-time]').click();

    cy.get('[data-cy=btn-save]').click();

    cy.contains(/confirmation/i);
    cy.contains(/you have overlapping events/i);
  });

  it('should be able to close the booking process', () => {
    cy.contains(/warning/i);

    cy.contains(/close proposal booking/i).as('closeBooking');

    cy.get('@closeBooking').should('be.disabled');

    cy.contains(/i wish to proceed/i).click();

    cy.get('@closeBooking')
      .should('not.be.disabled')
      .click();

    cy.wait(500);

    cy.contains(/Proposal booking is already closed, you can not edit it/i);
  });
});
