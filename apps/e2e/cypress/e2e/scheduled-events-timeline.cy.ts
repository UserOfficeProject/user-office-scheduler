import { ScheduledEventBookingType } from '@user-office-software-libs/shared-types';
import moment from 'moment';

import initialDBData from '../support/initialDBData';
import {
  defaultEventBookingHourDateTime,
  getHourDateTimeAfter,
  getFormattedDateAfter,
  selectInstrument,
  openProposalBookingFromRightToolbar,
} from '../utils';

context('Scheduled events timeline tests', () => {
  beforeEach(() => {
    cy.resetDB(true);
    cy.resetSchedulerDB(true);
    cy.login('instrumentScientist1');
    cy.visit('/calendar');
  });

  describe('Scheduled events timeline', () => {
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
    const newScheduledUserOperationsEvent = {
      instrumentId: initialDBData.instruments[0].id,
      proposalBookingId: initialDBData.proposalBooking.id,
      bookingType: ScheduledEventBookingType.USER_OPERATIONS,
      startsAt: defaultEventBookingHourDateTime,
      endsAt: getHourDateTimeAfter(24),
    };

    it('should be able to switch between scheduled events timeline view and calendar view', () => {
      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Timeline"]').click();

      cy.get('[data-cy="calendar-timeline-view"]').should('exist');

      cy.get('.rbc-time-view').should('not.exist');

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Calendar"]').click();

      cy.get('.rbc-time-view').should('exist');

      cy.get('[data-cy="calendar-timeline-view"]').should('not.exist');
    });

    it('should be able to see scheduled events in timeline view when instrument is selected', () => {
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
      cy.get('[data-value="Timeline"]').click();

      cy.get('[data-cy="calendar-timeline-view"]').should('exist');

      cy.get('[data-cy="calendar-timeline-view"] .rct-items .rct-item').should(
        'have.length.above',
        0
      );

      cy.contains(defaultEventBookingHourDateTime)
        .parent()
        .should('have.attr', 'style')
        .and('include', 'background: rgb(')
        .and('include', 'filter: grayscale(0) opacity(0.6)');
    });

    it('should show timeline view of events in different colors depending on the event type', () => {
      cy.createEvent({ input: newScheduledEvent1 });
      cy.createEvent({ input: newScheduledEvent2 });
      cy.finishedLoading();

      selectInstrument();
      cy.finishedLoading();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Timeline"]').click();

      cy.contains(newScheduledEvent1.endsAt)
        .parent()
        .should('have.attr', 'style')
        .and('include', 'background: rgb(');

      cy.contains(newScheduledEvent2.endsAt)
        .parent()
        .should('have.attr', 'style')
        .and('include', 'background: rgb(');
    });

    it('should be able to filter events based on the timeline toolbar filters', () => {
      cy.createEvent({ input: newScheduledEvent1 });
      cy.createEvent({ input: newScheduledEvent3 });
      cy.createEvent({ input: newScheduledUserOperationsEvent });
      cy.finishedLoading();

      selectInstrument();
      cy.finishedLoading();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Timeline"]').click();

      cy.get('[data-cy="input-instrument-select"]').should('exist');

      cy.contains(newScheduledEvent1.endsAt);

      cy.contains(getFormattedDateAfter('dddd, D MMMM YYYY'));

      cy.get('[data-cy="calendar-timeline-view"]').should(
        'not.contain',
        newScheduledEvent3.startsAt
      );

      cy.get('.rbc-toolbar button')
        .contains('month', { matchCase: false })
        .click();

      cy.finishedLoading();

      cy.get('.rbc-toolbar button')
        .contains('today', { matchCase: false })
        .click();

      cy.finishedLoading();

      cy.contains(newScheduledEvent1.endsAt);

      if (
        moment(defaultEventBookingHourDateTime).month() !==
        moment(newScheduledEvent3.startsAt).month()
      ) {
        cy.get('[data-cy="calendar-timeline-view"]').should(
          'not.contain',
          newScheduledEvent3.startsAt
        );
      } else {
        cy.contains(newScheduledEvent3.startsAt);
      }

      cy.contains(getFormattedDateAfter('MMMM YYYY'));

      cy.get('.rbc-toolbar button')
        .contains('next', { matchCase: false })
        .click();

      cy.finishedLoading();

      cy.contains(getFormattedDateAfter('MMMM YYYY', 1, 'month'));

      if (
        moment(getFormattedDateAfter('MMMM YYYY', 1, 'month')).month() !==
          moment(newScheduledEvent3.startsAt).month() &&
        moment(getFormattedDateAfter('MMMM YYYY', 1, 'month')).month() !==
          moment(newScheduledEvent3.endsAt).month()
      ) {
        cy.get('[data-cy="calendar-timeline-view"]').should(
          'not.contain',
          newScheduledEvent3.startsAt
        );
      } else {
        cy.contains(newScheduledEvent3.startsAt);
        cy.contains(newScheduledEvent3.endsAt);
      }

      cy.get('[data-cy="calendar-timeline-view"]').should(
        'not.contain',
        newScheduledEvent1.endsAt
      );

      cy.get('.rbc-toolbar button')
        .contains('back', { matchCase: false })
        .click();
      cy.finishedLoading();
      cy.get('.rbc-toolbar button')
        .contains('back', { matchCase: false })
        .click();
      cy.finishedLoading();

      cy.contains(getFormattedDateAfter('MMMM YYYY', -1, 'month'));

      cy.get('[data-cy="calendar-timeline-view"]').should(
        'not.contain',
        newScheduledEvent3.startsAt
      );

      cy.get('[data-cy="calendar-timeline-view"]').should(
        'not.contain',
        newScheduledEvent1.startsAt
      );

      cy.get('.rbc-toolbar button')
        .contains('today', { matchCase: false })
        .click();
      cy.finishedLoading();

      cy.contains(getFormattedDateAfter('MMMM YYYY'));

      cy.contains(newScheduledEvent1.endsAt);
      if (
        moment(defaultEventBookingHourDateTime).month() !==
        moment(newScheduledEvent3.startsAt).month()
      ) {
        cy.get('[data-cy="calendar-timeline-view"]').should(
          'not.contain',
          newScheduledEvent3.startsAt
        );
      } else {
        cy.contains(newScheduledEvent3.startsAt);
      }

      cy.get('.rbc-toolbar button').contains('Day').click();
      cy.get('.rbc-toolbar button').contains('Today').click();

      cy.contains(getFormattedDateAfter('dddd, D MMMM YYYY'));
    });

    it('should be able to click and open events in timeline view', () => {
      cy.createEvent({ input: newScheduledEvent1 });
      cy.createEvent({ input: newScheduledUserOperationsEvent });
      cy.finishedLoading();

      selectInstrument();
      cy.finishedLoading();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Timeline"]').click();

      cy.get('.rbc-toolbar button').contains('Today').click();
      cy.finishedLoading();

      cy.contains(newScheduledEvent1.endsAt).parent().click();

      cy.get('[role="presentation"] [data-cy="startsAt"]').should('exist');
      cy.get('[role="presentation"] [data-cy="endsAt"]').should('exist');
      cy.get('[role="presentation"] [data-cy="bookingType"]').should('exist');

      cy.get('[data-cy="btn-close-dialog"]').click();

      cy.finishedLoading();

      cy.contains(newScheduledUserOperationsEvent.endsAt)
        .first()
        .parent()
        .click();

      cy.get('[role="presentation"] [data-cy="delete-experiment-time"]').should(
        'exist'
      );
      cy.get(
        '[role="presentation"] [data-cy="activate-experiment-time"]'
      ).should('exist');

      cy.contains(
        `${newScheduledUserOperationsEvent.startsAt} - ${newScheduledUserOperationsEvent.endsAt}`
      );
    });

    it('should not reset dates if page reloads', () => {
      cy.login('officer');
      cy.visit('/calendar');
      cy.finishedLoading();

      selectInstrument();
      cy.finishedLoading();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Timeline"]').click();

      cy.get('.rbc-toolbar button').contains('Day').click();
      cy.get('.rbc-toolbar button').contains('Today').click();

      cy.contains(getFormattedDateAfter('dddd, D MMMM YYYY'));

      cy.reload();

      cy.finishedLoading();

      cy.contains(getFormattedDateAfter('dddd, D MMMM YYYY'));

      cy.get('.rbc-toolbar button.rbc-active').contains('Day').click();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Calendar"]').click();

      cy.get('.rbc-toolbar button.rbc-active').contains('Day').click();
    });

    it('should be able to select multiple instruments in timeline view', () => {
      cy.login('officer');
      cy.visit('/calendar');

      cy.finishedLoading();

      selectInstrument(initialDBData.instruments[0].name);
      cy.finishedLoading();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Timeline"]').click();

      selectInstrument(initialDBData.instruments[1].name);
      cy.finishedLoading();

      selectInstrument(initialDBData.instruments[2].name);

      cy.finishedLoading();

      cy.get(
        '[data-cy="calendar-timeline-view"] [data-cy="item-group"]'
      ).should('have.length', '3');

      cy.reload();

      cy.finishedLoading();

      cy.get(
        '[data-cy="calendar-timeline-view"] [data-cy="item-group"]'
      ).should('have.length', '3');

      cy.get(
        '[data-cy="calendar-timeline-view"] .react-calendar-timeline .rct-sidebar'
      ).should('include.text', 'Instrument 1');
      cy.get(
        '[data-cy="calendar-timeline-view"] .react-calendar-timeline .rct-sidebar'
      ).should('include.text', 'Instrument 2');
      cy.get(
        '[data-cy="calendar-timeline-view"] .react-calendar-timeline .rct-sidebar'
      ).should('include.text', 'Instrument 3');
    });

    it('should be able to scroll inside timeline view', () => {
      cy.configureClock();
      const RIGHT_ARROW_KEY_CODE = 39;
      cy.login('officer');
      cy.visit('/calendar');

      cy.finishedLoading();

      selectInstrument();

      cy.finishedLoading();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Timeline"]').click();

      // NOTE: Getting the right element because that's how react-calendar-timeline works. They have added the scroll event listener on .rct scroll first and only child element.
      cy.get('.react-calendar-timeline .rct-scroll').children().first().click();

      cy.get('body').trigger('keypress', { code: RIGHT_ARROW_KEY_CODE });

      // NOTE: cy.tick is used to be able to execute the handleTimeChange because it's debounced with 500ms.
      cy.tick(500);

      cy.url().should('include', 'startsAt=');
    });
  });
});
