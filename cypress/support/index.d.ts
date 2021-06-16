/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    initializeSession(token: string): void;
    configureSession(token: string): void;
    configureClock(): void;
    resetDB(): void;
    resetSchedulerDB(): void;
    /**
     * Checks if the progress bar does not exist in the dom anymore.
     *
     * @returns {typeof finishedLoading}
     * @memberof Chainable
     * @example
     *    cy.finishedLoading()
     */
    finishedLoading: () => void;
  }
}
