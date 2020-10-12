import { makeStyles, Button, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import { Redirect } from 'react-router';

import { UserContext } from 'context/UserContext';

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
    marginBottom: theme.spacing(2),
    color: theme.palette.grey[700],
  },
}));

export default function NotAuthenticated() {
  const classes = useStyles();
  const { user } = useContext(UserContext);

  if (user) {
    return <Redirect to="/" />;
  }

  const handleClick = () => {
    const origin = window.location.origin;
    const url = new URL(`${process.env.REACT_APP_AUTH_REDIRECT}`, origin);
    url.searchParams.set('authRedirect', origin);

    window.location.assign(url.toString());
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" component="h1" className={classes.message}>
        You are not authenticated!
      </Typography>
      <Button onClick={handleClick} variant="outlined">
        Click here to authenticate using your User Office account
      </Button>
    </div>
  );
}
