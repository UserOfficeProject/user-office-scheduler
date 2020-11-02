beforeEach(() => {
  cy.clearCookies();
  cy.configureClock();
});

describe('Users with wrong roles', () => {
  it('should show the `Not authenticated` page', () => {
    cy.configureSession('NotUserInstrumentScientist');

    cy.visit({
      url: '/calendar',
      timeout: 15000,
    });

    cy.url().should('include', '/not-authenticated');
    cy.contains(/you are not authenticated/i);
    cy.contains(/click here to authenticate/i);
  });
});

describe('Users with right roles', () => {
  it('should show every every instruments for user with `User officer` role', () => {
    cy.configureSession('UserOfficer');

    cy.visit({
      url: '/calendar',
      timeout: 15000,
    });

    cy.get('[data-cy=input-instrument-select]').click();

    cy.get('[aria-labelledby=input-instrument-select-label]').as('instruments');

    cy.get('@instruments')
      .children()
      .should('have.length', 2);
    cy.get('@instruments')
      .children()
      .contains(/instrument 1/i);
    cy.get('@instruments')
      .children()
      .contains(/instrument 2/i);
  });

  it('should show only assigned instruments for user with `Instrument scientist` role', () => {
    cy.configureSession('InstrumentScientist_1');

    cy.visit({
      url: '/calendar',
      timeout: 15000,
    });

    cy.get('[data-cy=input-instrument-select]').click();

    cy.get('[aria-labelledby=input-instrument-select-label]').as('instruments');

    cy.get('@instruments')
      .children()
      .should('have.length', 1);
    cy.get('@instruments')
      .children()
      .contains(/instrument 1/i);

    cy.configureSession('InstrumentScientist_2');
    cy.visit({
      url: '/calendar',
      timeout: 15000,
    });

    cy.get('[data-cy=input-instrument-select]').click();

    cy.get('[aria-labelledby=input-instrument-select-label]').as('instruments');

    cy.get('@instruments')
      .children()
      .should('have.length', 1);

    cy.get('@instruments')
      .children()
      .contains(/instrument 2/i);
  });

  it('should show only scheduled events assigned to specific instrument', () => {
    cy.configureSession('InstrumentScientist_1');

    cy.visit({
      url: '/calendar?instrument=1',
      timeout: 15000,
    });

    cy.get("[title='12:00 – 14:00: Maintenance']").should('exist');
    cy.get("[title='10:00 – 12:00: Maintenance']").should('not.exist');
    cy.configureSession('InstrumentScientist_2');
    cy.visit({
      url: '/calendar?instrument=2',
      timeout: 15000,
    });

    cy.get("[title='12:00 – 14:00: Maintenance']").should('not.exist');
    cy.get("[title='10:00 – 12:00: Maintenance']").should('exist');
  });
});
