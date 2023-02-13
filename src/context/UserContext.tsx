import jwtDecode from 'jwt-decode';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import Loader from 'components/common/Loader';
import {
  User,
  Role,
  UserRole,
  SettingsId,
  AuthJwtPayload,
} from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

import { SettingsContext } from './SettingsContextProvider';

export type AuthenticatedUser = Pick<
  User,
  'id' | 'email' | 'firstname' | 'lastname'
>;

export type UserContextData = {
  stateInitialized: boolean;
  user: AuthenticatedUser | null;
  token: string | null;
  currentRole: UserRole | null;
  roles: Role[];
  handleNewToken: (token: string) => void;
  handleLogout: () => Promise<void>;
};

const initialState = {
  stateInitialized: false,
  user: null,
  token: null,
  roles: [],
  currentRole: null,
  handleNewToken: () => {},
  handleLogout: async () => {},
};

export const UserContext = createContext<UserContextData>(initialState);

export enum UserActionType {
  SET_USER_FROM_TOKEN = 'SET_USER_FROM_TOKEN',
  SET_NOT_AUTHENTICATED = 'SET_NOT_AUTHENTICATED',
  SET_TOKEN = 'SET_TOKEN',
}

function reducer(
  state: UserContextData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: { type: UserActionType; payload: any }
): UserContextData {
  switch (action.type) {
    case UserActionType.SET_NOT_AUTHENTICATED: {
      return {
        ...state,
        ...initialState,
        stateInitialized: true,
      };
    }
    case UserActionType.SET_USER_FROM_TOKEN: {
      return {
        ...state,

        user: action.payload.decodedToken.user,
        roles: action.payload.decodedToken.roles,
        currentRole:
          action.payload.decodedToken.currentRole.shortCode.toUpperCase(),
        token: action.payload.token,
        stateInitialized: true,
      };
    }
    case UserActionType.SET_TOKEN: {
      return {
        ...state,
        token: action.payload.token,
      };
    }
    default:
      return state;
  }
}

type UserContextProviderProps = { children: React.ReactNode };

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [userState, dispatch] = useReducer(reducer, initialState);
  const { settings } = useContext(SettingsContext);
  const api = useDataApi();

  const handleLogout = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      api()
        .logout({ token })
        .finally(() => {
          localStorage.removeItem('token');
          const logoutUrl = settings.get(
            SettingsId.EXTERNAL_AUTH_LOGOUT_URL
          )?.settingsValue;
          if (logoutUrl) {
            const logoutUrlWithRedirect = new URL(logoutUrl);
            window.location.assign(logoutUrlWithRedirect);
          } else {
            dispatch({
              type: UserActionType.SET_NOT_AUTHENTICATED,
              payload: null,
            });
          }
        });
    }
  }, [api, settings]);

  const handleNewToken = (token: string | null) => {
    let decodedToken = null;
    try {
      decodedToken = jwtDecode<AuthJwtPayload | null>(token as string);
    } catch (error) {
      console.error(error);
    }

    if (!decodedToken) {
      dispatch({ type: UserActionType.SET_NOT_AUTHENTICATED, payload: null });

      return;
    }

    localStorage.setItem('token', token as string);
    dispatch({
      type: UserActionType.SET_USER_FROM_TOKEN,
      payload: { token, decodedToken },
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    handleNewToken(token);
  }, []);

  return (
    <UserContext.Provider
      value={{
        ...userState,
        handleNewToken,
        handleLogout,
      }}
    >
      {userState.stateInitialized ? children : <Loader />}
    </UserContext.Provider>
  );
}

export const useCheckAccess = (allowedRoles: UserRole[]) => {
  const { currentRole } = useContext(UserContext);

  if (!currentRole) {
    return false;
  }

  if (allowedRoles.includes(currentRole)) {
    return true;
  }

  return false;
};
