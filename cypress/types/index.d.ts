import {
  ActivateScheduledEventMutation,
  ActivateScheduledEventMutationVariables,
  AssignEquipmentToScheduledEventMutation,
  AssignEquipmentToScheduledEventMutationVariables,
  CreateEquipmentMutation,
  CreateEquipmentMutationVariables,
  CreateScheduledEventMutation,
  CreateScheduledEventMutationVariables,
  FinalizeScheduledEventMutationVariables,
  FinalizeScheduledEventMutation,
  UpdateEquipmentMutation,
  UpdateEquipmentMutationVariables,
  UpdateScheduledEventMutation,
  UpdateScheduledEventMutationVariables,
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
      /**
       * Checks if the progress bar does not exist in the dom anymore.
       *
       * @returns {typeof finishedLoading}
       * @memberof Chainable
       * @example
       *    cy.finishedLoading()
       */
      finishedLoading: () => void;
      /**
       * Checks if the datepicker is mobile or desktop and use the proper way of clearing and typing the value.
       *
       * @returns {typeof chooseDatePicker}
       * @memberof Chainable
       * @example
       *    cy.chooseDatePicker(selector, value)
       */
      chooseDatePicker: (selector: string, value: string) => void;
      resetSchedulerDB: (includeSeeds?: boolean) => void;
      initializeSession(token: string): void;
      configureSession(token: string): void;
      configureClock(): void;

      createEvent(
        createScheduledEventInput: CreateScheduledEventMutationVariables
      ): Cypress.Chainable<CreateScheduledEventMutation>;
      updateEvent(
        updateScheduledEventInput: UpdateScheduledEventMutationVariables
      ): Cypress.Chainable<UpdateScheduledEventMutation>;
      activateEvent(
        activateScheduledEventInput: ActivateScheduledEventMutationVariables
      ): Cypress.Chainable<ActivateScheduledEventMutation>;
      completeEvent(
        completeScheduledEventInput: FinalizeScheduledEventMutationVariables
      ): Cypress.Chainable<FinalizeScheduledEventMutation>;
      createEquipment(
        createEquipmentInput: CreateEquipmentMutationVariables
      ): Cypress.Chainable<CreateEquipmentMutation>;
      updateEquipment(
        updateEquipmentInput: UpdateEquipmentMutationVariables
      ): Cypress.Chainable<UpdateEquipmentMutation>;
      assignEquipmentToScheduledEvent(
        assignEquipmentToScheduledEventInput: AssignEquipmentToScheduledEventMutationVariables
      ): Cypress.Chainable<AssignEquipmentToScheduledEventMutation>;
    }
  }
}
