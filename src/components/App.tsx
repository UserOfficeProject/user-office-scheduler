import { StyledEngineProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import React, { useContext } from 'react';
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

import { AppContextProvider } from 'context/AppContext';
import { SettingsContextProvider } from 'context/SettingsContextProvider';
import { UserContextProvider, UserContext } from 'context/UserContext';
// import { useUnauthorizedApi } from 'hooks/common/useDataApi';

import Dashboard from './Dashboard';
import ExternalAuth from './ExternalAuth';
import { PATH_ROOT, EXTERNAL_AUTH } from './paths';

const PrivateRoute: React.FC<RouteProps> = ({
  component,
  ...rest
}: RouteProps) => {
  const { user } = useContext(UserContext);

  if (!component) {
    throw new Error('`component` is missing!');
  }

  const Component = component;

  return (
    <Route
      {...{ rest }}
      render={(props): JSX.Element => {
        if (!user) {
          return <Redirect to={EXTERNAL_AUTH} />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

class App extends React.Component {
  static getDerivedStateFromError(error: Error) {
    console.error('getDerivedStateFromError', error);
  }

  componentDidCatch(error: Error): void {
    console.log('componentDidCatch', error);

    // const api = useUnauthorizedApi();
    // api().addClientLog(error);
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
                      <QueryParamProvider ReactRouterRoute={Route}>
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
