import { ThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { getTheme } from 'theme';

import { AppContextProvider } from 'context/AppContext';

import Dashboard from './Dashboard';
import { PATH_ROOT } from './paths';

class App extends React.Component {
  // static getDerivedStateFromError(): void {
  //   // Update state so the next render will show the fallback UI.
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('currentRole');
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('expToken');
  // }

  // componentDidCatch(error: any): void {
  //   useUnauthorizedApi().addClientLog(error);
  // }

  render() {
    return (
      <ThemeProvider theme={getTheme()}>
        <SnackbarProvider
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          maxSnack={1}
        >
          <AppContextProvider>
            <Router>
              <div className="App">
                <Switch>
                  {/* public root now, probably will be private in the future */}
                  <Route path={PATH_ROOT} component={Dashboard} />
                </Switch>
              </div>
            </Router>
          </AppContextProvider>
        </SnackbarProvider>
      </ThemeProvider>
    );
  }
}

export default App;
