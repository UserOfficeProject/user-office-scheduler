context('Proposal booking tests ', () => {
  before(() => {
    cy.resetDB();
    cy.resetSchedulerDB();
  });

  describe('Proposal booking calls/proposals list', () => {
    it('should inform the user if the instrument has no calls', () => {
      cy.initializeSession('InstrumentScientist_2');

      cy.visit({
        url: '/calendar',
        timeout: 15000,
      });

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.get('[data-cy=btn-new-event]').should('exist');
      cy.contains(/instrument has no calls/i);
    });

    it('should show the list of calls of the instrument has calls', () => {
      cy.initializeSession('InstrumentScientist_1');

      cy.visit({
        url: '/calendar',
        timeout: 15000,
      });

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.get('[data-cy=btn-new-event]').should('exist');
      cy.should('not.contain', /instrument has no calls/i);

      cy.contains(/call: call 1/i);
    });

    it('should not crash if the referenced proposal was deleted', () => {
      cy.initializeSession('UserOfficer');

      cy.visit({
        url: '/calendar',
        timeout: 15000,
      });

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label]')
        .contains('Instrument 3')
        .click();

      cy.get('[data-cy=btn-new-event]').should('exist');
      cy.contains(/instrument has no calls/i);
    });
  });

  describe('Proposal booking workflow', () => {
    beforeEach(() => {
      cy.initializeSession('InstrumentScientist_1');

      cy.visit({
        url: '/calendar',
        timeout: 15000,
      });

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
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

    describe('Book events step', () => {
      it('should be able to add new time slot', () => {
        cy.get('[data-cy=btn-add-time-slot]').click();

        cy.contains(/2020-09-21 14:00:00/);
        cy.contains(/2020-09-21 15:00:00/);

        cy.get('[data-cy=btn-save]').click();

        cy.wait(100);

        cy.get('[data-cy=btn-next]').click();

        cy.contains(/time slots with equipments/i);
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

      it('should display time allocation left', () => {
        cy.contains('1 day, 23 hours left');
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

        cy.get('[data-cy=btn-time-table-edit-row]')
          .last()
          .click();

        cy.get('[data-cy=startsAt] input')
          .clear()
          .type('2020-09-21 14:00:00');
        cy.get('[data-cy=endsAt] input')
          .clear()
          .type('2020-09-21 15:00:00');

        cy.get('[data-cy=btn-time-table-save-row]').click();

        cy.get('[data-cy=btn-save]').click();

        cy.contains(/confirmation/i);
        cy.contains(/you have overlapping bookings/i);
      });
    });

    describe('Equipment booking step', () => {
      beforeEach(() => {
        cy.get('[data-cy=btn-next]').click();

        cy.contains(/time slots with equipments/i);
      });

      it('should be able to navigate using tabs', () => {
        cy.get('[data-cy="booking-step-BOOK_EVENTS"]').click();
        cy.contains('Save draft');
      });

      it('should be able to assign available equipments to time slot', () => {
        cy.contains(/no records to show/i);

        cy.get('[data-cy=btn-book-equipment]').click();

        cy.contains(/2020-09-21 14:00:00/);
        cy.contains(/2020-09-21 15:00:00/);

        cy.get('[data-cy=btn-assign-to-scheduled-event').click();

        cy.contains(/1-5 of 5/i);

        cy.contains(/Available equipment 1 - no auto accept/i);
        cy.contains(/Available equipment 2 - auto accept/i);
        cy.contains(/Under maintenance indefinitely 1 - not started yet/i);
        cy.contains(/Under maintenance 1 - not started yet/i);
        cy.contains(/Under maintenance 3 - finished/i);

        cy.get('[data-cy=enhanced-table-checkbox-0]').click();
        cy.get('[data-cy=enhanced-table-checkbox-1]').click();
        cy.get('[data-cy=btn-assign-all]').click();

        cy.contains(/2020-09-21 14:00:00/);
        cy.contains(/2020-09-21 15:00:00/);
      });

      it('should not show already assigned equipments', () => {
        cy.get('[data-cy=btn-book-equipment]').click();

        cy.get('[data-cy=btn-assign-to-scheduled-event').click();

        cy.contains(/1-3 of 3/i);
      });

      it('should show the assignment status', () => {
        cy.contains(/2020-09-21 14:00:00/);
        cy.contains(/2020-09-21 15:00:00/);

        cy.get('[data-cy=btn-expand-row]').click();

        cy.contains(/Available equipment 1 - no auto accept/i);
        cy.contains(/Available equipment 2 - auto accept/i);

        cy.get('[aria-label=equipments] tbody [role=row]').as('row');

        cy.get('@row')
          .eq(0)
          .find('[data-cy=equipment-row-status]')
          .contains(/pending/i);

        cy.get('@row')
          .eq(1)
          .find('[data-cy=equipment-row-status]')
          .contains(/accepted/i);
      });

      it('should be able to accept / reject assignment request', () => {
        cy.visit('/equipments');

        cy.contains(/Available equipment 1 - no auto accept/i)
          .parent()
          .find('[data-cy=btn-view-equipment]')
          .click();

        cy.contains(/Available equipment 1 - no auto accept/i);

        cy.contains(/2020-09-21 14:00:00/);
        cy.contains(/2020-09-21 15:00:00/);

        cy.get('[data-cy=btn-confirm-assignment-accept]').click();

        cy.contains(/confirmation/i);
        cy.contains(/Are you sure you want to accept the request?/i);
        cy.get('[data-cy=btn-cancel]').click();

        cy.get('[data-cy=btn-confirm-assignment-reject]').click();

        cy.contains(/confirmation/i);
        cy.contains(/Are you sure you want to reject the request?/i);
        cy.get('[data-cy=btn-ok]').click();

        cy.get('[role=alert]').contains(/success/i);
      });

      it('should be able to remove assigned equipment', () => {
        cy.get('[data-cy=btn-expand-row]').click();

        cy.get('[aria-label=equipments] tbody [role=row]').as('row');

        cy.get('@row')
          .eq(0)
          .find('[data-cy=equipment-row-status]')
          .contains(/rejected/i);

        cy.get('@row')
          .eq(1)
          .find('[data-cy=equipment-row-status]')
          .contains(/accepted/i);

        cy.get('@row')
          .first()
          .as('firstRow');

        cy.get('@firstRow').contains(/Available equipment 1 - no auto accept/i);

        cy.get('@firstRow')
          .find('[data-cy=btn-delete-assignment]')
          .as('firstRowDeleteBtn');

        cy.get('@firstRowDeleteBtn').click();

        cy.contains(/confirmation/i);
        cy.contains(/you want to remove the selected equipment/i);

        cy.get('[data-cy=btn-cancel]').click();
        cy.get('[data-cy=btn-ok]').click();

        cy.get('@firstRowDeleteBtn').click();

        cy.contains(/confirmation/i);

        cy.get('[data-cy=btn-ok]').click();

        cy.get('[role=alert]').contains(/removed/i);
        cy.wait(100);
        cy.get('@firstRow').contains(/Available equipment 2 - auto accept/i);
      });

      it('should show the assigned time slot on the equipment page', () => {
        cy.visit('/equipments');
        cy.contains(/Available equipment 2 - auto accept/i)
          .parent()
          .find('[data-cy=btn-view-equipment]')
          .click();

        cy.contains(/Available equipment 2 - auto accept/i);

        cy.contains(/2020-09-21 14:00:00/);
        cy.contains(/2020-09-21 15:00:00/);
      });
    });

    describe('Review step', () => {
      it('should request confirmation to activate proposal booking', () => {
        cy.get('[data-cy=btn-next]').click();

        cy.contains(/activate booking/i).as('activateBookingBtn');

        cy.get('@activateBookingBtn').should('be.disabled');

        cy.contains(/i wish to proceed/i).click();

        cy.get('@activateBookingBtn')
          .should('not.be.disabled')
          .click();

        cy.wait(100);

        cy.contains(/lost time/i);
      });
    });

    describe('Final step', () => {
      it('should be able to navigate using tabs', () => {
        cy.get('[data-cy="booking-step-BOOK_EVENTS"]').click();
        cy.contains(/save draft/i);
        cy.get('[data-cy="booking-step-BOOK_EQUIPMENT"]').click();
        cy.contains(/time slots with equipments/i);
        cy.get('[data-cy="booking-step-FINALIZE"]').click();
        cy.contains(/save lost time/i);
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
  });
});
