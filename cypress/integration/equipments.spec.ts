import faker from 'faker';

import { ScheduledEventBookingType } from '../../src/generated/sdk';
import {
  defaultEventBookingHourDateTime,
  getCurrentHourDateTime,
  getHourDateTimeAfter,
} from '../utils';

const existingProposalBookingId = 1;
const existingInstrumentId = 1;

const newEquipment = {
  name: faker.random.words(2),
  description: '',
  autoAccept: false,
};

const createdUserOperationsEvent = {
  instrumentId: existingInstrumentId,
  proposalBookingId: existingProposalBookingId,
  bookingType: ScheduledEventBookingType.USER_OPERATIONS,
  startsAt: defaultEventBookingHourDateTime,
  endsAt: getHourDateTimeAfter(24),
};

context('Equipment tests', () => {
  beforeEach(() => {
    cy.resetDB(true);
    cy.resetSchedulerDB(true);
    cy.initializeSession('UserOfficer');
    cy.visit({
      url: '/equipments',
      timeout: 15000,
    });
  });

  describe('Add equipment', () => {
    it('should be able to add a new equipment', () => {
      cy.get('[data-cy=btn-new-equipment]').click();

      cy.get('[data-cy=name]').type(newEquipment.name);
      cy.get('[data-cy=btn-save-equipment]').click();

      cy.contains(newEquipment.name);
      cy.contains(/Anders Andersson/i);
      cy.contains(/Has no scheduled maintenance/i);
    });
  });

  describe('Edit equipment', () => {
    let createdEquipmentId: number;

    beforeEach(() => {
      cy.createEquipment({ newEquipmentInput: newEquipment }).then((result) => {
        if (result.createEquipment.equipment) {
          createdEquipmentId = result.createEquipment.equipment.id;
        } else {
          throw new Error('Equipment creation failed');
        }
      });
      cy.contains('5 rows').click();
      cy.get('.MuiTablePagination-menuItem[data-value="10"]').click();

      cy.contains(newEquipment.name)
        .parent()
        .find('[data-testid="VisibilityIcon"]')
        .click();

      cy.contains(newEquipment.name);
    });

    it('should be able to add equipment description', () => {
      const newDescription = faker.random.words(3);

      cy.get('[data-cy=btn-edit-equipment]').click();
      cy.get('[data-cy="description"]').type(newDescription);

      cy.get('[data-cy=btn-save-equipment]').click();
      cy.finishedLoading();
      cy.contains(newDescription);

      cy.get('.MuiDrawer-root').contains('Equipment list').click();

      cy.contains('5 rows').click();
      cy.get('.MuiTablePagination-menuItem[data-value="10"]').click();

      cy.finishedLoading();
      cy.contains(newEquipment.name).parent().contains(newDescription);
    });

    it('should be able to change equipment color', () => {
      const newColorHex = '#ff0000'; // Red color HEX
      const newColorRgb = 'rgb(255, 0, 0)'; // Red color RGB
      cy.createEvent({ input: createdUserOperationsEvent }).then((result) => {
        const newCreatedEvent = result.createScheduledEvent.scheduledEvent;
        if (newCreatedEvent) {
          cy.assignEquipmentToScheduledEvent({
            assignEquipmentsToScheduledEventInput: {
              equipmentIds: [createdEquipmentId],
              scheduledEventId: newCreatedEvent.id,
              proposalBookingId: existingProposalBookingId,
            },
          });
        }
      });

      cy.get('[data-cy=btn-edit-equipment]').click();

      cy.get('[data-cy="color"] input[type="color"]')
        .invoke('val', newColorHex)
        .trigger('input');

      // NOTE: cy.tick and wait is used to be able to execute the handleColorChange because it's debounced with 500ms.
      cy.tick(500);
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);

      cy.get('[data-cy=btn-save-equipment]').click();
      cy.finishedLoading();
      cy.contains(newColorHex);

      cy.get('.MuiDrawer-root').contains('Equipment list').click();

      cy.contains('5 rows').click();
      cy.get('.MuiTablePagination-menuItem[data-value="10"]').click();

      cy.finishedLoading();
      cy.contains(newEquipment.name).parent().contains(newColorHex);

      cy.contains('Calendar').click();

      cy.finishedLoading();

      cy.get('[data-cy=input-equipment-select]').click();

      cy.get('[aria-labelledby=input-equipment-select-label] [role=option]')
        .contains(newEquipment.name)
        .click();

      cy.finishedLoading();

      cy.get('.rbc-calendar')
        .contains(newEquipment.name)
        .closest('.rbc-event')
        .should('have.attr', 'style')
        .and('include', `background: ${newColorRgb}`);
    });

    it('should be able to turn on auto accept', () => {
      cy.get('[data-cy=btn-edit-equipment]').click();
      cy.get('[data-cy=autoAccept]').click();

      cy.get('[data-cy=btn-save-equipment]').click();
      cy.finishedLoading();
      cy.get('[data-cy=autoAccept]').contains('Yes');
    });

    it('should be able to set under maintenance indefinitely', () => {
      cy.get('[data-cy=btn-edit-equipment]').click();
      cy.get('[data-cy=underMaintenance]').click();

      cy.get('[data-cy=btn-save-equipment]').click();

      cy.contains(/Under maintenance indefinitely/i);
    });

    it('should be able to turn off maintenance', () => {
      cy.updateEquipment({
        id: createdEquipmentId,
        updateEquipmentInput: {
          ...newEquipment,
          maintenanceStartsAt: getCurrentHourDateTime(),
        },
      });
      cy.get('[data-cy=btn-edit-equipment]').click();
      cy.get('[data-cy=underMaintenance]').click();

      cy.get('[data-cy=btn-save-equipment]').click();

      cy.contains(/Has no scheduled maintenance/i);
    });

    it('should be able to set under maintenance for a specified interval', () => {
      cy.get('[data-cy=btn-edit-equipment]').click();
      cy.get('[data-cy=underMaintenance]').click();
      cy.get('[data-cy=maintenanceTime-defined]').click();

      cy.get('[data-cy="start-equipment-maintanance-time-range"] input')
        .clear()
        .type(getHourDateTimeAfter(-24));
      cy.get('[data-cy="end-equipment-maintanance-time-range"] input')
        .clear()
        .type(getHourDateTimeAfter(48));

      cy.get('[data-cy=btn-save-equipment]').click();

      cy.contains(`${getHourDateTimeAfter(-24)} - ${getHourDateTimeAfter(48)}`);
    });
  });
});
