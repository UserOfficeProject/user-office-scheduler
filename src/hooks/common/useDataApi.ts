/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTranslation } from '@user-office-software/duo-localisation';
import { GraphQLClient } from 'graphql-request';
import { ClientError, RequestOptions, Variables } from 'graphql-request';
import { VariablesAndRequestHeadersArgs } from 'graphql-request/build/esm/types';
import jwtDecode from 'jwt-decode';
import { useSnackbar, WithSnackbarProps } from 'notistack';
import { useCallback, useContext } from 'react';

import { SettingsContext } from 'context/SettingsContextProvider';
import { UserContext } from 'context/UserContext';
import { getSdk, SettingsId } from 'generated/sdk';
import { RequestQuery } from 'utils/utilTypes';

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

  async request<T = unknown, V extends Variables = Variables>(
    query: RequestQuery<T, V> | RequestOptions<V, T>,
    ...variablesAndRequestHeaders: VariablesAndRequestHeadersArgs<V>
  ): Promise<T> {
    return super
      .request(query as RequestQuery<T, V>, ...variablesAndRequestHeaders)
      .catch((error) => {
        // if the `notificationWithClientLog` fails
        // and it fails while reporting an error, it can
        // easily cause an infinite loop
        if (this.skipErrorReport) {
          throw error;
        }

        // if the connection fails the `error` exists
        // otherwise it won't, so this `includes` would fail
        if (error.response.error?.includes('ECONNREFUSED')) {
          notificationWithClientLog(
            this.enqueueSnackbar,
            'Connection problem!'
          );
        } else {
          notificationWithClientLog(
            this.enqueueSnackbar,
            'Something went wrong!',
            // Server error's should have `errors`
            // everything else `error`
            error.response.error ?? error.response.errors
          );
        }

        throw error;
      });
  }
}

class AuthorizedGraphQLClient extends GraphQLClient {
  private renewalDate: number;

  constructor(
    private endpoint: string,
    private token: string,
    private enqueueSnackbar: WithSnackbarProps['enqueueSnackbar'],
    private onSessionExpired: () => void,
    private tokenRenewed?: (newToken: string) => void,
    private externalAuthLoginUrl?: string
  ) {
    super(endpoint);
    token && this.setHeader('authorization', `Bearer ${token}`);
    this.renewalDate = this.getRenewalDate(token);
  }

  async request<T = unknown, V extends Variables = Variables>(
    query: RequestQuery<T, V> | RequestOptions<V, T>,
    ...variablesAndRequestHeaders: VariablesAndRequestHeadersArgs<V>
  ): Promise<T> {
    const nowTimestampSeconds = Date.now() / 1000;

    if (this.renewalDate < nowTimestampSeconds) {
      try {
        const data = await getSdk(
          new GraphQLClient(this.endpoint)
        ).getRefreshedToken({
          token: this.token,
        });

        const newToken = data.token;
        this.setHeader('authorization', `Bearer ${newToken}`);
        this.tokenRenewed && this.tokenRenewed(newToken as string);
      } catch (error) {
        // TODO: This should be removed once we do error handling refactor
        const [graphQLError] = (error as ClientError).response?.errors ?? [];

        notificationWithClientLog(
          this.enqueueSnackbar,
          'Server rejected user credentials',
          graphQLError?.message
        );
        this.onSessionExpired();
      }
    }

    return super
      .request(query as RequestQuery<T, V>, ...variablesAndRequestHeaders)
      .catch((error) => {
        console.error({ error });

        // if the connection fails the `error` exists
        // otherwise it won't, so this `includes` would fail
        if (error.response.error?.includes('ECONNREFUSED')) {
          notificationWithClientLog(
            this.enqueueSnackbar,
            'Connection problem!'
          );
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
          } else {
            this.onSessionExpired();
          }
        }

        throw error;
      });
  }

  private getRenewalDate(token: string): number {
    const after = 8 * 3600;

    return (jwtDecode(token) as any).iat + after;
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
  const { token, handleNewToken, handleSessionExpired } =
    useContext(UserContext);
  const settingsContext = useContext(SettingsContext);
  const externalAuthLoginUrl = settingsContext.settings.get(
    SettingsId.EXTERNAL_AUTH_LOGIN_URL
  )?.settingsValue;
  const { enqueueSnackbar } = useSnackbar();

  return useCallback(
    () =>
      getSdk(
        token
          ? new AuthorizedGraphQLClient(
              endpoint,
              token,
              enqueueSnackbar,
              () => {
                handleSessionExpired();
              },
              handleNewToken,
              externalAuthLoginUrl ? externalAuthLoginUrl : undefined
            )
          : new GraphQLClient(endpoint)
      ),
    [
      token,
      handleNewToken,
      enqueueSnackbar,
      handleSessionExpired,
      externalAuthLoginUrl,
    ]
  );
}

export function useUnauthorizedApi() {
  const { enqueueSnackbar } = useSnackbar();

  return useCallback(
    () => getSdk(new UnauthorizedGraphQLClient(endpoint, enqueueSnackbar)),
    [enqueueSnackbar]
  );
}

export function getUnauthorizedApi() {
  return getSdk(new GraphQLClient(endpoint));
}
