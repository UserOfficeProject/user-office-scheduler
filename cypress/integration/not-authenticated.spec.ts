/// <reference types="Cypress" />

beforeEach(() => {
  const now = new Date(Date.UTC(2020, 8, 21, 12, 0, 0)).getTime();

  cy.clearCookies();
  cy.clock(now);
  cy.visit({
    url: '/calendar',
    timeout: 15000,
  });
});

describe('Not authenticated access', () => {
  it('should show the `Not authenticated` page', () => {
    cy.url().should('include', '/not-authenticated');
    cy.contains('You are not authenticated');
    cy.contains('Click here to authenticate');
  });

  it('should redirect when clicking the auth button', () => {
    cy.get('[data-cy=btn-authenticate]').click();

    cy.url().should('include', '/shared-auth');
  });
});
