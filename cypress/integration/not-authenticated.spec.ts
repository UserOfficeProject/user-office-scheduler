context('Not-authenticated tests', () => {
  beforeEach(() => {
    cy.resetDB(true);
    cy.resetSchedulerDB(true);
    cy.clearCookies();
    cy.visit('/calendar');
  });

  describe('Not authenticated access', () => {
    it('should show the `Not authenticated` page', () => {
      cy.url().should('include', '/not-authenticated');
      cy.contains(/you are not authenticated/i);
      cy.contains(/click here to authenticate/i);
    });

    it('should redirect when clicking the auth button', () => {
      cy.get('[data-cy=btn-authenticate]').click();
      cy.url().should('include', 'authRedirect');
    });
  });
});
