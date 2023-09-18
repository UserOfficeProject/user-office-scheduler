import { ScheduledEventBookingType } from '@user-office-software-libs/shared-types';

import initialDBData from '../support/initialDBData';
import {
  defaultEventBookingHourDateTime,
  getHourDateTimeAfter,
  openProposalBookingFromRightToolbar,
  selectInstrument,
} from '../utils';

context('Scheduled events table tests', () => {
  beforeEach(() => {
    cy.resetDB(true);
    cy.resetSchedulerDB(true);
    cy.login('instrumentScientist1');
    cy.visit('/calendar');
  });

  describe('Scheduled events table', () => {
    const newScheduledEvent1 = {
      instrumentId: initialDBData.instruments[0].id,
      bookingType: ScheduledEventBookingType.MAINTENANCE,
      startsAt: defaultEventBookingHourDateTime,
      endsAt: getHourDateTimeAfter(1),
      description: 'Test maintenance event',
    };
    const newScheduledEvent2 = {
      instrumentId: initialDBData.instruments[0].id,
      bookingType: ScheduledEventBookingType.SHUTDOWN,
      startsAt: getHourDateTimeAfter(-2),
      endsAt: getHourDateTimeAfter(-1),
      description: 'Test shutdown event',
    };
    const newScheduledEvent3 = {
      instrumentId: initialDBData.instruments[0].id,
      bookingType: ScheduledEventBookingType.MAINTENANCE,
      startsAt: getHourDateTimeAfter(8, 'days'),
      endsAt: getHourDateTimeAfter(9, 'days'),
      description: 'Test maintenance event',
    };

    const newScheduledUserOperationsEvent1 = {
      instrumentId: initialDBData.instruments[0].id,
      proposalBookingId: initialDBData.proposalBooking.id,
      bookingType: ScheduledEventBookingType.USER_OPERATIONS,
      startsAt: defaultEventBookingHourDateTime,
      endsAt: getHourDateTimeAfter(24),
    };

    const newScheduledUserOperationsEvent2 = {
      instrumentId: initialDBData.instruments[0].id,
      proposalBookingId: initialDBData.proposalBooking.id,
      bookingType: ScheduledEventBookingType.USER_OPERATIONS,
      startsAt: getHourDateTimeAfter(25),
      endsAt: getHourDateTimeAfter(48),
    };

    it('should be able to switch between scheduled events table view and calendar view', () => {
      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Table"]').click();

      cy.get('[data-cy="scheduled-events-table"]').should('exist');

      cy.get('.rbc-time-view').should('not.exist');

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Calendar"]').click();

      cy.get('.rbc-time-view').should('exist');

      cy.get('[data-cy="scheduled-events-table"]').should('not.exist');
    });

    it('should be able to see scheduled events in table view when instrument is selected', () => {
      cy.finishedLoading();
      selectInstrument();
      cy.finishedLoading();
      openProposalBookingFromRightToolbar();

      cy.get('[data-cy="add-new-experiment-time"]').click();
      cy.finishedLoading();

      cy.contains(defaultEventBookingHourDateTime);
      cy.contains(getHourDateTimeAfter(24));

      cy.get('[data-cy="btn-close-dialog"]').click();
      cy.finishedLoading();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Table"]').click();

      cy.get('[data-cy="scheduled-events-table"]').should('exist');

      cy.get('[data-cy="scheduled-events-table"] table tbody tr').should(
        'have.length.above',
        0
      );

      cy.get('[data-cy="scheduled-events-table"] table tbody tr').should(
        'contain',
        'User operations'
      );

      cy.contains(defaultEventBookingHourDateTime)
        .parent()
        .should('have.attr', 'style')
        .and('include', 'background: rgb(')
        .and('include', 'filter: grayscale(0) opacity(0.6)');
    });

    it('should show table view of events in different colors depending on the event type', () => {
      cy.finishedLoading();
      cy.createEvent({ input: newScheduledEvent1 });
      cy.createEvent({ input: newScheduledEvent2 });
      cy.createEvent({ input: newScheduledUserOperationsEvent1 });

      selectInstrument();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Table"]').click();

      cy.get('[data-cy="scheduled-events-table"]').should('exist');

      cy.contains(newScheduledEvent1.endsAt)
        .parent()
        .should('have.attr', 'style')
        .and('include', 'background: rgb(');

      cy.contains(newScheduledEvent2.endsAt)
        .parent()
        .should('have.attr', 'style')
        .and('include', 'background: rgb(');

      cy.contains(newScheduledEvent2.endsAt)
        .parent()
        .invoke('attr', 'style')
        .then((eventStyle) => {
          cy.contains(newScheduledEvent1.endsAt)
            .parent()
            .should('have.attr', 'style')
            .and('not.eq', eventStyle);

          cy.contains(defaultEventBookingHourDateTime)
            .parent()
            .should('have.attr', 'style')
            .and('not.eq', eventStyle);
        });
    });

    it('should be able to use table navigation to filter events the same way as calendar navigation', () => {
      cy.createEvent({ input: newScheduledEvent1 });
      cy.createEvent({ input: newScheduledEvent3 });
      cy.createEvent({ input: newScheduledUserOperationsEvent1 });
      cy.finishedLoading();

      selectInstrument();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Table"]').click();

      cy.get('[data-cy="scheduled-events-table"]').should('exist');

      cy.get('[data-cy=input-instrument-select]').should('exist');
      cy.get('[data-cy=input-equipment-select]').should('exist');

      cy.contains(newScheduledEvent1.endsAt);

      cy.get('[data-cy="scheduled-events-table"]').should(
        'not.contain',
        newScheduledEvent3.startsAt
      );

      cy.get('.rbc-toolbar button')
        .contains('next', { matchCase: false })
        .click();

      cy.finishedLoading();

      cy.contains(newScheduledEvent3.startsAt);

      cy.get('.rbc-toolbar button')
        .contains('today', { matchCase: false })
        .click();

      cy.contains(newScheduledEvent1.endsAt);

      cy.get('.rbc-toolbar button')
        .contains('back', { matchCase: false })
        .click();

      cy.get('[data-cy="scheduled-events-table"]').should(
        'not.contain',
        newScheduledEvent1.endsAt
      );

      cy.get('[data-cy="scheduled-events-table"]').should(
        'contain.text',
        'No records to display'
      );
    });

    it('should be able to click and open events in table view', () => {
      cy.createEvent({ input: newScheduledEvent1 });
      cy.createEvent({ input: newScheduledUserOperationsEvent1 });
      cy.finishedLoading();

      selectInstrument();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Table"]').click();

      cy.contains(newScheduledEvent1.endsAt)
        .parent()
        .find('[data-testid="VisibilityIcon"]')
        .click();

      cy.get('[role="presentation"] [data-cy="startsAt"]').should('exist');
      cy.get('[role="presentation"] [data-cy="endsAt"]').should('exist');
      cy.get('[role="presentation"] [data-cy="bookingType"]').should('exist');

      cy.get('[data-cy="btn-close-dialog"]').click();

      cy.contains('User operations')
        .first()
        .parent()
        .find('[data-testid="VisibilityIcon"]')
        .click();

      cy.get('[role="presentation"] [data-cy="delete-experiment-time"]').should(
        'exist'
      );
      cy.get(
        '[role="presentation"] [data-cy="activate-experiment-time"]'
      ).should('exist');
      cy.contains(
        `${newScheduledUserOperationsEvent1.startsAt} - ${newScheduledUserOperationsEvent1.endsAt}`
      );
    });

    it('should be able to bulk activate events in table view', () => {
      cy.createEvent({ input: newScheduledEvent1 });
      cy.createEvent({ input: newScheduledUserOperationsEvent1 });
      cy.createEvent({ input: newScheduledUserOperationsEvent2 });
      cy.finishedLoading();

      selectInstrument();

      cy.finishedLoading();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Table"]').click();

      cy.get(
        '[data-cy="scheduled-events-table"] [data-cy="select-all-table-rows"]'
      ).click();

      cy.contains('3 row(s) selected');

      cy.get('[aria-label="Activate selected experiment times"]').click();

      cy.get(
        '[role="presentation"] [id="confirmation-dialog-description"]'
      ).should(
        'contain.text',
        'Are you sure you want to activate selected experiment times'
      );

      cy.get('[role="presentation"] .MuiAlert-message').should(
        'contain.text',
        'You have selected some events that are not ready for activation. Only DRAFT events that are of type USER OPERATIONS with all equipment bookings accepted will be activated'
      );

      cy.get('[data-cy="btn-cancel"]').click();

      cy.contains(newScheduledEvent1.description)
        .parent()
        .find('input[type="checkbox"]')
        .click();

      cy.contains('2 row(s) selected');

      cy.get('[aria-label="Activate selected experiment times"]').click();

      cy.get(
        '[role="presentation"] [id="confirmation-dialog-description"]'
      ).should(
        'contain.text',
        'Are you sure you want to activate selected experiment times'
      );

      cy.get('[role="presentation"] .MuiAlert-message').should('not.exist');

      cy.get('[data-cy="btn-ok"]').click();

      cy.finishedLoading();

      cy.get('#notistack-snackbar').should(
        'contain.text',
        'Experiment times activated successfully'
      );

      cy.contains(newScheduledUserOperationsEvent1.endsAt)
        .parent()
        .should('contain.text', 'Active');
      cy.contains(newScheduledUserOperationsEvent2.endsAt)
        .parent()
        .should('contain.text', 'Active');
    });

    it('should not reset dates if instrument is changed in filters', () => {
      cy.createEvent({ input: newScheduledEvent3 });
      cy.createEvent({ input: newScheduledUserOperationsEvent1 });
      cy.login('officer');
      cy.finishedLoading();

      selectInstrument();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Table"]').click();

      cy.get('[data-cy="scheduled-events-table"]').should(
        'not.contain',
        newScheduledEvent3.startsAt
      );
      cy.contains(newScheduledUserOperationsEvent1.startsAt);

      cy.get('.rbc-toolbar button')
        .contains('next', { matchCase: false })
        .click();

      cy.finishedLoading();

      cy.contains(newScheduledEvent3.startsAt);
      cy.get('[data-cy="scheduled-events-table"]').should(
        'not.contain',
        newScheduledUserOperationsEvent1.startsAt
      );

      cy.reload();

      cy.finishedLoading();

      cy.get('[data-cy="scheduled-events-table"]').should('exist');

      cy.contains(newScheduledEvent3.startsAt);
      cy.get('[data-cy="scheduled-events-table"]').should(
        'not.contain',
        newScheduledUserOperationsEvent1.startsAt
      );
    });
  });
});
