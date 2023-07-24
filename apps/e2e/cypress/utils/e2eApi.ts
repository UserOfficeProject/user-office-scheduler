import { GraphQLClient } from 'graphql-request';

import { getSdk } from '../../src/generated/sdk';

export const getE2EApi = (token?: string | null) => {
  // NOTE: token is used when we want to do some action as a specific logged in user.
  const authHeader = `Bearer ${token ? token : Cypress.env('SVC_ACC_TOKEN')}`;

  return getSdk(
    new GraphQLClient('/gateway', {
      headers: { authorization: authHeader },
    })
  );
};
