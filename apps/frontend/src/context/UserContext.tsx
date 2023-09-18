/* eslint-disable @typescript-eslint/no-explicit-any */
import jwtDecode from 'jwt-decode';
import React, { useCallback, useContext } from 'react';

import { Role, UserRole, SettingsId, UserJwt, User } from 'generated/sdk';
import { useUnauthorizedApi } from 'hooks/common/useDataApi';
import clearSession from 'utils/clearSession';

import { SettingsContext } from './SettingsContextProvider';

export type AuthenticatedUser = Pick<
  User,
  'id' | 'email' | 'firstname' | 'lastname'
>;

interface UserContextData {
  user: UserJwt;
  token: string;
  roles: Role[];
  currentRole: UserRole | null;
  handleLogin: React.Dispatch<string | null | undefined>;
  handleNewToken: React.Dispatch<string | null | undefined>;
  handleLogout: () => Promise<void>;
  handleSessionExpired: () => Promise<void>;
}

interface DecodedTokenData
  extends Pick<UserContextData, 'user' | 'token' | 'roles'> {
  exp: number;
  currentRole: Role;
  impersonatingUserId: number | undefined;
}

enum ActionType {
  SETUSERFROMLOCALSTORAGE = 'setUserFromLocalStorage',
  LOGINUSER = 'loginUser',
  SETTOKEN = 'setToken',
  SELECTROLE = 'selectRole',
  LOGOFFUSER = 'logOffUser',
}

const initUserData: UserContextData = {
  user: {
    id: 0,
    email: '',
    firstname: '',
    lastname: '',
    oidcSub: '',
    organisation: 0,
    created: '',
    placeholder: false,
    preferredname: '',
    position: '',
  },
  token: '',
  roles: [],
  currentRole: null,
  handleLogin: (value) => value,
  handleNewToken: (value) => value,
  handleLogout: async () => {
    return;
  },
  handleSessionExpired: async () => {
    return;
  },
};

export const getCurrentUser = () =>
  jwtDecode(localStorage.token) as DecodedTokenData | null;

const checkLocalStorage = (
  dispatch: React.Dispatch<{
    type: ActionType;
    payload: any;
  }>,
  state: UserContextData
): void => {
  if (!state.token && localStorage.token && localStorage.currentRole) {
    const decoded = getCurrentUser();

    if (decoded && decoded.exp > Date.now() / 1000) {
      dispatch({
        type: ActionType.SETUSERFROMLOCALSTORAGE,
        payload: {
          user: decoded.user,
          roles: decoded.roles,
          currentRole: localStorage.currentRole,
          token: localStorage.token,
          expToken: decoded.exp,
        },
      });
    } else {
      clearSession();
    }
  }
};

export const UserContext = React.createContext<UserContextData>(initUserData);

const reducer = (
  state: UserContextData,
  action: { type: ActionType; payload: any }
): any => {
  switch (action.type) {
    case ActionType.SETUSERFROMLOCALSTORAGE:
      return {
        currentRole: action.payload.currentRole,
        user: action.payload.user,
        roles: action.payload.roles,
        token: action.payload.token,
        expToken: action.payload.expToken,
      };
    case ActionType.LOGINUSER: {
      const { user, exp, roles, currentRole } = jwtDecode(
        action.payload
      ) as DecodedTokenData;
      localStorage.user = JSON.stringify(user);
      localStorage.token = action.payload;
      localStorage.expToken = exp;
      localStorage.currentRole = currentRole.shortCode.toUpperCase();

      return {
        ...state,
        token: action.payload,
        user: user,
        expToken: exp,
        roles: roles,
        currentRole: roles[0].shortCode.toUpperCase(),
      };
    }
    case ActionType.SETTOKEN: {
      const { currentRole, roles, exp } = jwtDecode(
        action.payload
      ) as DecodedTokenData;
      localStorage.token = action.payload;
      localStorage.expToken = exp;
      localStorage.currentRole = currentRole.shortCode.toUpperCase();

      return {
        ...state,
        roles: roles,
        token: action.payload,
        expToken: exp,
        currentRole: currentRole.shortCode.toUpperCase(),
      };
    }
    case ActionType.SELECTROLE:
      localStorage.currentRole = action.payload.toUpperCase();

      return {
        ...state,
        currentRole: action.payload.toUpperCase(),
      };
    case ActionType.LOGOFFUSER:
      return {
        ...initUserData,
      };

    default:
      return state;
  }
};

export const UserContextProvider = (props: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(reducer, initUserData);
  const unauthorizedApi = useUnauthorizedApi();
  const settingsContext = useContext(SettingsContext);

  checkLocalStorage(dispatch, state);

  async function userLogoutHandler() {
    const token = localStorage.getItem('token');
    if (token) {
      unauthorizedApi()
        .logout({ token })
        .finally(() => {
          const logoutUrl = settingsContext.settings.get(
            SettingsId.EXTERNAL_AUTH_LOGOUT_URL
          )?.settingsValue;
          clearSession();
          if (logoutUrl) {
            window.location.assign(logoutUrl);
          } else {
            // if there is no logout url, just clear the user context
            dispatch({ type: ActionType.LOGOFFUSER, payload: null });
          }
        });
    }
  }

  async function userSessionExpiredHandler() {
    const loginUrl = settingsContext.settings.get(
      SettingsId.EXTERNAL_AUTH_LOGIN_URL
    )?.settingsValue;
    clearSession();
    if (loginUrl) {
      const url = new URL(loginUrl);
      url.searchParams.set(
        'redirect_uri',
        encodeURI(`${window.location.href}external-auth`)
      );
      window.location.href = url.toString();
    } else {
      // if there is no logout url, just clear the user context
      dispatch({ type: ActionType.LOGOFFUSER, payload: null });
    }
  }

  return (
    <UserContext.Provider
      value={{
        ...state,
        handleLogin: (data): void =>
          dispatch({ type: ActionType.LOGINUSER, payload: data }),
        handleLogout: userLogoutHandler,
        handleSessionExpired: userSessionExpiredHandler,
        handleNewToken: useCallback(
          (token) => dispatch({ type: ActionType.SETTOKEN, payload: token }),
          []
        ),
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

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
