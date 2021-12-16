import {
  defaultEventBookingHourDateTime,
  getCurrentHourDateTime,
  getHourDateTimeAfter,
} from '../utils';

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

      cy.finishedLoading();

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

      cy.finishedLoading();

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

      cy.finishedLoading();

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
    });

    describe('Book events', () => {
      it('should be able to add new time slot', () => {
        cy.contains('Proposal ID');
        cy.get('[data-cy="add-new-timeslot"]').click();

        cy.finishedLoading();

        cy.get('[data-cy="time-slot-booking"]').contains(
          defaultEventBookingHourDateTime
        );
        cy.get('[data-cy="time-slot-booking"]').contains(
          getHourDateTimeAfter(24)
        );

        cy.get('[data-cy="startsAtInfo"]').contains(
          defaultEventBookingHourDateTime
        );
        cy.get('[data-cy="endsAtInfo"]').contains(getHourDateTimeAfter(24));

        cy.get('[data-cy="time-slot-booking"]')
          .get('[data-cy="btn-save"]')
          .should('exist');
      });

      it('Should be able to edit time slot by resizing on the calendar', () => {
        cy.get('[data-cy="btn-close-dialog"]').click();
        cy.finishedLoading();

        // Get the event from the calendar
        cy.get('.rbc-time-content .rbc-event').last().as('scheduledEvent');

        // Find the bottom resize icon after hovering the event using cypress-real-events(https://github.com/dmtrKovalenko/cypress-real-events) commands.
        cy.get('@scheduledEvent')
          .realHover()
          .find('.rbc-addons-dnd-resize-ns-anchor')
          .should('exist')
          .last()
          .find('.rbc-addons-dnd-resize-ns-icon')
          .should('exist')
          .as('bottomResizeIcon');

        // Do the actual resize using the resize icon by triggering mousedown, mousemove and mouseup
        cy.get('@bottomResizeIcon')
          .realHover()
          .realMouseDown()
          .trigger('mousemove', 0, 200, { force: true });

        cy.get('@scheduledEvent').realMouseUp();

        cy.finishedLoading();

        cy.get('#notistack-snackbar').contains(/scheduled event updated/i);
      });

      it('should be able to add new time slot by drag and drop to calendar', () => {
        cy.contains('Proposal ID');
        cy.get('[data-cy="btn-close-dialog"]').click();

        cy.finishedLoading();

        cy.get(
          '#instrument-calls-tree-view [role=treeitem] [role=group] [role=treeitem]'
        )
          .first()
          .trigger('dragstart');

        const slot = new Date(defaultEventBookingHourDateTime).toISOString();
        cy.get(`.rbc-day-slot [data-cy='event-slot-${slot}']`).scrollIntoView();

        // NOTE: It needs to be forced because all the event slots are covered by this element .rbc-events-container and it is not possible to execute drop on event-slot
        cy.get(`.rbc-day-slot [data-cy='event-slot-${slot}']`).trigger('drop', {
          force: true,
        });

        cy.finishedLoading();

        cy.get('[data-cy="time-slot-booking"]')
          .get('[data-cy="btn-save"]')
          .should('exist');

        cy.get('[data-cy="time-slot-booking"] [data-cy="startsAtInfo"]').should(
          'include.text',
          defaultEventBookingHourDateTime
        );
        cy.get('[data-cy="time-slot-booking"] [data-cy="endsAtInfo"]').should(
          'include.text',
          getHourDateTimeAfter(1, 'hours')
        );
      });

      it('Draft events should have opacity', () => {
        cy.get('[data-cy="btn-close-dialog"]').click();

        // NOTE: Using fixed proposal name and shortcode because they are inserted inside the database using a seeder and always will be the same for the test cases.
        cy.get('[data-cy="proposal-event-Test proposal-999999"]')
          .closest('.rbc-event')
          .should('have.attr', 'style')
          .and('include', 'background: rgb(')
          .and('include', 'filter: grayscale(0) opacity(0.6);');
      });

      it('should see warning message if time slot is outside call cycle interval', () => {
        cy.get('[data-cy="some-event-outside-cycle-interval-warning"]').should(
          'not.exist'
        );
        cy.contains(
          'Some of the time slots are booked outside call cycle start and end date'
        ).should('not.exist');

        cy.finishedLoading();
        cy.get('.MuiTab-fullWidth').last().click();

        cy.get('[data-cy="event-outside-cycle-interval-warning"]').should(
          'not.exist'
        );
        cy.contains(
          'Time slot should be booked between call cycle start and end date'
        ).should('not.exist');

        cy.get('[data-cy="startsAtInfo"]').click();
        cy.get('[data-cy="startsAt"] input').clear();

        cy.get('[data-cy=startsAt] input').type(getHourDateTimeAfter(2));

        cy.get('[data-cy=btn-time-table-save-row]').click();

        cy.get('[data-cy="endsAtInfo"]').click();
        cy.get('[data-cy="endsAt"] input').clear();
        cy.get('[data-cy=endsAt] input').type(getHourDateTimeAfter(50, 'days'));

        cy.get('[data-cy=btn-time-table-save-row]').click();

        cy.get('[data-cy="event-outside-cycle-interval-warning"]').should(
          'exist'
        );
        cy.get('[data-cy="event-outside-cycle-interval-warning"]').should(
          'contain.text',
          'Time slot should be booked between call cycle start and end date'
        );

        cy.get('[data-cy="btn-save"]').click();
        cy.finishedLoading();

        cy.get('[data-cy="some-event-outside-cycle-interval-warning"]').should(
          'exist'
        );
        cy.get('[data-cy="some-event-outside-cycle-interval-warning"]').should(
          'contain.text',
          'Some of the time slots are booked outside call cycle start and end date'
        );
      });

      it('should be able to edit time slot', () => {
        cy.finishedLoading();
        cy.get('.MuiTab-fullWidth').last().click();

        cy.get('[data-cy="startsAtInfo"]').click();
        cy.get('[data-cy="startsAt"] input').clear();

        cy.get('[data-cy=startsAt] input').type(
          getHourDateTimeAfter(2, 'days')
        );

        cy.get('[data-cy=btn-time-table-save-row]').click();

        cy.get('[data-cy="endsAtInfo"]').click();
        cy.get('[data-cy="endsAt"] input').clear();
        cy.get('[data-cy=endsAt] input').type(getHourDateTimeAfter(3, 'days'));

        cy.get('[data-cy=btn-time-table-save-row]').click();

        cy.contains(getHourDateTimeAfter(2, 'days'));
        cy.contains(getHourDateTimeAfter(3, 'days'));

        cy.get('[data-cy="btn-save"]').click();
        cy.finishedLoading();
        cy.get('[data-cy="btn-close-dialog"]').click();

        cy.finishedLoading();

        cy.get(
          '#instrument-calls-tree-view [role=treeitem] [role=group] [role=treeitem]'
        )
          .first()
          .click();

        cy.get('.MuiTab-fullWidth').last().click();

        cy.contains(getHourDateTimeAfter(2, 'days'));
        cy.contains(getHourDateTimeAfter(3, 'days'));

        cy.get('[data-cy="startsAtInfo"]').click();
        cy.get('[data-cy="startsAt"] input').clear();

        cy.get('[data-cy=startsAt] input').type(getHourDateTimeAfter(24));

        cy.get('[data-cy=btn-time-table-reset-row]').click();

        cy.get('[data-cy="endsAtInfo"]').click();
        cy.get('[data-cy="endsAt"] input').clear();
        cy.get('[data-cy=endsAt] input').type(getHourDateTimeAfter(25));

        cy.get('[data-cy=btn-time-table-reset-row]').click();

        cy.contains(getHourDateTimeAfter(2, 'days'));
        cy.contains(getHourDateTimeAfter(3, 'days'));
      });

      it('should be able to add and edit local contact on the timeslot', () => {
        cy.finishedLoading();
        cy.get('.MuiTab-fullWidth').last().click();

        cy.get('[data-cy="local-contact-details"]').should(
          'contain.text',
          'None'
        );

        cy.get('[data-cy="add-local-contact"]').click();
        cy.get('[data-cy="select-user"]').first().click();

        cy.get('[data-cy="local-contact-details"]')
          .should('not.contain.text', 'None')
          .invoke('text')
          .then((selectedLocalContactText: string) => {
            cy.get('[data-cy="edit-local-contact"]').should('exist').click();

            cy.get('[data-cy="select-user"]').last().click();

            cy.get('[data-cy="local-contact-details"]')
              .should('not.contain.text', 'None')
              .invoke('text')
              .should('not.equal', selectedLocalContactText);
          });
      });

      it('should be able to open time slot by clicking on the calendar event', () => {
        cy.get('[data-cy="btn-close-dialog"]').click();
        cy.finishedLoading();

        cy.get('.rbc-time-content .rbc-event')
          .last()
          .contains('999999')
          .click();

        cy.finishedLoading();

        cy.contains('Allocated time');
        cy.contains('Allocatable time');
        cy.get('[data-cy="startsAtInfo"]').should('exist');
        cy.get('[data-cy="endsAtInfo"]').should('exist');

        cy.contains(getHourDateTimeAfter(2, 'days'));
        cy.contains(getHourDateTimeAfter(3, 'days'));

        cy.contains('Proposal title');
        cy.contains('Proposal ID');
        cy.get('[data-cy="time-slot-booking"]')
          .get('[data-cy="btn-save"]')
          .should('exist');
      });

      it('should display time allocation left', () => {
        cy.contains('0 seconds');
      });

      it('should be able to delete time slot', () => {
        cy.finishedLoading();
        cy.get('[data-cy="btn-delete"]').click();

        cy.contains(/confirmation/i);
        cy.contains(/are you sure you want to delete scheduled event/i);

        cy.get('[data-cy="btn-ok"]').click();
        cy.finishedLoading();

        cy.get('.MuiTab-fullWidth').last().click();

        cy.get('[data-cy="btn-delete"]').click();
        cy.get('[data-cy="btn-ok"]').click();
        cy.finishedLoading();

        cy.contains(/No records to display\. Start by adding new time slot/i);
      });

      it('should show warning when `startsAt` is after `endsAt`', () => {
        cy.finishedLoading();
        cy.get('[data-cy="add-new-timeslot"]').click();
        cy.finishedLoading();

        cy.get('[data-cy="startsAtInfo"]').click();
        cy.get('[data-cy="startsAt"] input')
          .clear()
          .type(getHourDateTimeAfter(24));

        cy.get('[data-cy=btn-time-table-save-row]').click();

        cy.get('[data-cy="btn-save"]').click();

        cy.contains(/warning/i);
        cy.contains(/the starting date needs to be before the ending date/i);
        cy.get('[data-cy="btn-back"]').click();

        cy.get('[data-cy="startsAtInfo"]').click();
        cy.get('[data-cy="startsAt"] input')
          .clear()
          .type(getHourDateTimeAfter(23));

        cy.get('[data-cy=btn-time-table-save-row]').click();

        cy.get('[data-cy="endsAtInfo"]').click();
        cy.get('[data-cy="endsAt"] input')
          .clear()
          .type(getHourDateTimeAfter(20));

        cy.get('[data-cy=btn-time-table-save-row]').click();

        cy.get('[data-cy="btn-save"]').click();

        cy.contains(/warning/i);
        cy.contains(/the starting date needs to be before the ending date/i);
      });

      it('should show confirmation when there are overlapping events', () => {
        cy.finishedLoading();
        cy.get('[data-cy="add-new-timeslot"]').click();
        cy.finishedLoading();

        cy.get('[data-cy="startsAtInfo"]').click();
        cy.get('[data-cy="startsAt"] input')
          .clear()
          .type(defaultEventBookingHourDateTime);

        cy.get('[data-cy=btn-time-table-save-row]').click();

        cy.get('[data-cy="endsAtInfo"]').click();
        cy.get('[data-cy="endsAt"] input')
          .clear()
          .type(getHourDateTimeAfter(1));

        cy.get('[data-cy=btn-time-table-save-row]').click();

        cy.get('[data-cy="btn-save"]').click();

        cy.contains(/confirmation/i);
        cy.contains(/you have overlapping bookings/i);
      });
    });

    describe('Equipment booking', () => {
      beforeEach(() => {
        cy.finishedLoading();
        cy.get('.MuiTab-fullWidth').first().click();
      });

      it('should be able to assign available equipments to time slot', () => {
        cy.get('[data-cy="time-slot-booked-equipments-table"]').contains(
          /no records to display/i
        );

        cy.get('[data-cy=btn-book-equipment]').click();

        cy.finishedLoading();

        cy.contains(/Available equipment 1 - no auto accept/i);
        cy.contains(/Available equipment 2 - auto accept/i);
        cy.contains(/Under maintenance 1 - not started yet/i);
        cy.contains(/Under maintenance 3 - finished/i);

        cy.get('[data-cy=enhanced-table-checkbox-0]').click();
        cy.get('[data-cy=enhanced-table-checkbox-1]').click();
        cy.get('[data-cy=btn-assign-equipment]').click();

        cy.get('[data-cy="time-slot-booked-equipments-table"]').should(
          'include.text',
          'Available equipment 1 - no auto accept'
        );
        cy.get('[data-cy="time-slot-booked-equipments-table"]').should(
          'include.text',
          'Available equipment 2 - auto accept'
        );
      });

      it('should show warning if some equipment is not accepted', () => {
        cy.contains(/Time Slot Equipments/i);
        cy.get('[data-cy="accepted-equipment-warning"]').should(
          'contain.text',
          'Warning'
        );
        cy.get('[data-cy="accepted-equipment-warning"]').should(
          'contain.text',
          'All booked equipments must be accepted before activating the booking'
        );
      });

      it('should not show already assigned equipments', () => {
        cy.get('[data-cy=btn-book-equipment]').click();

        cy.contains(/1-3 of 3/i);
      });

      it('should show the assignment status', () => {
        cy.contains(/Available equipment 1 - no auto accept/i)
          .parent()
          .contains(/pending/i);
        cy.contains(/Available equipment 2 - auto accept/i)
          .parent()
          .contains(/accepted/i);
      });

      it('should show available equipments that are booked by proposals that instrument scientist is part of even if he/she is not equipment owner or responsible', () => {
        cy.finishedLoading();
        cy.get('[data-cy="btn-close-dialog"]').click();
        cy.finishedLoading();

        cy.get('[data-cy="input-equipment-select"]').click();

        cy.get('[role="presentation"]').contains(
          /Available equipment 1 - no auto accept/i
        );
        cy.get('[role="presentation"]').contains(
          /Available equipment 2 - auto accept/i
        );

        cy.visit({
          url: '/equipments',
          timeout: 15000,
        });

        cy.contains(/Available equipment 1 - no auto accept/i);
        cy.contains(/Available equipment 2 - auto accept/i);
      });

      it('Officer should be able to assign change equipment owner people', () => {
        cy.initializeSession('UserOfficer');
        let equipmentOwner: string;

        cy.visit({
          url: '/equipments',
          timeout: 15000,
        });

        cy.contains(/Available equipment 1 - no auto accept/i)
          .parent()
          .find('[title="View equipment"]')
          .click();

        cy.get('[data-cy="equipment-owner"]').then((element) => {
          equipmentOwner = element.text();
        });

        cy.get('[data-cy="change-equipment-owner"]').click();

        cy.get('[data-cy="equipment-responsible"] button[title="Select user"]')
          .first()
          .click();

        cy.get('[role=alert]').contains(/success/i);

        cy.get('[data-cy="equipment-owner"]').should((element) => {
          expect(element.text()).to.not.equal(equipmentOwner);
        });
      });

      it('Officer should be able to assign equipment responsible people', () => {
        cy.initializeSession('UserOfficer');

        cy.visit({
          url: '/equipments',
          timeout: 15000,
        });

        cy.contains(/Available equipment 1 - no auto accept/i)
          .parent()
          .find('[title="View equipment"]')
          .click();

        cy.get('[data-cy="add-equipment-responsible"]').click();

        cy.get('input[type="checkbox"]').first().click();

        cy.get('[data-cy="assign-selected-users"]').click();

        cy.get('[role=alert]').contains(/success/i);

        cy.visit({
          url: '/equipments',
          timeout: 15000,
        });

        cy.contains(/Available equipment 2 - auto accept/i)
          .parent()
          .find('[title="View equipment"]')
          .click();

        cy.get('[data-cy="add-equipment-responsible"]').click();

        cy.get('input[type="checkbox"]').first().click();

        cy.get('[data-cy="assign-selected-users"]').click();

        cy.get('[role=alert]').contains(/success/i);
      });

      it('should be able to open time slot by clicking on the calendar equipment event', () => {
        cy.finishedLoading();
        cy.get('[data-cy="btn-close-dialog"]').click();
        cy.finishedLoading();

        cy.get('[data-cy="input-equipment-select"]').click();
        cy.get('[role="presentation"]')
          .contains('Available equipment 2 - auto accept')
          .click();

        cy.get('.rbc-time-content .rbc-event')
          .contains('Available equipment 2 - auto accept')
          .click({ force: true });

        cy.get('[role="dialog"] [data-cy="btn-edit-equipment"]').should(
          'exist'
        );

        cy.get('[role="dialog"]').contains('Auto accept equipment requests');
        cy.get('[role="dialog"]').contains('time slots upcoming year', {
          matchCase: false,
        });
        cy.get('[data-cy="btn-close-dialog"]').should('exist');
        cy.get('[data-cy="equipment-upcoming-time-slots-table"]').should(
          'exist'
        );

        cy.get(
          '[data-cy="equipment-booking-dialog"] [data-cy="btn-close-dialog"]'
        ).click();
      });

      it('should be able to view equipment assignment request from requests page', () => {
        cy.visit('/requests');

        cy.contains(/Available equipment 1 - no auto accept/i)
          .parent()
          .contains(defaultEventBookingHourDateTime);
        cy.contains(/Available equipment 1 - no auto accept/i)
          .parent()
          .contains(getHourDateTimeAfter(24));

        cy.contains(/Available equipment 1 - no auto accept/i)
          .parent()
          .find('[data-cy="accept-equipment-request"]')
          .should('exist');
        cy.contains(/Available equipment 1 - no auto accept/i)
          .parent()
          .find('[data-cy="reject-equipment-request"]')
          .should('exist');

        cy.contains('Instrument');
        cy.contains('Proposal');
        cy.contains('Proposal ID');
        cy.contains('Scheduled by');
      });

      it('should be able to accept / reject assignment request', () => {
        cy.visit('/equipments');

        cy.contains(/Available equipment 1 - no auto accept/i)
          .parent()
          .find('[title="View equipment"]')
          .click();

        cy.contains(/Available equipment 1 - no auto accept/i);

        cy.contains(defaultEventBookingHourDateTime);
        cy.contains(getHourDateTimeAfter(24));

        cy.get('[data-cy="accept-equipment-request"]').click();

        cy.contains(/confirmation/i);
        cy.contains(/Are you sure you want to accept the request?/i);
        cy.get('[data-cy=btn-cancel]').click();

        cy.get('[data-cy="reject-equipment-request"]').click();

        cy.contains(/confirmation/i);
        cy.contains(/Are you sure you want to reject the request?/i);
        cy.get('[data-cy=btn-ok]').click();

        cy.get('[role=alert]').contains(/success/i);
      });

      it('should be able to remove assigned equipment', () => {
        cy.contains(/Available equipment 1 - no auto accept/i)
          .parent()
          .contains(/rejected/i);

        cy.contains(/Available equipment 2 - auto accept/i)
          .parent()
          .contains(/accepted/i);

        cy.contains(/Available equipment 1 - no auto accept/i)
          .parent()
          .find('button[title="Delete"]')
          .click();

        cy.contains(/Are you sure you want to delete this row/i);

        cy.get('button[title="Cancel"]').click();

        cy.contains(/Available equipment 1 - no auto accept/i)
          .parent()
          .find('button[title="Delete"]')
          .click();

        cy.contains(/Are you sure you want to delete this row/i);

        cy.get('button[title="Save"]').click();

        cy.finishedLoading();

        cy.get('[role=alert]').contains(/removed/i);
        cy.wait(100);
        cy.contains(/Available equipment 2 - auto accept/i);
        cy.should('not.contain', /Available equipment 1 - no auto accept/i);
      });

      it('should show the assigned time slot on the equipment page', () => {
        cy.visit('/equipments');
        cy.contains(/Available equipment 2 - auto accept/i)
          .parent()
          .find('[title="View equipment"]')
          .click();

        cy.contains(/Available equipment 2 - auto accept/i);

        cy.finishedLoading();

        cy.contains(defaultEventBookingHourDateTime);
        cy.contains(getHourDateTimeAfter(24));
      });
    });

    describe('Review', () => {
      it('should request confirmation to activate proposal booking', () => {
        cy.get('.MuiTab-fullWidth').first().click();
        cy.get('[data-cy="activate-time-slot-booking"]').click();

        cy.get('[data-cy="btn-ok"]').click();

        cy.wait(100);

        cy.contains(/lost time/i);
        cy.get(
          '[data-cy="time-slot-booked-equipments-table"] [title="Book equipment"]'
        ).should('not.exist');
      });
    });

    describe('Final', () => {
      it('should be able to log lost time', () => {
        cy.finishedLoading();
        cy.get('.MuiTab-fullWidth').first().click();
        cy.finishedLoading();
        cy.get('[data-cy=btn-add-lost-time]').click();

        cy.get('[data-cy="time-slot-lost-times-table"]').contains(
          getCurrentHourDateTime()
        );
        cy.get('[data-cy="time-slot-lost-times-table"]').contains(
          getHourDateTimeAfter(1, 'hour', getCurrentHourDateTime())
        );
      });

      it('should be able to restart time slot booking process', () => {
        cy.finishedLoading();
        cy.get('.MuiTab-fullWidth').first().click();

        cy.get('[aria-label=proposal-booking-finalization-strategy]').click();

        cy.contains(/restart the time slot booking/i).click();
        cy.wait(100);

        cy.contains(/restart the time slot booking/i).as('restartBooking');

        cy.get('@restartBooking').should('not.be.disabled').click();

        cy.contains('Are you sure you want to restart the selected booking');

        cy.get('[data-cy="btn-ok"]').click();

        cy.finishedLoading();

        cy.get('[data-cy="btn-book-equipment"]').should('exist');
      });

      it('should be able to go through the process again after restarting', () => {
        cy.finishedLoading();
        cy.get('.MuiTab-fullWidth').first().click();

        cy.contains(/activate booking/i).as('activateBookingBtn');

        cy.get('@activateBookingBtn').should('not.be.disabled').click();

        cy.get('[data-cy="btn-ok"]').click();

        cy.finishedLoading();

        cy.get(
          '[data-cy="time-slot-booked-equipments-table"] [title="Book equipment"]'
        ).should('not.exist');
      });

      it('should be able to edit lost time', () => {
        cy.finishedLoading();
        cy.get('.MuiTab-fullWidth').first().click();
        cy.get('[data-cy="time-slot-lost-times-table"] tbody tr [title="Edit"]')
          .first()
          .click();

        cy.get('[data-cy=startsAt] input').clear();
        cy.get('[data-cy=endsAt] input').clear();

        cy.get('[data-cy="time-slot-lost-times-table"] tbody tr [title="Save"]')
          .first()
          .click();

        cy.get('[data-cy=startsAt] input').type(getHourDateTimeAfter(24));
        cy.get('[data-cy=endsAt] input').type(getHourDateTimeAfter(25));

        cy.get('[data-cy="time-slot-lost-times-table"] tbody tr [title="Save"]')
          .first()
          .click();

        cy.contains(getHourDateTimeAfter(24));
        cy.contains(getHourDateTimeAfter(25));

        cy.get('[data-cy="time-slot-lost-times-table"] tbody tr [title="Edit"]')
          .first()
          .click();

        cy.get('[data-cy=startsAt] input')
          .clear()
          .type(getHourDateTimeAfter(48));
        cy.get('[data-cy=endsAt] input').clear().type(getHourDateTimeAfter(49));

        cy.get(
          '[data-cy="time-slot-lost-times-table"] tbody tr [title="Cancel"]'
        )
          .first()
          .click();

        cy.contains(getHourDateTimeAfter(24));
        cy.contains(getHourDateTimeAfter(25));
      });

      it('should be able to delete lost time', () => {
        cy.finishedLoading();
        cy.get('.MuiTab-fullWidth').first().click();
        cy.get(
          '[data-cy="time-slot-lost-times-table"] tbody tr [title="Delete"]'
        )
          .first()
          .click();

        cy.get('[data-cy="time-slot-lost-times-table"] tbody tr [title="Save"]')
          .first()
          .click();

        cy.contains(/no records to display/i);
      });

      it('should show error when `startsAt` is after `endsAt`', () => {
        cy.finishedLoading();
        cy.get('.MuiTab-fullWidth').first().click();
        cy.get('[data-cy="btn-add-lost-time"]').click();
        cy.finishedLoading();
        cy.get('[data-cy="time-slot-lost-times-table"] tbody tr [title="Edit"]')
          .first()
          .click();

        cy.get('[data-cy=startsAt] input').clear();
        cy.get('[data-cy=endsAt] input').clear();

        cy.get('[data-cy=startsAt] input').type(getHourDateTimeAfter(48));
        cy.get('[data-cy=endsAt] input').type(getHourDateTimeAfter(24));

        cy.get(
          '[data-cy="time-slot-lost-times-table"] tbody tr span[title="Save"] button'
        ).should('be.disabled');

        cy.get('[data-cy="endsAt"] p.Mui-error').should(
          'include.text',
          'End date should be after start date'
        );
      });

      it('should show confirmation when there are overlapping lost time events', () => {
        cy.finishedLoading();
        cy.get('.MuiTab-fullWidth').first().click();
        cy.get('[data-cy=btn-add-lost-time]').click();
        cy.finishedLoading();
        cy.get('[data-cy="time-slot-lost-times-table"] tbody tr [title="Edit"]')
          .last()
          .click();

        cy.get('[data-cy=startsAt] input').clear();
        cy.get('[data-cy=endsAt] input').clear();

        cy.get('[data-cy=startsAt] input').type(getCurrentHourDateTime());
        cy.get('[data-cy=endsAt] input').type(
          getHourDateTimeAfter(1, 'hour', getCurrentHourDateTime())
        );

        cy.get('[data-cy="time-slot-lost-times-table"] tbody tr [title="Save"]')
          .first()
          .click();

        cy.finishedLoading();

        cy.contains(/complete the time slot booking/i).click();

        cy.contains(/confirmation/i);
        cy.contains(/you have overlapping events/i);
      });

      it('should be able to complete the booking process', () => {
        cy.finishedLoading();

        cy.contains(/complete proposal booking/i).as('completeBooking');

        cy.get('@completeBooking').should('not.be.disabled').click();
        cy.get('[data-cy="btn-ok"]').click();

        cy.wait(500);

        cy.contains(
          /Proposal booking is already completed, you can not edit it/i
        );
      });

      it('Completed events should have gray color and opacity', () => {
        cy.get('[data-cy="btn-close-dialog"]').click();

        cy.get('[data-cy="proposal-event-Test proposal-999999"]').should(
          'contain.text',
          '[Completed]'
        );

        cy.get(
          '#instrument-calls-tree-view [role=treeitem] [role=group] [role=treeitem]'
        )
          .first()
          .should('contain.text', '[Completed]');

        cy.get('[data-cy="proposal-event-Test proposal-999999"]')
          .closest('.rbc-event')
          .should('have.attr', 'style')
          .and('include', 'background: rgb(')
          .and('include', 'filter: grayscale(0.5) opacity(1)');

        cy.get('[data-cy="scheduler-active-view"]').click();
        cy.get('[data-value="Timeline"]').click();

        cy.contains(defaultEventBookingHourDateTime)
          .first()
          .parent()
          .should('have.attr', 'style')
          .and('include', 'background: rgb(')
          .and('include', 'filter: grayscale(0.5) opacity(1)');
      });

      it('Instrument scientist should not be able to re-open completed events', () => {
        cy.initializeSession('InstrumentScientist_1');

        cy.visit({
          url: '/calendar',
          timeout: 15000,
        });

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

        cy.get('[data-cy="btn-reopen-booking"]').should('not.exist');

        cy.get('.MuiTab-fullWidth').first().click();

        cy.finishedLoading();

        cy.get('[data-cy="btn-reopen-time-slot-booking"]').should('not.exist');
      });

      it('User officer should be able to re-open completed events', () => {
        cy.initializeSession('UserOfficer');

        cy.visit({
          url: '/calendar',
          timeout: 15000,
        });

        cy.finishedLoading();
        cy.get('[data-cy=input-instrument-select]').click();

        cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
          .last()
          .click();
        cy.get('#instrument-calls-tree-view [role=treeitem]').first().click();

        cy.get(
          '#instrument-calls-tree-view [role=treeitem] [role=group] [role=treeitem]'
        )
          .first()
          .click();

        cy.get('[data-cy="btn-reopen-booking"]').should(
          'include.text',
          'Reopen proposal booking'
        );

        cy.get('.MuiTab-fullWidth').first().click();

        cy.finishedLoading();

        cy.get('[data-cy="btn-reopen-time-slot-booking"]')
          .should('include.text', 'Reopen time slot booking')
          .click();

        cy.contains(/confirmation/i);
        cy.contains(/Are you sure you want to re-open the selected time slot/i);

        cy.get('[data-cy="btn-ok"]').click();

        cy.finishedLoading();

        cy.get('[title="Add lost time"]').should('exist');
        cy.contains('Complete the time slot booking');

        cy.get('[data-cy="btn-reopen-booking"]').should('not.exist');
      });
    });
  });
});
