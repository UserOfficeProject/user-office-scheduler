// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --

Cypress.Commands.add('initializeSession', token => {
  cy.configureClock();
  cy.configureSession(token);
});

Cypress.Commands.add('configureClock', () => {
  const now = new Date(Date.UTC(2020, 8, 21, 12, 0, 0)).getTime();

  cy.clock(now, ['Date']);
});

Cypress.Commands.add('configureSession', token => {
  cy.clearCookies();

  cy.fixture('tokens').then(tokens => {
    cy.setCookie('token', tokens[token], {
      path: '/',
      secure: false,
    });
  });
});
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
