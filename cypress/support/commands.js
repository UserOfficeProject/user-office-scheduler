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
Cypress.Commands.add('initializeSession', () => {
  const now = new Date(Date.UTC(2020, 8, 21, 12, 0, 0)).getTime();

  cy.clearCookies();

  cy.setCookie(
    'token',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1c2VyX3RpdGxlIjoiTXIuIiwiZmlyc3RuYW1lIjoiQW5kZXJzIiwibWlkZGxlbmFtZSI6IkFkYW0iLCJsYXN0bmFtZSI6IkFuZGVyc3NvbiIsInVzZXJuYW1lIjoidGVzdG9mZmljZXIiLCJwcmVmZXJyZWRuYW1lIjoiUmhpYW5ub24iLCJvcmNpZCI6Ijg3ODMyMTg5NyIsInJlZnJlc2hUb2tlbiI6IjEyMzEyMzEyMyIsImdlbmRlciI6Im1hbGUiLCJuYXRpb25hbGl0eSI6MSwiYmlydGhkYXRlIjoiMTk4MS0wOC0wNFQyMjowMDowMC4wMDBaIiwib3JnYW5pc2F0aW9uIjoxLCJkZXBhcnRtZW50IjoiSVQgZGVwYXJ0bWVudCIsInBvc2l0aW9uIjoiTGlhaXNvbiIsImVtYWlsIjoiQWFyb25fSGFycmlzNDlAZ21haWwuY29tIiwiZW1haWxWZXJpZmllZCI6dHJ1ZSwidGVsZXBob25lIjoiNzExLTMxNi01NzI4IiwidGVsZXBob25lX2FsdCI6IjEtMzU5LTg2NC0zNDg5IHg3MzkwIiwicGxhY2Vob2xkZXIiOmZhbHNlLCJjcmVhdGVkIjoiMjAyMC0xMC0xM1QwODoyMjoxNS4yNTRaIiwidXBkYXRlZCI6IjIwMjAtMTAtMTNUMDg6MjI6MTUuNjMxWiJ9LCJyb2xlcyI6W3siaWQiOjIsInNob3J0Q29kZSI6InVzZXJfb2ZmaWNlciIsInRpdGxlIjoiVXNlciBPZmZpY2VyIn1dLCJjdXJyZW50Um9sZSI6eyJpZCI6Miwic2hvcnRDb2RlIjoidXNlcl9vZmZpY2VyIiwidGl0bGUiOiJVc2VyIE9mZmljZXIifSwiaWF0IjoxNjAyNTg2OTg5LCJleHAiOjQ3NTgzNDY5ODl9.h7MUnQyG2bALSwvpuHSXHzF8HXmoltPkqgiPN6GiS6g',
    { path: '/', secure: false }
  );
  cy.clock(now);
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
