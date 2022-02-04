import { CircularProgress, Grid, Container, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: theme.zIndex.tooltip,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    userSelect: 'none',
  },
  message: {
    margin: theme.spacing(2),
    color: theme.palette.grey[700],
  },

  fullHeight: {
    height: '100%',
  },
  relative: {
    position: 'relative',
  },
  spaced: {
    margin: theme.spacing(4, 0),
  },
}));

function LoaderContainer({
  children,
  container,
}: {
  children?: React.ReactNode;
  container?: boolean;
}) {
  const classes = useStyles();

  if (!container) {
    return <>{children}</>;
  }

  return (
    <Container maxWidth={false} className={classes.fullHeight}>
      <Grid container className={classes.fullHeight}>
        <Grid item xs={12} className={classes.fullHeight}>
          <Paper
            sx={{ margin: [0, 1] }}
            className={clsx(classes.fullHeight, classes.relative)}
          >
            {children}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

type LoaderProps = {
  message?: string | JSX.Element;
  container?: boolean;
  relative?: boolean;
  spaced?: boolean;
};

export default function Loader({
  message,
  container,
  relative,
  spaced,
}: LoaderProps) {
  const classes = useStyles();

  return (
    <LoaderContainer container={container}>
      <div
        className={clsx(classes.root, {
          [classes.relative]: relative,
          [classes.spaced]: spaced,
        })}
        role="status"
      >
        <CircularProgress />
        {message && <div className={classes.message}>{message}</div>}
      </div>
    </LoaderContainer>
  );
}
