import { StyledEngineProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import React, { ErrorInfo, useContext } from 'react';
import { CookiesProvider } from 'react-cookie';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps,
  Redirect,
} from 'react-router-dom';
import Theme from 'theme';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';

import { AppContextProvider } from 'context/AppContext';
import { SettingsContextProvider } from 'context/SettingsContextProvider';
import { UserContextProvider, UserContext } from 'context/UserContext';
import { getUnauthorizedApi } from 'hooks/common/useDataApi';
import clearSession from 'utils/clearSession';

import Dashboard from './Dashboard';
import ExternalAuth from './ExternalAuth';
import { PATH_ROOT, EXTERNAL_AUTH } from './paths';

const PrivateRoute: React.FC<RouteProps> = ({
  component,
  ...rest
}: RouteProps) => {
  const { token } = useContext(UserContext);

  if (!component) {
    throw new Error('`component` is missing!');
  }

  const Component = component;

  return (
    <Route
      {...rest}
      render={(props): JSX.Element => {
        if (!token) {
          return <Redirect to={EXTERNAL_AUTH} />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

class App extends React.Component {
  state = { errorUserInformation: '' };
  static getDerivedStateFromError(error: Error) {
    console.error('getDerivedStateFromError', error);
    const user = localStorage.getItem('user');
    const errorUserInformation = {
      id: user ? JSON.parse(user).id : 'Not logged in',
      currentRole: localStorage.getItem('currentRole'),
    };

    clearSession();

    return { errorUserInformation };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    let errorMessage = '';
    try {
      errorMessage = JSON.stringify({
        error: error.toString(),
        errorInfo: errorInfo.componentStack.toString(),
        user: this.state.errorUserInformation,
      });
    } catch (e) {
      errorMessage = 'Exception while preparing error message';
    } finally {
      getUnauthorizedApi().addClientLog({ error: errorMessage });
    }
  }

  render() {
    return (
      <StyledEngineProvider injectFirst>
        <SnackbarProvider
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          maxSnack={1}
        >
          <CookiesProvider>
            <SettingsContextProvider>
              <Theme>
                <UserContextProvider>
                  <AppContextProvider>
                    <Router basename={process.env.PUBLIC_URL}>
                      <QueryParamProvider adapter={ReactRouter5Adapter}>
                        <div className="App">
                          <Switch>
                            <Route
                              path={EXTERNAL_AUTH}
                              component={ExternalAuth}
                            />
                            <PrivateRoute
                              path={PATH_ROOT}
                              component={Dashboard}
                            />
                          </Switch>
                        </div>
                      </QueryParamProvider>
                    </Router>
                  </AppContextProvider>
                </UserContextProvider>
              </Theme>
            </SettingsContextProvider>
          </CookiesProvider>
        </SnackbarProvider>
      </StyledEngineProvider>
    );
  }
}

export default App;
