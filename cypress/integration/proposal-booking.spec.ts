import {
  ProposalBookingFinalizeAction,
  ScheduledEventBookingType,
} from '../../src/generated/sdk';
import {
  defaultEventBookingHourDateTime,
  existingInstruments,
  getCurrentHourDateTime,
  getHourDateTimeAfter,
  openProposalBookingFromRightToolbar,
  selectInstrument,
} from '../utils';

context('Proposal booking tests ', () => {
  beforeEach(() => {
    cy.resetDB(true);
    cy.resetSchedulerDB(true);
  });

  const existingInstrument = {
    id: 1,
    name: 'Instrument 1',
  };

  const createdUserOperationsEvent = {
    instrumentId: existingInstrument.id,
    proposalBookingId: 1,
    bookingType: ScheduledEventBookingType.USER_OPERATIONS,
    startsAt: defaultEventBookingHourDateTime,
    endsAt: getHourDateTimeAfter(24),
  };

  const existingProposalData = {
    proposalId: '999999',
    title: 'Test proposal',
    proposer: 'Carl Carlsson',
  };

  const existingEquipmentsData = [
    {
      id: 1,
      name: 'Available equipment 1 - no auto accept',
      description: '',
      autoAccept: false,
    },
    {
      id: 2,
      name: 'Available equipment 2 - auto accept',
      description: '',
      autoAccept: true,
    },
    {
      id: 5,
      name: 'Under maintenance 1 - not started yet',
      description: '',
      autoAccept: false,
    },
    {
      id: 7,
      name: 'Under maintenance 3 - finished',
      description: '',
      autoAccept: false,
    },
  ];

  const existingInstrumentScientistId = 100;

  describe('Proposal booking calls/proposals list', () => {
    it('should inform the user if the instrument has no calls', () => {
      cy.initializeSession('InstrumentScientist_2');

      cy.visit('/calendar');

      cy.finishedLoading();

      selectInstrument();

      cy.get('[data-cy=btn-new-event]').should('exist');
      cy.contains(/instrument has no calls/i);
    });

    it('should show the list of calls of the instrument has calls', () => {
      cy.initializeSession('InstrumentScientist_1');

      cy.visit('/calendar');

      cy.finishedLoading();

      selectInstrument();

      cy.get('[data-cy=btn-new-event]').should('exist');
      cy.should('not.contain', /instrument has no calls/i);

      cy.contains(/call: call 1/i);
    });

    it('should not crash if the referenced proposal was deleted', () => {
      cy.initializeSession('UserOfficer');

      cy.visit('/calendar');

      cy.finishedLoading();

      selectInstrument(existingInstruments[2].name);

      cy.get('[data-cy=btn-new-event]').should('exist');
      cy.contains(/instrument has no calls/i);
    });
  });

  describe('Proposal booking workflow', () => {
    beforeEach(() => {
      cy.initializeSession('InstrumentScientist_1');
    });

    describe('Book events', () => {
      beforeEach(() => {
        cy.visit('/calendar');
      });
      it('should be able to add new experiment time', () => {
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();

        cy.contains('Proposal ID');
        cy.get('[data-cy="add-new-experiment-time"]').click();

        cy.finishedLoading();

        cy.get('.MuiTabs-root button[id="vertical-tab-0"]')
          .should('have.css', 'background-color')
          .and('not.eq', 'unset')
          .and('not.eq', 'transparent');

        cy.get('[data-cy="status-indicator"]')
          .should('have.css', 'color')
          .and('eq', 'rgba(0, 0, 0, 0.54)');

        cy.get('[data-cy="experiment-time-wrapper"]').contains(
          defaultEventBookingHourDateTime
        );
        cy.get('[data-cy="experiment-time-wrapper"]').contains(
          getHourDateTimeAfter(24)
        );

        cy.get('[data-cy="startsAtInfo"]').contains(
          defaultEventBookingHourDateTime
        );
        cy.get('[data-cy="endsAtInfo"]').contains(getHourDateTimeAfter(24));

        cy.get('[data-cy="experiment-time-wrapper"]')
          .get('[data-cy="delete-experiment-time"]')
          .should('exist');
      });

      it('should be able to edit experiment time', () => {
        cy.createEvent({ input: createdUserOperationsEvent });
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();

        cy.finishedLoading();

        cy.get('[data-cy="startsAtInfo"]').click();
        cy.get('[data-cy="start-experiment-time-range"] input').clear();

        cy.get('[data-cy="start-experiment-time-range"] input').type(
          getHourDateTimeAfter(2, 'days')
        );

        cy.get('[data-cy="end-experiment-time-range"] input').clear();
        cy.get('[data-cy="end-experiment-time-range"] input').type(
          getHourDateTimeAfter(3, 'days')
        );

        cy.get('[data-cy=btn-save-experiment-range-change]').click();

        cy.finishedLoading();

        cy.contains(getHourDateTimeAfter(2, 'days'));
        cy.contains(getHourDateTimeAfter(3, 'days'));

        cy.get('[data-cy="btn-close-dialog"]').click();

        cy.finishedLoading();

        cy.get(
          '#instrument-calls-tree-view [role=treeitem] [role=group] [role=treeitem]'
        )
          .first()
          .click();

        cy.get('[id^=vertical-tab-]').last().click();

        cy.contains(getHourDateTimeAfter(2, 'days'));
        cy.contains(getHourDateTimeAfter(3, 'days'));

        cy.get('[data-cy="startsAtInfo"]').click();
        cy.get('[data-cy="start-experiment-time-range"] input').clear();

        cy.get('[data-cy="start-experiment-time-range"] input').type(
          getHourDateTimeAfter(24)
        );

        cy.get('[data-cy=btn-reset-experiment-range-change]').click();

        cy.get('[data-cy="endsAtInfo"]').click();
        cy.get('[data-cy="end-experiment-time-range"] input').clear();
        cy.get('[data-cy="end-experiment-time-range"] input').type(
          getHourDateTimeAfter(25)
        );

        cy.get('[data-cy=btn-reset-experiment-range-change]').click();

        cy.contains(getHourDateTimeAfter(2, 'days'));
        cy.contains(getHourDateTimeAfter(3, 'days'));
      });

      it('Should be able to edit experiment time by resizing on the calendar', () => {
        let rightToolbarText: string;
        cy.createEvent({ input: createdUserOperationsEvent });
        cy.finishedLoading();

        selectInstrument();

        cy.finishedLoading();

        cy.get('#instrument-calls-tree-view [role=treeitem]').first().click();

        cy.get('#instrument-calls-tree-view').then((element) => {
          rightToolbarText = element.text();
        });

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

        cy.get('#notistack-snackbar').contains(/Experiment time updated/i);

        cy.get('#instrument-calls-tree-view').then((element) => {
          expect(element.text()).not.to.be.eq(rightToolbarText);
        });
      });

      it('should be able to add new experiment time by drag and drop to calendar', () => {
        cy.finishedLoading();
        selectInstrument();
        cy.finishedLoading();
        cy.get('#instrument-calls-tree-view [role=treeitem]').first().click();

        // NOTE: This check for Mui-focused class is to prevent a bug in our drag and drop from TreeView with new MUI v5
        // https://github.com/mui-org/material-ui/issues/29518
        // We are manualy preventing focusin event to be able to drag the TreeView item.
        cy.get(
          '#instrument-calls-tree-view [role=treeitem] [role=group] [role=treeitem]'
        )
          .first()
          .realMouseDown()
          .find('.MuiTreeItem-content')
          .should('not.have.class', 'Mui-focused');

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

        cy.get('[data-cy="experiment-time-wrapper"]')
          .get('[data-cy="delete-experiment-time"]')
          .should('exist');

        cy.get(
          '[data-cy="experiment-time-wrapper"] [data-cy="startsAtInfo"]'
        ).should('include.text', defaultEventBookingHourDateTime);
        cy.get(
          '[data-cy="experiment-time-wrapper"] [data-cy="endsAtInfo"]'
        ).should('include.text', getHourDateTimeAfter(1, 'hours'));
      });

      it('Draft events should have opacity', () => {
        cy.createEvent({ input: createdUserOperationsEvent });
        cy.finishedLoading();
        selectInstrument();
        cy.finishedLoading();

        // NOTE: Using fixed proposal name and shortcode because they are inserted inside the database using a seeder and always will be the same for the test cases.
        cy.get(
          `[data-cy="proposal-event-${existingProposalData.title}-${existingProposalData.proposalId}"]`
        )
          .closest('.rbc-event')
          .should('have.attr', 'style')
          .and('include', 'background: rgb(')
          .and('include', 'filter: grayscale(0) opacity(0.6);');
      });

      it('should see warning message if experiment time is outside call cycle interval', () => {
        cy.createEvent({ input: createdUserOperationsEvent });
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();
        cy.get(
          '[data-cy="some-experiment-time-outside-cycle-interval-warning"]'
        ).should('not.exist');
        cy.contains(
          'Some of the experiment times are booked outside of the call cycle start and end date'
        ).should('not.exist');

        cy.finishedLoading();
        cy.get('[id^=vertical-tab-]').last().click();

        cy.get(
          '[data-cy="experiment-time-outside-cycle-interval-warning"]'
        ).should('not.exist');
        cy.contains(
          'Experiment time should be booked between call cycle start and end date'
        ).should('not.exist');

        cy.get('[data-cy="startsAtInfo"]').click();
        cy.get('[data-cy="start-experiment-time-range"] input').clear();

        cy.get('[data-cy="start-experiment-time-range"] input').type(
          getHourDateTimeAfter(2)
        );

        cy.get('[data-cy="end-experiment-time-range"] input').clear();
        cy.get('[data-cy="end-experiment-time-range"] input').type(
          getHourDateTimeAfter(50, 'days')
        );

        cy.get('[data-cy=btn-save-experiment-range-change]').click();

        cy.finishedLoading();

        cy.get(
          '[data-cy="experiment-time-outside-cycle-interval-warning"]'
        ).should('exist');
        cy.get(
          '[data-cy="experiment-time-outside-cycle-interval-warning"]'
        ).should(
          'contain.text',
          'Experiment time should be booked between call cycle start and end date'
        );

        cy.get('[data-cy="status-indicator"]').should('have.css', 'color');

        cy.get(
          '[data-cy="some-experiment-time-outside-cycle-interval-warning"]'
        ).should('exist');
        cy.get(
          '[data-cy="some-experiment-time-outside-cycle-interval-warning"]'
        )
          .should('have.attr', 'aria-label')
          .then((ariaLabel) => {
            expect(ariaLabel).not.to.be.empty;
          });
      });

      it('should be able to add and edit local contact on the timeslot', () => {
        cy.createEvent({ input: createdUserOperationsEvent });
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();
        cy.finishedLoading();

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

            cy.get('#notistack-snackbar').contains('Experiment time updated');

            cy.finishedLoading();

            cy.get('[data-cy="local-contact-details"]')
              .should('not.contain.text', 'None')
              .invoke('text')
              .should('not.equal', selectedLocalContactText);
          });
      });

      it('should be able to select and see local contact events in all views', () => {
        cy.createEvent({ input: createdUserOperationsEvent }).then((result) => {
          if (result.createScheduledEvent.scheduledEvent) {
            cy.updateEvent({
              input: {
                scheduledEventId: result.createScheduledEvent.scheduledEvent.id,
                localContact: existingInstrumentScientistId,
                startsAt: createdUserOperationsEvent.startsAt,
                endsAt: createdUserOperationsEvent.endsAt,
              },
            });
          }
        });
        cy.finishedLoading();

        cy.get('[data-cy="input-local-contact-select"] input').should(
          'not.be.disabled'
        );
        cy.get(
          '[data-cy="input-local-contact-select"] [aria-label="Open"]'
        ).click();
        cy.get(
          '[aria-labelledby=input-local-contact-select-label] [role=option]'
        )
          .last()
          .click();

        cy.finishedLoading();

        cy.get('.rbc-time-content .rbc-event')
          .last()
          .contains(existingProposalData.proposalId)
          .click();

        cy.finishedLoading();

        cy.contains(
          `${createdUserOperationsEvent.startsAt} - ${createdUserOperationsEvent.endsAt}`
        );

        cy.get('[data-cy="local-contact-details"] p')
          .should('not.contain.text', 'None')
          .invoke('text')
          .then((selectedLocalContactText) => {
            cy.get('[data-cy="btn-close-dialog"]').click();
            cy.finishedLoading();

            cy.get('[data-cy="scheduler-active-view"]').click();
            cy.get('[data-value="Timeline"]').click();

            cy.get('.react-calendar-timeline .rct-outer')
              .should('contain.text', 'local contacts')
              .and('contain.text', selectedLocalContactText);

            cy.contains(createdUserOperationsEvent.startsAt);
          });
      });

      it('should be able to open time slot by clicking on the calendar event', () => {
        cy.createEvent({ input: createdUserOperationsEvent });
        cy.finishedLoading();
        selectInstrument();
        cy.finishedLoading();

        cy.get('.rbc-time-content .rbc-event')
          .last()
          .contains(existingProposalData.proposalId)
          .click();

        cy.finishedLoading();

        cy.contains('Allocated time');
        cy.contains('Allocatable time');
        cy.get('[data-cy="startsAtInfo"]').should('exist');
        cy.get('[data-cy="endsAtInfo"]').should('exist');

        cy.contains(defaultEventBookingHourDateTime);
        cy.contains(getHourDateTimeAfter(24));

        cy.contains('Proposal title');
        cy.contains('Proposal ID');
        cy.get('[data-cy="experiment-time-wrapper"]')
          .get('[data-cy="delete-experiment-time"]')
          .should('exist');
      });

      it('should display time allocation left', () => {
        cy.createEvent({ input: createdUserOperationsEvent });
        cy.createEvent({ input: createdUserOperationsEvent });

        cy.finishedLoading();

        selectInstrument();
        openProposalBookingFromRightToolbar();

        cy.finishedLoading();

        cy.contains('Allocatable time')
          .parent()
          .should('contain.text', '0 seconds');
      });

      it('should be able to delete time slot', () => {
        cy.createEvent({ input: createdUserOperationsEvent });
        cy.finishedLoading();

        selectInstrument();
        openProposalBookingFromRightToolbar();

        cy.finishedLoading();
        cy.get('[data-cy="delete-experiment-time"]').click();

        cy.contains(/confirmation/i);
        cy.contains(
          /Are you sure you want to delete selected experiment time/i
        );

        cy.get('[data-cy="btn-ok"]').click();
        cy.finishedLoading();

        cy.contains(
          /No records to display\. Start by adding new experiment time/i
        );
      });

      it('should show warning when `startsAt` is after `endsAt`', () => {
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();
        cy.finishedLoading();
        cy.get('[data-cy="add-new-experiment-time"]').click();
        cy.finishedLoading();

        cy.get('[data-cy="startsAtInfo"]').click();
        cy.get('[data-cy="start-experiment-time-range"] input')
          .clear()
          .type(getHourDateTimeAfter(24));

        cy.get('[data-cy=btn-save-experiment-range-change]').click();

        cy.contains(/warning/i);
        cy.contains(/the starting date needs to be before the ending date/i);
        cy.get('[data-cy="btn-back"]').click();

        cy.get('[data-cy="start-experiment-time-range"] input')
          .clear()
          .type(getHourDateTimeAfter(23));

        cy.get('[data-cy="end-experiment-time-range"] input')
          .clear()
          .type(getHourDateTimeAfter(20));

        cy.get('[data-cy=btn-save-experiment-range-change]').click();

        cy.contains(/warning/i);
        cy.contains(/the starting date needs to be before the ending date/i);
      });

      it('should show confirmation when there are overlapping events', () => {
        cy.createEvent({ input: createdUserOperationsEvent });
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();
        cy.finishedLoading();
        cy.get('[data-cy="add-new-experiment-time"]').click();
        cy.finishedLoading();

        cy.get('[data-cy="startsAtInfo"]').click();
        cy.get('[data-cy="start-experiment-time-range"] input')
          .clear()
          .type(defaultEventBookingHourDateTime);

        cy.get('[data-cy="end-experiment-time-range"] input')
          .clear()
          .type(getHourDateTimeAfter(1));

        cy.get('[data-cy=btn-save-experiment-range-change]').click();

        cy.contains(/confirmation/i);
        cy.contains(/you have overlapping experiment times/i);
      });
    });

    describe('Equipment booking', () => {
      beforeEach(() => {
        cy.updateEquipment({
          id: existingEquipmentsData[0].id,
          updateEquipmentInput: {
            name: existingEquipmentsData[0].name,
            description: existingEquipmentsData[0].description,
            autoAccept: existingEquipmentsData[0].autoAccept,
            instrumentIds: [existingInstrument.id],
          },
        });
        cy.updateEquipment({
          id: existingEquipmentsData[1].id,
          updateEquipmentInput: {
            name: existingEquipmentsData[1].name,
            description: existingEquipmentsData[1].description,
            autoAccept: existingEquipmentsData[1].autoAccept,
            instrumentIds: [existingInstrument.id],
          },
        });
        cy.visit('/calendar');
      });
      it('should be able to assign available equipments to time slot and show warning if some equipments are not accepted', () => {
        cy.createEvent({ input: createdUserOperationsEvent });
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();
        cy.finishedLoading();
        cy.get('[data-cy="time-slot-booked-equipments-table"]').contains(
          /no records to display/i
        );
        cy.get('[data-cy=btn-book-equipment]').click();
        cy.finishedLoading();
        cy.get('[data-cy="select-equipment-table"]').should(
          'contain.text',
          existingEquipmentsData[0].name
        );
        cy.get('[data-cy="select-equipment-table"]').should(
          'contain.text',
          existingEquipmentsData[1].name
        );
        cy.get('[data-cy="select-equipment-table"]').should(
          'not.contain.text',
          existingEquipmentsData[2].name
        );
        cy.get('[data-cy="select-equipment-table"]').should(
          'not.contain.text',
          existingEquipmentsData[3].name
        );
        cy.get('[data-cy=enhanced-table-checkbox-0]').click();
        cy.get('[data-cy=enhanced-table-checkbox-1]').click();
        cy.get('[data-cy=btn-assign-equipment]').click();
        cy.get('[data-cy="time-slot-booked-equipments-table"]').should(
          'include.text',
          existingEquipmentsData[0].name
        );
        cy.get('[data-cy="time-slot-booked-equipments-table"]').should(
          'include.text',
          existingEquipmentsData[1].name
        );
        cy.get('[data-cy="accepted-equipment-warning"]').should(
          'contain.text',
          'Warning'
        );
        cy.get('[data-cy="accepted-equipment-warning"]').should(
          'contain.text',
          'All booked equipments must be accepted before activating the booking'
        );
      });
      it('Officer should be able to assign change equipment owner people', () => {
        cy.initializeSession('UserOfficer');
        let equipmentOwner: string;
        cy.visit('/equipments');
        cy.contains(existingEquipmentsData[0].name)
          .parent()
          .find('[data-testid="VisibilityIcon"]')
          .click();
        cy.get('[data-cy="equipment-owner"]').then((element) => {
          equipmentOwner = element.text();
        });
        cy.get('[data-cy="change-equipment-owner"]').click();
        cy.get(
          '[data-cy="equipment-responsible"] button[aria-label="Select user"]'
        )
          .first()
          .click();
        cy.get('[role=alert]').contains(/success/i);
        cy.get('[data-cy="equipment-owner"]').should((element) => {
          expect(element.text()).to.not.equal(equipmentOwner);
        });
      });
      it('Officer should be able to assign equipment responsible people', () => {
        cy.initializeSession('UserOfficer');
        cy.visit('/equipments');
        cy.contains(existingEquipmentsData[0].name)
          .parent()
          .find('[data-testid="VisibilityIcon"]')
          .click();
        cy.get('[data-cy="add-equipment-responsible"]').click();
        cy.get('input[type="checkbox"]').first().click();
        cy.get('[data-cy="assign-selected-users"]').click();
        cy.get('[role=alert]').contains(/success/i);
        cy.visit('/equipments');
        cy.contains(existingEquipmentsData[1].name)
          .parent()
          .find('[data-testid="VisibilityIcon"]')
          .click();
        cy.get('[data-cy="add-equipment-responsible"]').click();
        cy.get('input[type="checkbox"]').first().click();
        cy.get('[data-cy="assign-selected-users"]').click();
        cy.get('[role=alert]').contains(/success/i);
      });
    });

    describe('Equipment assigned to scheduled event tests', () => {
      beforeEach(() => {
        cy.updateEquipment({
          id: existingEquipmentsData[0].id,
          updateEquipmentInput: {
            name: existingEquipmentsData[0].name,
            description: existingEquipmentsData[0].description,
            autoAccept: existingEquipmentsData[0].autoAccept,
            instrumentIds: [existingInstrument.id],
          },
        });
        cy.updateEquipment({
          id: existingEquipmentsData[1].id,
          updateEquipmentInput: {
            name: existingEquipmentsData[1].name,
            description: existingEquipmentsData[1].description,
            autoAccept: existingEquipmentsData[1].autoAccept,
            instrumentIds: [existingInstrument.id],
          },
        });
        cy.createEvent({ input: createdUserOperationsEvent }).then((result) => {
          if (result.createScheduledEvent.scheduledEvent) {
            cy.assignEquipmentToScheduledEvent({
              assignEquipmentsToScheduledEventInput: {
                scheduledEventId: result.createScheduledEvent.scheduledEvent.id,
                equipmentIds: [1, 2],
                proposalBookingId: createdUserOperationsEvent.proposalBookingId,
              },
            });
          }
        });

        cy.visit('/calendar');
      });

      it('should not show already assigned equipments', () => {
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();
        cy.finishedLoading();
        cy.get('[data-cy=btn-book-equipment]').click();

        cy.contains(/no records to show/i);
      });

      it('should show the assignment status', () => {
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();
        cy.finishedLoading();
        cy.contains(existingEquipmentsData[0].name)
          .parent()
          .contains(/pending/i);
        cy.contains(existingEquipmentsData[1].name)
          .parent()
          .contains(/accepted/i);
      });

      it('should show available equipments that are booked by proposals that instrument scientist is part of even if he/she is not equipment owner or responsible', () => {
        cy.finishedLoading();

        cy.get('[data-cy="input-equipment-select"] input')
          .should('not.be.disabled')
          .click();

        cy.get('[role="presentation"]').contains(
          existingEquipmentsData[0].name
        );
        cy.get('[role="presentation"]').contains(
          existingEquipmentsData[1].name
        );

        cy.visit('/requests');

        cy.contains(existingEquipmentsData[0].name);
        cy.contains(existingEquipmentsData[1].name);
      });

      it('should be able to open time slot by clicking on the calendar equipment event', () => {
        cy.finishedLoading();
        cy.get('[data-cy="input-equipment-select"] input')
          .should('not.be.disabled')
          .click();
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

        cy.contains(existingEquipmentsData[0].name)
          .parent()
          .contains(defaultEventBookingHourDateTime);
        cy.contains(existingEquipmentsData[0].name)
          .parent()
          .contains(getHourDateTimeAfter(24));

        cy.contains(existingEquipmentsData[0].name)
          .parent()
          .find('[data-cy="accept-equipment-request"]')
          .should('exist');
        cy.contains(existingEquipmentsData[0].name)
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

        cy.contains(existingEquipmentsData[0].name)
          .parent()
          .find('[data-testid="VisibilityIcon"]')
          .click();

        cy.contains(existingEquipmentsData[0].name);

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
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();
        cy.finishedLoading();

        cy.contains(existingEquipmentsData[0].name)
          .parent()
          .find('button[aria-label="Delete"]')
          .click();

        cy.contains(/Are you sure you want to delete this row/i);

        cy.get('button[aria-label="Cancel"]').click();

        cy.contains(existingEquipmentsData[0].name)
          .parent()
          .find('button[aria-label="Delete"]')
          .click();

        cy.contains(/Are you sure you want to delete this row/i);

        cy.get('button[aria-label="Save"]').click();

        cy.finishedLoading();

        cy.get('[role=alert]').contains(/removed/i);
        cy.contains(existingEquipmentsData[1].name);
        cy.should('not.contain', existingEquipmentsData[0].name);
      });

      it('should show the assigned time slot on the equipment page', () => {
        cy.visit('/equipments');
        cy.contains(existingEquipmentsData[1].name)
          .parent()
          .find('[data-testid="VisibilityIcon"]')
          .click();

        cy.contains(existingEquipmentsData[1].name);

        cy.finishedLoading();

        cy.contains(createdUserOperationsEvent.startsAt);
        cy.contains(createdUserOperationsEvent.endsAt);
      });
    });

    describe('Review', () => {
      it('should request confirmation to activate proposal booking', () => {
        cy.visit('/calendar');
        cy.createEvent({ input: createdUserOperationsEvent });
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();
        cy.finishedLoading();
        cy.get('[data-cy="activate-experiment-time"]').click();

        cy.get('[data-cy="btn-ok"]').click();

        cy.contains(/lost time/i);
        cy.get(
          '[data-cy="time-slot-booked-equipments-table"] [aria-label="Book equipment"]'
        ).should('not.exist');

        cy.get('[data-cy="status-indicator"]').should('have.css', 'color');
      });
    });

    describe('Final', () => {
      let createdEventId: number;

      beforeEach(() => {
        cy.createEvent({ input: createdUserOperationsEvent }).then((result) => {
          if (result.createScheduledEvent.scheduledEvent) {
            createdEventId = result.createScheduledEvent.scheduledEvent.id;

            cy.activateEvent({
              input: {
                ids: [result.createScheduledEvent.scheduledEvent.id],
              },
            });
          }
        });
        cy.visit('/calendar');
      });

      it('should be able to log lost time', () => {
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();
        cy.finishedLoading();
        cy.get('[data-cy=btn-add-lost-time]').click();

        cy.get('[data-cy="time-slot-lost-times-table"]').contains(
          getCurrentHourDateTime()
        );
        cy.get('[data-cy="time-slot-lost-times-table"]').contains(
          getHourDateTimeAfter(1, 'hour', getCurrentHourDateTime())
        );
      });

      it('should be able to restart experiment time process', () => {
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();
        cy.finishedLoading();

        cy.get('[aria-label=experiment-time-finalization-strategy]').click();

        cy.contains(/restart the experiment time/i).click();

        cy.contains(/restart the experiment time/i).as('restartBooking');

        cy.get('@restartBooking').should('not.be.disabled').click();

        cy.contains(
          'Are you sure you want to restart the selected experiment time'
        );

        cy.get('[data-cy="btn-ok"]').click();

        cy.finishedLoading();

        cy.get('[data-cy="btn-book-equipment"]').should('exist');
      });

      it('should be able to edit lost time', () => {
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();
        cy.finishedLoading();

        cy.get('[data-cy=btn-add-lost-time]').click();

        cy.get(
          '[data-cy="time-slot-lost-times-table"] tbody tr [aria-label="Edit"]'
        )
          .first()
          .click();

        cy.get('[data-cy="startsAt"] input').clear();
        cy.get('[data-cy="endsAt"] input').clear();

        cy.get(
          '[data-cy="time-slot-lost-times-table"] tbody tr [aria-label="Save"]'
        )
          .first()
          .click();

        cy.chooseDatePicker('[data-cy="startsAt"]', getHourDateTimeAfter(24));
        cy.chooseDatePicker('[data-cy="endsAt"]', getHourDateTimeAfter(25));

        cy.get(
          '[data-cy="time-slot-lost-times-table"] tbody tr [aria-label="Save"]'
        )
          .first()
          .click();

        cy.contains(getHourDateTimeAfter(24));
        cy.contains(getHourDateTimeAfter(25));

        cy.get(
          '[data-cy="time-slot-lost-times-table"] tbody tr [aria-label="Edit"]'
        )
          .first()
          .click();

        cy.chooseDatePicker('[data-cy="startsAt"]', getHourDateTimeAfter(48));
        cy.chooseDatePicker('[data-cy="endsAt"]', getHourDateTimeAfter(49));

        cy.get(
          '[data-cy="time-slot-lost-times-table"] tbody tr [aria-label="Cancel"]'
        )
          .first()
          .click();

        cy.contains(getHourDateTimeAfter(24));
        cy.contains(getHourDateTimeAfter(25));
      });

      it('should be able to delete lost time', () => {
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();
        cy.finishedLoading();
        cy.get('[data-cy=btn-add-lost-time]').click();
        cy.get(
          '[data-cy="time-slot-lost-times-table"] tbody tr [aria-label="Delete"]'
        )
          .first()
          .click();

        cy.get(
          '[data-cy="time-slot-lost-times-table"] tbody tr [aria-label="Save"]'
        )
          .first()
          .click();

        cy.contains(/no records to display/i);
      });

      it('should show error when `startsAt` is after `endsAt`', () => {
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();
        cy.finishedLoading();

        cy.get('[data-cy="btn-add-lost-time"]').click();
        cy.finishedLoading();
        cy.get(
          '[data-cy="time-slot-lost-times-table"] tbody tr [aria-label="Edit"]'
        )
          .first()
          .click();

        cy.chooseDatePicker('[data-cy="startsAt"]', getHourDateTimeAfter(48));
        cy.chooseDatePicker('[data-cy="endsAt"]', getHourDateTimeAfter(24));

        cy.get(
          '[data-cy="time-slot-lost-times-table"] tbody tr span[aria-label="Save"] button'
        ).should('be.disabled');

        cy.get('[data-cy="endsAt"] p.Mui-error').should(
          'include.text',
          'End date should be after start date'
        );
      });

      it('should show confirmation when there are overlapping lost time events', () => {
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();
        cy.finishedLoading();
        cy.get('[data-cy=btn-add-lost-time]').click();
        cy.finishedLoading();
        cy.get('[data-cy=btn-add-lost-time]').click();
        cy.finishedLoading();
        cy.get(
          '[data-cy="time-slot-lost-times-table"] tbody tr [aria-label="Edit"]'
        )
          .last()
          .click();

        cy.chooseDatePicker('[data-cy="startsAt"]', getCurrentHourDateTime());
        cy.chooseDatePicker(
          '[data-cy="endsAt"]',
          getHourDateTimeAfter(1, 'hour', getCurrentHourDateTime())
        );

        cy.get(
          '[data-cy="time-slot-lost-times-table"] tbody tr [aria-label="Save"]'
        )
          .first()
          .click();

        cy.finishedLoading();

        cy.contains(/complete the experiment time/i).click();

        cy.contains(/confirmation/i);
        cy.contains(/you have overlapping experiment times/i);
      });

      it('should be able to complete the experiment time process', () => {
        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();
        cy.finishedLoading();

        cy.contains(/complete the experiment time/i).as(
          'completeTimeSlotBooking'
        );

        cy.get('@completeTimeSlotBooking')
          .scrollIntoView()
          .should('not.be.disabled')
          .click();
        cy.get('[data-cy="btn-ok"]').click();

        cy.contains(
          /Experiment time is already completed and it's not editable/i
        );
        cy.get('[data-cy="proposal-booking-completed-info"]')
          .should('have.attr', 'aria-label')
          .then((ariaLabel) => {
            expect(ariaLabel).not.to.be.empty;
          });

        cy.get('[data-cy="status-indicator"]')
          .should('have.css', 'color')
          .and('eq', 'rgba(0, 0, 0, 0.26)');
      });

      it('Completed events should have gray color and opacity', () => {
        cy.completeEvent({
          input: {
            id: createdEventId,
            action: ProposalBookingFinalizeAction.COMPLETE,
          },
        });
        cy.visit('/calendar');
        cy.finishedLoading();

        selectInstrument();
        cy.finishedLoading();
        cy.get('#instrument-calls-tree-view [role=treeitem]').first().click();

        cy.get(
          `[data-cy="proposal-event-${existingProposalData.title}-${existingProposalData.proposalId}"]`
        ).should('contain.text', '[Completed]');

        cy.get(
          '#instrument-calls-tree-view [role=treeitem] [role=group] [role=treeitem]'
        )
          .first()
          .should(
            'contain.text',
            `${existingProposalData.proposer} - (${existingProposalData.proposalId})`
          )
          .and('contain.text', '[Completed]');

        cy.get(
          `[data-cy="proposal-event-${existingProposalData.title}-${existingProposalData.proposalId}"]`
        )
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
        cy.completeEvent({
          input: {
            id: createdEventId,
            action: ProposalBookingFinalizeAction.COMPLETE,
          },
        });
        cy.initializeSession('InstrumentScientist_1');

        cy.visit('/calendar');

        cy.finishedLoading();
        selectInstrument();
        openProposalBookingFromRightToolbar();

        cy.get('#vertical-tab-0').click();

        cy.finishedLoading();

        cy.get('[data-cy="btn-reopen-experiment-time"]').should('not.exist');
      });

      it('User officer should be able to re-open completed events', () => {
        cy.completeEvent({
          input: {
            id: createdEventId,
            action: ProposalBookingFinalizeAction.COMPLETE,
          },
        });
        cy.initializeSession('UserOfficer');

        cy.visit('/calendar');

        cy.finishedLoading();
        selectInstrument(existingInstruments[0].name);
        openProposalBookingFromRightToolbar();

        cy.get('#vertical-tab-0').click();

        cy.finishedLoading();

        cy.get('[data-cy="btn-reopen-experiment-time"]')
          .should('include.text', 'Reopen the experiment time')
          .click();

        cy.contains(/confirmation/i);
        cy.contains(
          /Are you sure you want to re-open the selected experiment time/i
        );

        cy.get('[data-cy="btn-ok"]').click();

        cy.finishedLoading();

        cy.get('[aria-label="Add experiment lost time"]').should('exist');
        cy.contains('Complete the experiment time');
      });
    });
  });
});
