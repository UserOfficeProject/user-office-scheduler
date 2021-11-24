import moment from 'moment';
import {
  currentHourDateTime,
  getHourDateTimeAfter,
  getFormattedDateAfter,
} from '../utils';

context('Scheduled events timeline tests', () => {
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

  describe('Scheduled events timeline', () => {
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
      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.finishedLoading();

      cy.get('#instrument-calls-tree-view [role=treeitem]').first().click();

      cy.get(
        '#instrument-calls-tree-view [role=treeitem] [role=group] [role=treeitem]'
      )
        .first()
        .click();

      cy.get('[data-cy="add-new-timeslot"]').click();

      cy.finishedLoading();

      cy.contains(currentHourDateTime);
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

      cy.contains(currentHourDateTime)
        .parent()
        .should('have.attr', 'style')
        .and('include', 'background: rgb(')
        .and('include', 'filter: grayscale(0) opacity(0.6)');
    });

    it('should show timeline view of events in different colors depending on the event type', () => {
      cy.finishedLoading();
      cy.createEvent(newScheduledEvent_1);
      cy.createEvent(newScheduledEvent_2);

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.finishedLoading();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Timeline"]').click();

      cy.contains(newScheduledEvent_1.endsAt)
        .parent()
        .should('have.attr', 'style')
        .and('include', 'background: rgb(');

      cy.contains(newScheduledEvent_2.endsAt)
        .parent()
        .should('have.attr', 'style')
        .and('include', 'background: rgb(');
    });

    it('should be able to filter events based on the timeline toolbar filters', () => {
      cy.finishedLoading();
      cy.createEvent(newScheduledEvent_3);

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.finishedLoading();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Timeline"]').click();

      cy.get('[data-cy="calendar-timeline-view-toolbar"]').should('exist');

      cy.get('[data-cy="timeline-toolbar-instrument-select"]').should('exist');
      cy.get('[data-cy="timeline-view-period"]').should('exist');
      cy.get('[data-cy="btn-view-prev"]').should('exist');
      cy.get('[data-cy="btn-view-next"]').should('exist');
      cy.get('[data-cy="btn-view-today"]').should('exist');

      cy.contains(newScheduledEvent_1.endsAt);

      cy.contains(getFormattedDateAfter('dddd, D MMMM YYYY'));

      cy.get('[data-cy="calendar-timeline-view"]').should(
        'not.contain',
        newScheduledEvent_3.startsAt
      );

      cy.get('[data-cy=timeline-view-period]').click();
      cy.get('[data-value="month"]').click();

      cy.finishedLoading();

      cy.contains(newScheduledEvent_1.endsAt);
      if (
        moment(currentHourDateTime).month() !==
        moment(newScheduledEvent_3.startsAt).month()
      ) {
        cy.get('[data-cy="calendar-timeline-view"]').should(
          'not.contain',
          newScheduledEvent_3.startsAt
        );
      } else {
        cy.contains(newScheduledEvent_3.startsAt);
      }

      cy.contains(getFormattedDateAfter('MMMM YYYY'));

      cy.get('[data-cy="btn-view-next"]').click();

      cy.finishedLoading();

      cy.contains(getFormattedDateAfter('MMMM YYYY', 1, 'month'));

      if (
        moment(getFormattedDateAfter('MMMM YYYY', 1, 'month')).month() !==
        moment(newScheduledEvent_3.startsAt).month()
      ) {
        cy.get('[data-cy="calendar-timeline-view"]').should(
          'not.contain',
          newScheduledEvent_3.startsAt
        );
      } else {
        cy.contains(newScheduledEvent_3.startsAt);
      }

      cy.get('[data-cy="calendar-timeline-view"]').should(
        'not.contain',
        newScheduledEvent_1.startsAt
      );

      cy.get('[data-cy="btn-view-prev"]').click();
      cy.finishedLoading();
      cy.get('[data-cy="btn-view-prev"]').click();
      cy.finishedLoading();

      cy.contains(getFormattedDateAfter('MMMM YYYY', -1, 'month'));

      cy.get('[data-cy="calendar-timeline-view"]').should(
        'not.contain',
        newScheduledEvent_3.startsAt
      );

      cy.get('[data-cy="calendar-timeline-view"]').should(
        'not.contain',
        newScheduledEvent_1.startsAt
      );

      cy.get('[data-cy="btn-view-today"]').click();
      cy.finishedLoading();

      cy.contains(getFormattedDateAfter('MMMM YYYY'));

      cy.contains(newScheduledEvent_1.endsAt);
      if (
        moment(currentHourDateTime).month() !==
        moment(newScheduledEvent_3.startsAt).month()
      ) {
        cy.get('[data-cy="calendar-timeline-view"]').should(
          'not.contain',
          newScheduledEvent_3.startsAt
        );
      } else {
        cy.contains(newScheduledEvent_3.startsAt);
      }

      cy.get('[data-cy=timeline-view-period]').click();
      cy.get('[data-value="day"]').click();

      cy.contains(getFormattedDateAfter('dddd, DD MMMM YYYY'));
    });

    it('should be able to click and open events in timeline view', () => {
      cy.finishedLoading();

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.finishedLoading();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Timeline"]').click();

      cy.wait(500);

      cy.contains(newScheduledEvent_1.endsAt).parent().click();

      cy.get('[role="none presentation"] [data-cy="startsAt"]').should('exist');
      cy.get('[role="none presentation"] [data-cy="endsAt"]').should('exist');
      cy.get('[role="none presentation"] [data-cy="bookingType"]').should(
        'exist'
      );

      cy.get('[data-cy="btn-close-dialog"]').click();

      cy.contains(currentHourDateTime).first().parent().click();

      cy.get('[role="none presentation"] [data-cy="btn-save"]').should('exist');
      cy.get(
        '[role="none presentation"] [data-cy="activate-time-slot-booking"]'
      ).should('exist');
    });

    it('should not reset dates if page reloads', () => {
      cy.initializeSession('UserOfficer');
      cy.finishedLoading();

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.finishedLoading();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Timeline"]').click();

      cy.get('[data-cy=timeline-view-period]').click();
      cy.get('[data-value="day"]').click();

      cy.contains(getFormattedDateAfter('dddd, DD MMMM YYYY'));

      cy.reload();

      cy.finishedLoading();

      cy.contains(getFormattedDateAfter('dddd, DD MMMM YYYY'));

      cy.get('[data-cy=timeline-view-period] input').should(
        'have.value',
        'day'
      );

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Calendar"]').click();

      cy.get('[data-cy="select-active-view"] input').should(
        'have.value',
        'day'
      );
    });

    it('should be able to select multiple instruments in timeline view', () => {
      cy.initializeSession('UserOfficer');
      cy.visit({
        url: '/calendar',
        timeout: 15000,
      });

      cy.finishedLoading();

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.finishedLoading();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Timeline"]').click();

      cy.get('[data-cy="timeline-toolbar-instrument-select"] input').click();

      cy.get(
        '[aria-labelledby=timeline-toolbar-instrument-select-label] [role=option]'
      )
        .last()
        .click();

      cy.finishedLoading();

      cy.get('[data-cy="timeline-toolbar-instrument-select"] input').click();

      cy.get(
        '[aria-labelledby=timeline-toolbar-instrument-select-label] [role=option]'
      )
        .eq(1)
        .click();

      cy.get(
        '[data-cy="calendar-timeline-view"] .react-calendar-timeline .rct-sidebar .rct-sidebar-row'
      ).should('have.length', '3');

      cy.reload();

      cy.finishedLoading();

      cy.get(
        '[data-cy="calendar-timeline-view"] .react-calendar-timeline .rct-sidebar .rct-sidebar-row'
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
      cy.initializeSession('UserOfficer');
      cy.visit({
        url: '/calendar',
        timeout: 15000,
      });

      cy.finishedLoading();

      cy.get('[data-cy=input-instrument-select]').click();

      cy.get('[aria-labelledby=input-instrument-select-label] [role=option]')
        .first()
        .click();

      cy.finishedLoading();

      cy.get('[data-cy="scheduler-active-view"]').click();
      cy.get('[data-value="Timeline"]').click();

      // NOTE: Using .parent().parent() because that's how react-calendar-timeline works. They have added the event listener on that element.
      cy.get('.react-calendar-timeline .rct-hl.rct-hl-even')
        .parent()
        .parent()
        .click();

      cy.get('body').trigger('keypress', { code: 39 });

      // NOTE: cy.tick is used to be able to execute the handleTimeChange because it's debounced with 500ms.
      cy.tick(500);

      cy.url().should('include', 'timeLineStart=');
    });
  });
});
