/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    initializeSession(): void;
  }
}
