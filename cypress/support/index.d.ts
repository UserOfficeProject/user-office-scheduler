/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    initializeSession(token: string): void;
    configureSession(token: string): void;
    configureClock(): void;
  }
}
