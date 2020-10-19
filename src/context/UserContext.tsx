import { decode } from 'jsonwebtoken';
import React, { createContext, useEffect, useReducer } from 'react';
import { useCookies } from 'react-cookie';

import Loader from 'components/common/Loader';
import { User, Role } from 'generated/sdk';

export type AuthenticatedUser = Pick<
  User,
  'id' | 'email' | 'firstname' | 'lastname'
>;

export type UserContextData = {
  stateInitialized: boolean;
  user: AuthenticatedUser | null;
  token: string | null;
  roles: Role[];
  handleNewToken: (token: string) => void;
  handleLogout: () => void;
};

const initialState = {
  stateInitialized: false,
  user: null,
  token: null,
  roles: [],
  handleNewToken: () => {},
  handleLogout: () => {},
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
        roles: action.payload.decodedToken.role,
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
  const [cookies, setCookie, removeCookie] = useCookies();

  useEffect(() => {
    const { token } = cookies;

    let decodedToken = null;
    if (token) {
      try {
        decodedToken = decode(token);
      } catch (error) {
        // malformed token?
        console.error(error);
      }
    }

    if (decodedToken) {
      dispatch({
        type: UserActionType.SET_USER_FROM_TOKEN,
        payload: { token, decodedToken },
      });
    } else {
      dispatch({ type: UserActionType.SET_NOT_AUTHENTICATED, payload: null });
    }
  }, [cookies]);

  const handleNewToken = (token: string) =>
    setCookie('token', token, { path: '/', secure: false });

  const handleLogout = () => removeCookie('token');

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
