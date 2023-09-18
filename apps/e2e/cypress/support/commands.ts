import {
  ActivateScheduledEventsMutation,
  ActivateScheduledEventsMutationVariables,
  AssignEquipmentToScheduledEventMutation,
  AssignEquipmentToScheduledEventMutationVariables,
  CreateEquipmentMutation,
  CreateEquipmentMutationVariables,
  CreateScheduledEventMutation,
  CreateScheduledEventMutationVariables,
  ExternalTokenLoginMutation,
  FinalizeScheduledEventMutation,
  FinalizeScheduledEventMutationVariables,
  Role,
  UpdateEquipmentMutation,
  UpdateEquipmentMutationVariables,
  UpdateScheduledEventMutation,
  UpdateScheduledEventMutationVariables,
  User,
} from '@user-office-software-libs/shared-types';
import jwtDecode from 'jwt-decode';

import initialDBData from './initialDBData';
import { getE2EApi } from '../utils/e2eApi';

export type TestUserId = keyof typeof initialDBData.users;

type DecodedTokenData = {
  user: User;
  currentRole: Role;
  exp: number;
};

const resetDB = (includeSeeds = false) => {
  const api = getE2EApi();
  const request = api.prepareDB({ includeSeeds });

  cy.wrap(request);
};

const resetSchedulerDB = (includeSeeds = false) => {
  const api = getE2EApi();
  const request = api.prepareSchedulerDB({ includeSeeds });

  cy.wrap(request);
};

const createEvent = (
  createScheduledEventInput: CreateScheduledEventMutationVariables
): Cypress.Chainable<CreateScheduledEventMutation> => {
  const api = getE2EApi();
  const request = api.createScheduledEvent(createScheduledEventInput);

  return cy.wrap(request);
};

const updateEvent = (
  updateScheduledEventInput: UpdateScheduledEventMutationVariables
): Cypress.Chainable<UpdateScheduledEventMutation> => {
  const api = getE2EApi();
  const request = api.updateScheduledEvent(updateScheduledEventInput);

  return cy.wrap(request);
};

const activateEvent = (
  activateScheduledEventsInput: ActivateScheduledEventsMutationVariables
): Cypress.Chainable<ActivateScheduledEventsMutation> => {
  const api = getE2EApi();
  const request = api.activateScheduledEvents(activateScheduledEventsInput);

  return cy.wrap(request);
};

const completeEvent = (
  completeScheduledEventInput: FinalizeScheduledEventMutationVariables
): Cypress.Chainable<FinalizeScheduledEventMutation> => {
  const api = getE2EApi();
  const request = api.finalizeScheduledEvent(completeScheduledEventInput);

  return cy.wrap(request);
};

const createEquipment = (
  createEquipmentInput: CreateEquipmentMutationVariables
): Cypress.Chainable<CreateEquipmentMutation> => {
  const api = getE2EApi();
  const request = api.createEquipment(createEquipmentInput);

  return cy.wrap(request);
};

const updateEquipment = (
  updateEquipmentInput: UpdateEquipmentMutationVariables
): Cypress.Chainable<UpdateEquipmentMutation> => {
  const api = getE2EApi();
  const request = api.updateEquipment(updateEquipmentInput);

  return cy.wrap(request);
};

const assignEquipmentToScheduledEvent = (
  assignEquipmentToScheduledEventInput: AssignEquipmentToScheduledEventMutationVariables
): Cypress.Chainable<AssignEquipmentToScheduledEventMutation> => {
  const api = getE2EApi();
  const request = api.assignEquipmentToScheduledEvent(
    assignEquipmentToScheduledEventInput
  );

  return cy.wrap(request);
};

const getUserIdFromIdOrCredentials = (
  idOrCredentials: TestUserId | { email: string; password: string }
) => {
  const isCredentials = typeof idOrCredentials !== 'string';
  if (isCredentials) {
    const credentials = idOrCredentials;

    const testUserId = Object.keys(initialDBData.users).find(
      (key) =>
        initialDBData.users[key as TestUserId].email === credentials.email &&
        initialDBData.users[key as TestUserId].password === credentials.password
    ) as TestUserId;

    if (!testUserId) {
      throw new Error(
        `initialDBData object has no credentials for ${idOrCredentials.email}`
      );
    }

    return testUserId;
  } else {
    return idOrCredentials as TestUserId;
  }
};

const getCredentialsFromUserId = (testUserId: TestUserId) => {
  const user = initialDBData.users[testUserId];

  return {
    email: user.email,
    password: user.password,
  };
};

const getOauthExternalToken = async (testUserId: TestUserId) => {
  const DEV_AUTH_SERVER_URL = Cypress.env('DEV_AUTH_SERVER_URL');
  const { email, password } = getCredentialsFromUserId(testUserId);
  const params = {
    login: email,
    password: password,
    scopes: 'openid email profile',
  };

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return fetch(`${DEV_AUTH_SERVER_URL}/get-code`, options)
    .then((response) => response.json())
    .then((response) => {
      return response.code;
    });
};

const login = (
  idOrCredentials: TestUserId | { email: string; password: string }
): Cypress.Chainable<ExternalTokenLoginMutation> => {
  const testUserId = getUserIdFromIdOrCredentials(idOrCredentials);
  const request = getOauthExternalToken(testUserId).then(
    async (externalToken) => {
      const api = getE2EApi();

      return api
        .externalTokenLogin({
          externalToken: externalToken as string,
          redirectUri: 'http://localhost:3000/external-auth', // has to be set because it is a required field
        })
        .then(async (resp) => {
          const token = resp.externalTokenLogin;
          if (!token) {
            return resp;
          }

          const { user, exp, currentRole } = jwtDecode(
            token
          ) as DecodedTokenData;
          window.localStorage.setItem('token', token);
          window.localStorage.setItem(
            'currentRole',
            currentRole.shortCode.toUpperCase()
          );
          window.localStorage.setItem('expToken', `${exp}`);
          window.localStorage.setItem('user', JSON.stringify(user));

          return resp;
        });
    }
  );

  return cy.wrap(request);
};

const finishedLoading = () => {
  cy.get('[role="progressbar"]').should('not.exist');
};

const chooseDatePicker = (selector: string, value: string) => {
  cy.get('body').then(($body) => {
    const mobilePickerSelector = `${selector} input[readonly]`;
    const isMobile = $body.find(mobilePickerSelector).length > 0;
    if (isMobile) {
      // The MobileDatePicker component has readonly inputs and needs to
      // be opened and clicked on edit so its inputs can be edited
      cy.get(mobilePickerSelector).click();
      cy.get(
        '[role="dialog"] [aria-label="calendar view is open, go to text input view"]'
      ).click();
      cy.get(`[role="dialog"] ${selector}`).find('input').clear().type(value);
      cy.contains('[role="dialog"] button', 'OK').click();
    } else {
      cy.get(selector).find('input').clear().type(value);
    }
  });
};

Cypress.Commands.add('login', login);
Cypress.Commands.add('configureClock', () => {
  const now = new Date();
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);

  cy.clock(now, ['Date']);
});
Cypress.Commands.add('finishedLoading', finishedLoading);

Cypress.Commands.add('resetDB', resetDB);
Cypress.Commands.add('resetSchedulerDB', resetSchedulerDB);

Cypress.Commands.add('createEvent', createEvent);
Cypress.Commands.add('updateEvent', updateEvent);
Cypress.Commands.add('activateEvent', activateEvent);
Cypress.Commands.add('completeEvent', completeEvent);
Cypress.Commands.add('createEquipment', createEquipment);
Cypress.Commands.add('updateEquipment', updateEquipment);
Cypress.Commands.add(
  'assignEquipmentToScheduledEvent',
  assignEquipmentToScheduledEvent
);

// NOTE: Adding this command because of: https://github.com/cypress-io/cypress/issues/970#issuecomment-969971419
Cypress.Commands.add('chooseDatePicker', chooseDatePicker);
