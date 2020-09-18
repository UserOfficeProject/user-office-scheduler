import { CircularProgress, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  loader: {
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
  },
}));

export default function Loader() {
  const classes = useStyles();

  return (
    <div className={classes.loader}>
      <CircularProgress />
    </div>
  );
}
