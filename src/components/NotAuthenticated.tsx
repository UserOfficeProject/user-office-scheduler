import {
  makeStyles,
  Button,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useContext } from 'react';
import { Redirect } from 'react-router';

import { UserContext } from 'context/UserContext';
import useSchedulerConfig from 'hooks/meta/useSchedulerConfig';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  message: {
    margin: theme.spacing(2),
    color: theme.palette.grey[700],
  },
  space: {
    margin: theme.spacing(2),
  },
}));

export default function NotAuthenticated() {
  const classes = useStyles();
  const { user } = useContext(UserContext);
  const { config, loading, failed } = useSchedulerConfig();

  if (user) {
    return <Redirect to="/" />;
  }

  const handleClick = () => {
    if (!config) {
      return;
    }

    const origin = window.location.origin;
    const url = new URL(config.authRedirect, origin);
    url.searchParams.set('authRedirect', origin);

    window.location.assign(url.toString());
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" component="h1" className={classes.message}>
        You are not authenticated!
      </Typography>
      <Button
        onClick={handleClick}
        variant="outlined"
        data-cy="btn-authenticate"
        disabled={loading || failed}
      >
        {loading ? (
          <CircularProgress size={14} />
        ) : (
          'Click here to authenticate using your User Office account'
        )}
      </Button>
      {failed && (
        <Alert severity="error" className={classes.space}>
          Communication failed!
        </Alert>
      )}
    </div>
  );
}
