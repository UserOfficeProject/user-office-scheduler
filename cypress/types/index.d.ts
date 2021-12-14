import {
  CreateScheduledEventMutation,
  CreateScheduledEventMutationVariables,
} from '../../src/generated/sdk';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Resets database.
       *
       * @returns {typeof resetDB}
       * @memberof Chainable
       * @example
       *    cy.resetDB()
       */
      resetDB: (includeSeeds?: boolean) => void;
      resetSchedulerDB: (includeSeeds?: boolean) => void;
      initializeSession(token: string): void;
      configureSession(token: string): void;
      configureClock(): void;
      createEvent(
        createScheduledEventInput: CreateScheduledEventMutationVariables
      ): Cypress.Chainable<CreateScheduledEventMutation>;

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
}
