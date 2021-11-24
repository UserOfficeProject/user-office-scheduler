import { getHourDateTimeAfter } from '../utils';

context('Equipment tests', () => {
  before(() => {
    cy.resetDB();
    cy.resetSchedulerDB();
  });

  beforeEach(() => {
    cy.initializeSession('UserOfficer');

    cy.visit({
      url: '/equipments',
      timeout: 15000,
    });
  });

  describe('Add equipment', () => {
    it('should be able to add a new equipment', () => {
      cy.get('[data-cy=btn-new-equipment]').click();

      cy.get('[data-cy=name]').type('1 Test equipment');
      cy.get('[data-cy=btn-save-equipment]').click();

      cy.contains(/1 Test equipment/i);
      cy.contains(/Anders Andersson/i);
      cy.contains(/Has no scheduled maintenance/i);
    });
  });

  describe('Edit equipment', () => {
    beforeEach(() => {
      cy.contains('1 Test equipment')
        .parent()
        .find('[title="View equipment"]')
        .click();

      cy.contains(/1 Test equipment/i);
    });

    it('should be able to add equipment description', () => {
      cy.get('[data-cy=btn-edit-equipment]').click();
      cy.get('[data-cy="description"]').type('1 Test equipment description');

      cy.get('[data-cy=btn-save-equipment]').click();
      cy.finishedLoading();
      cy.contains(/1 Test equipment description/i);

      cy.get('.MuiDrawer-root').contains('Equipment list').click();

      cy.finishedLoading();
      cy.contains(/1 Test equipment/i)
        .parent()
        .contains(/1 Test equipment description/i);
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
      cy.get('[data-cy=btn-edit-equipment]').click();
      cy.get('[data-cy=underMaintenance]').click();

      cy.get('[data-cy=btn-save-equipment]').click();

      cy.contains(/Has no scheduled maintenance/i);
    });

    it('should be able to set under maintenance for a specified interval', () => {
      cy.get('[data-cy=btn-edit-equipment]').click();
      cy.get('[data-cy=underMaintenance]').click();
      cy.get('[data-cy=maintenanceTime-defined]').click();

      cy.get('[data-cy=maintenanceStartsAt] input').clear();
      cy.get('[data-cy=maintenanceStartsAt]').type(getHourDateTimeAfter(-24));
      cy.get('[data-cy=maintenanceEndsAt]').type(getHourDateTimeAfter(48));

      cy.get('[data-cy=btn-save-equipment]').click();

      cy.contains(`${getHourDateTimeAfter(-24)} - ${getHourDateTimeAfter(48)}`);
    });
  });
});
