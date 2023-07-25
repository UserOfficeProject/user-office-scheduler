import { logger } from '@user-office-software/duo-logger';
import { GraphQLClient } from 'graphql-request';

import { getSdk } from '../generated/sdk';

const USER_OFFICE_ENDPOINT = process.env.USER_OFFICE_ENDPOINT as string;

if (!USER_OFFICE_ENDPOINT) {
  logger.logError('env `USER_OFFICE_ENDPOINT` missing', {});
  process.exit(1);
}

export default function initGraphQLClient(token?: string) {
  // create a new GraphQLClient lazily, only when we need one
  return () => {
    const client = new GraphQLClient(USER_OFFICE_ENDPOINT, {
      headers: {
        ...(token && { authorization: token }),
      },
    });

    return getSdk(client);
  };
}
