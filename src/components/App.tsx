import { ThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { getTheme } from 'theme';

import useServerMessage from 'hooks/common/useServerMessage';

function DummyComponent() {
  const { loading, serverMessage } = useServerMessage();

  return (
    <h1>The server says: {loading ? <em>Loading...</em> : serverMessage}</h1>
  );
}

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
          <Router>
            <div className="App">
              <Switch>
                <Route path="/" component={DummyComponent} />
              </Switch>
            </div>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    );
  }
}

export default App;
