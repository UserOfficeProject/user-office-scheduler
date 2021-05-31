import { getTranslation } from '@esss-swap/duo-localisation';
import { GraphQLClient } from 'graphql-request';
import { Variables } from 'graphql-request/dist/types';
import { decode } from 'jsonwebtoken';
import { useSnackbar, WithSnackbarProps } from 'notistack';
import { useCallback, useContext } from 'react';

import { UserContext } from 'context/UserContext';
import { getSdk } from 'generated/sdk';

const BACKEND_ENDPOINT = process.env.REACT_APP_API_URL || '';

const endpoint = BACKEND_ENDPOINT + '/gateway';

const getErrorMessage = (code: string | undefined): string | void => {
  switch (code) {
    case 'UNAUTHENTICATED':
      return 'Token expired or bad token';
    case 'INSUFFICIENT_PERMISSIONS':
      return getTranslation('INSUFFICIENT_PERMISSIONS');
    default:
      return;
  }
};

const notificationWithClientLog = async (
  enqueueSnackbar: WithSnackbarProps['enqueueSnackbar'],
  message: string,
  error: unknown = ''
) => {
  enqueueSnackbar(message, {
    variant: 'error',
    preventDuplicate: true,
  });

  if (error) {
    let stringifiedError: string;

    if (error instanceof Error) {
      const { message, stack, ...rest } = error;
      stringifiedError = JSON.stringify({
        message: message,
        stack: stack,
        additionalFields: rest,
      });
    } else if (typeof error === 'object') {
      stringifiedError = JSON.stringify({
        message: 'Client error',
        stack: new Error().stack,
        additionalFields: error,
      });
    } else {
      stringifiedError = String(error);
    }

    try {
      await getSdk(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        new UnauthorizedGraphQLClient(endpoint, enqueueSnackbar, true)
      ).addClientLog({ error: stringifiedError });
    } catch (e) {
      // if this fails we can't do anything
      console.error('Failed to log client error', e);
    }
  }
};

class UnauthorizedGraphQLClient extends GraphQLClient {
  constructor(
    private endpoint: string,
    private enqueueSnackbar: WithSnackbarProps['enqueueSnackbar'],
    private skipErrorReport?: boolean
  ) {
    super(endpoint);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async request<T extends any>(
    query: string,
    variables?: Variables
  ): Promise<T> {
    return super.request(query, variables).catch(error => {
      // if the `notificationWithClientLog` fails
      // and it fails while reporting an error, it can
      // easily cause an infinite loop
      if (this.skipErrorReport) {
        throw error;
      }

      // if the connection fails the `error` exists
      // otherwise it won't, so this `includes` would fail
      if (error.response.error?.includes('ECONNREFUSED')) {
        notificationWithClientLog(this.enqueueSnackbar, 'Connection problem!');
      } else {
        notificationWithClientLog(
          this.enqueueSnackbar,
          'Something went wrong!',
          // Server error's should have `errors`
          // everything else `error`
          error.response.error ?? error.response.errors
        );
      }

      return error;
    }) as T;
  }
}

class AuthorizedGraphQLClient extends GraphQLClient {
  private renewalDate: number;

  constructor(
    private endpoint: string,
    private token: string,
    private enqueueSnackbar: WithSnackbarProps['enqueueSnackbar'],
    private error?: (reason: string) => void,
    private tokenRenewed?: (newToken: string) => void
  ) {
    super(endpoint);
    token && this.setHeader('authorization', `Bearer ${token}`);
    this.renewalDate = this.getRenewalDate(token);
  }

  async request<T extends any>(
    query: string,
    variables?: Variables
  ): Promise<T> {
    const nowTimestampSeconds = Date.now() / 1000;

    if (this.renewalDate < nowTimestampSeconds) {
      const data = await getSdk(
        new GraphQLClient(this.endpoint)
      ).getRefreshedToken({
        token: this.token,
      });

      if (data.token.rejection) {
        this.error && this.error(data.token.rejection.reason);
      } else {
        const newToken = data.token.token;
        this.setHeader('authorization', `Bearer ${newToken}`);
        this.tokenRenewed && this.tokenRenewed(newToken as string);
      }
    }

    return super.request(query, variables).catch(error => {
      console.error({ error });

      // if the connection fails the `error` exists
      // otherwise it won't, so this `includes` would fail
      if (error.response.error?.includes('ECONNREFUSED')) {
        notificationWithClientLog(this.enqueueSnackbar, 'Connection problem!');
      } else {
        const unnamedErrors = this.checkNamedErrors(error.response);

        if (unnamedErrors) {
          notificationWithClientLog(
            this.enqueueSnackbar,
            'Something went wrong!',
            // Server error's should have `errors`
            // everything else `error`
            unnamedErrors
          );
        }
      }

      this.error && this.error(error);

      return error;
    }) as T;
  }

  private getRenewalDate(token: string): number {
    const after = 8 * 3600;

    return (decode(token) as any).iat + after;
  }

  private checkNamedErrors(errObj: any) {
    // it is a graphql error
    if (Array.isArray(errObj.errors)) {
      const rest = errObj.errors.filter((err: any) => {
        const errorMessage = getErrorMessage(err?.extensions?.code);
        if (errorMessage) {
          this.enqueueSnackbar(errorMessage, {
            variant: 'error',
            preventDuplicate: true,
          });
        }

        return !errorMessage;
      });

      return rest.length > 0 ? rest : null;
    }

    if ('error' in errObj) {
      return errObj.error;
    }

    return errObj;
  }
}

export function useDataApi() {
  const { token, handleNewToken, handleLogout } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();

  return useCallback(
    () =>
      getSdk(
        token
          ? new AuthorizedGraphQLClient(
              endpoint,
              token,
              enqueueSnackbar,
              reason => {
                console.log(reason);
                handleLogout();
              },
              handleNewToken
            )
          : new GraphQLClient(endpoint)
      ),
    [token, handleNewToken, handleLogout, enqueueSnackbar]
  );
}

export function useUnauthorizedApi() {
  const { enqueueSnackbar } = useSnackbar();

  return useCallback(
    () => getSdk(new UnauthorizedGraphQLClient(endpoint, enqueueSnackbar)),
    [enqueueSnackbar]
  );
}
