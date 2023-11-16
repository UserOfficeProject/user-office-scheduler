import { faker } from '@faker-js/faker';
import { ScheduledEventBookingType } from '@user-office-software-libs/shared-types';

import initialDBData from '../support/initialDBData';
import {
  defaultEventBookingHourDateTime,
  getCurrentHourDateTime,
  getHourDateTimeAfter,
  getHourDateTimeAfterWithoutSpaces,
} from '../utils';

const newEquipment = {
  name: faker.random.words(2),
  description: '',
  autoAccept: false,
  ownerUserId: 1,
};

const createdUserOperationsEvent = {
  instrumentId: initialDBData.instruments[0].id,
  proposalBookingId: initialDBData.proposalBooking.id,
  bookingType: ScheduledEventBookingType.USER_OPERATIONS,
  startsAt: defaultEventBookingHourDateTime,
  endsAt: getHourDateTimeAfter(24),
};

context('Equipment tests', () => {
  beforeEach(() => {
    cy.resetDB(true);
    cy.resetSchedulerDB(true);
    cy.login('officer');
    cy.visit('/equipments');
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

    it('should be able to add equipment instruments and not allowed to remove if there are events', () => {
      cy.get('[data-cy=btn-edit-equipment]').click();
      cy.get('[data-cy="equipment-instruments"] input').click();

      cy.get('[role="presentation"] ul li')
        .contains(initialDBData.instruments[0].name)
        .click();

      cy.get('[data-cy=btn-save-equipment]').click();
      cy.finishedLoading();
      cy.contains(initialDBData.instruments[0].name);

      cy.get('.MuiDrawer-root').contains('Equipment list').click();

      cy.contains('5 rows').click();
      cy.get('.MuiTablePagination-menuItem[data-value="10"]').click();

      cy.finishedLoading();
      cy.contains(newEquipment.name)
        .parent()
        .contains(initialDBData.instruments[0].name);

      cy.createEvent({ input: createdUserOperationsEvent }).then((result) => {
        const newCreatedEvent = result.createScheduledEvent.scheduledEvent;
        if (newCreatedEvent) {
          cy.assignEquipmentToScheduledEvent({
            assignEquipmentsToScheduledEventInput: {
              equipmentIds: [createdEquipmentId],
              scheduledEventId: newCreatedEvent.id,
              proposalBookingId: initialDBData.proposalBooking.id,
            },
          });
        }
      });

      cy.visit(`/equipments/${createdEquipmentId}/edit`);

      cy.finishedLoading();

      cy.get(
        '[data-cy="equipment-instruments"] [data-testid="CancelIcon"]'
      ).click();
      cy.get('[data-cy=btn-save-equipment]').click();
      cy.contains('operation is not allowed', { matchCase: false });

      cy.get('[data-cy="equipment-instruments"]').should(
        'contain.text',
        initialDBData.instruments[0].name
      );

      cy.get('.MuiDrawer-root').contains('Equipment list').click();

      cy.contains('5 rows').click();
      cy.get('.MuiTablePagination-menuItem[data-value="10"]').click();

      cy.finishedLoading();
      cy.contains(newEquipment.name)
        .parent()
        .contains(initialDBData.instruments[0].name);
    });

    it('should be able to change equipment color', () => {
      cy.configureClock();
      const newColorHex = '#ff0000'; // Red color HEX
      const newColorRgb = 'rgb(255, 0, 0)'; // Red color RGB
      cy.updateEquipment({
        id: createdEquipmentId,
        updateEquipmentInput: {
          ...newEquipment,
          instrumentIds: [initialDBData.instruments[0].id],
        },
      }).then(() => {
        cy.createEvent({ input: createdUserOperationsEvent }).then((result) => {
          const newCreatedEvent = result.createScheduledEvent.scheduledEvent;
          if (newCreatedEvent) {
            cy.assignEquipmentToScheduledEvent({
              assignEquipmentsToScheduledEventInput: {
                equipmentIds: [createdEquipmentId],
                scheduledEventId: newCreatedEvent.id,
                proposalBookingId: initialDBData.proposalBooking.id,
              },
            });
          }
        });
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

      cy.get('.MuiDrawer-root').contains('Equipment list').click();

      cy.contains('5 rows').click();
      cy.get('.MuiTablePagination-menuItem[data-value="10"]').click();

      cy.finishedLoading();
      cy.contains(newEquipment.name)
        .parent()
        .should('include.html', newColorRgb);

      cy.contains(newEquipment.name)
        .parent()
        .find('[data-testid="VisibilityIcon"]')
        .click();

      cy.finishedLoading();

      cy.get('[data-cy="equipment-color"]')
        .parent()
        .should('include.html', `background-color: ${newColorRgb}`);

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

      cy.get('[data-cy="maintenanceStartsAt"]')
        .clear()
        .type(getHourDateTimeAfterWithoutSpaces(-24));
      cy.get('[data-cy="maintenanceEndsAt"]')
        .clear()
        .type(getHourDateTimeAfterWithoutSpaces(48));

      cy.get('[data-cy=btn-save-equipment]').click();

      cy.contains(`${getHourDateTimeAfter(-24)} - ${getHourDateTimeAfter(48)}`);
    });

    it('Should be able to accept equipment request one by one booked on same event', () => {
      cy.updateEquipment({
        id: initialDBData.equipments[0].id,
        updateEquipmentInput: {
          name: initialDBData.equipments[0].name,
          description: initialDBData.equipments[0].description,
          autoAccept: initialDBData.equipments[0].autoAccept,
          ownerUserId: initialDBData.equipments[0].ownerUserId,
          instrumentIds: [initialDBData.instruments[0].id],
        },
      });
      cy.updateEquipment({
        id: initialDBData.equipments[1].id,
        updateEquipmentInput: {
          name: initialDBData.equipments[1].name,
          description: initialDBData.equipments[1].description,
          autoAccept: false,
          ownerUserId: initialDBData.equipments[1].ownerUserId,
          instrumentIds: [initialDBData.instruments[0].id],
        },
      });
      cy.createEvent({ input: createdUserOperationsEvent }).then((result) => {
        if (result.createScheduledEvent.scheduledEvent) {
          cy.assignEquipmentToScheduledEvent({
            assignEquipmentsToScheduledEventInput: {
              scheduledEventId: result.createScheduledEvent.scheduledEvent.id,
              equipmentIds: [
                initialDBData.equipments[0].id,
                initialDBData.equipments[1].id,
              ],
              proposalBookingId: createdUserOperationsEvent.proposalBookingId,
            },
          });
        }
      });

      cy.visit('/requests');

      cy.get(
        '[data-cy="equipments-requests-table"] [aria-label="Accept request"]'
      ).should('have.length', 2);

      cy.get(
        '[data-cy="equipments-requests-table"] [aria-label="Accept request"]'
      )
        .first()
        .click();

      cy.get('[data-cy="btn-ok"]').click();

      cy.get('[role=alert]').contains(/success/i);

      cy.get(
        '[data-cy="equipments-requests-table"] [aria-label="Accept request"]'
      ).should('have.length', 1);
    });
  });
});
