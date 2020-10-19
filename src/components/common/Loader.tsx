import { CircularProgress, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: theme.zIndex.tooltip,
    backgroundColor: 'rgba(255,255,255,0.7)',
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
}));

type LoaderProps = { message?: string | JSX.Element };

export default function Loader({ message }: LoaderProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress />
      {message && <div className={classes.message}>{message}</div>}
    </div>
  );
}
