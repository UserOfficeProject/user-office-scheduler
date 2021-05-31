context('Not-authenticated tests', () => {
  before(() => {
    cy.resetDB();
    cy.resetSchedulerDB();
  });

  beforeEach(() => {
    cy.clearCookies();
    cy.visit({
      url: '/calendar',
      timeout: 15000,
    });
  });

  describe('Not authenticated access', () => {
    it('should show the `Not authenticated` page', () => {
      cy.url().should('include', '/not-authenticated');
      cy.contains(/you are not authenticated/i);
      cy.contains(/click here to authenticate/i);
    });

    it('should redirect when clicking the auth button', () => {
      cy.wait(1000);
      cy.get('[data-cy=btn-authenticate]').click();
      cy.wait(1000);
      cy.url().should('include', 'authRedirect');
    });
  });
});
