import { Button, Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import {
  Messages,
  NavigateAction,
  ToolbarProps,
  View,
} from 'react-big-calendar';

const useStyles = makeStyles(theme => ({
  flex: {
    display: 'flex',
  },
  tooltip: {
    margin: theme.spacing(0, 0, 2, 0),
  },
  justifyContentFlexEnd: {
    justifyContent: 'flex-end',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonGrp: {
    '& > button:first-child': {
      marginLeft: 0,
    },
    '& > button:last-child': {
      marginRight: 0,
    },
    '& > button': {
      margin: theme.spacing(1),
    },
  },
}));

export default function Toolbar({
  localizer: { messages },
  label,
  onNavigate,
  onView,
  views,
  view,
}: ToolbarProps) {
  const classes = useStyles();

  const onNav = (navAction: NavigateAction) => () => onNavigate(navAction);

  const onChangeView = (view: View) => () => onView(view);

  const viewNamesGroup = (messages: Messages) => {
    if (!Array.isArray(views)) {
      return null;
    }

    if (views.length > 1) {
      return views.map(name => (
        <Button
          key={name}
          type="button"
          variant="contained"
          color={view === name ? 'primary' : 'default'}
          onClick={onChangeView(name)}
          data-cy={`btn-view-${name}`}
        >
          {messages[name]}
        </Button>
      ));
    }
  };

  return (
    <div className={classes.tooltip}>
      <Grid container>
        <Grid item xs={5} className={classes.buttonGrp}>
          <Button
            variant="contained"
            onClick={onNav('TODAY')}
            data-cy="btn-view-today"
          >
            Today
          </Button>
          <Button
            variant="contained"
            onClick={onNav('PREV')}
            data-cy="btn-view-prev"
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={onNav('NEXT')}
            data-cy="btn-view-next"
          >
            Next
          </Button>
        </Grid>
        <Grid
          item
          xs={2}
          className={clsx(classes.flex, classes.centered)}
          data-cy="content-calendar-toolbar"
        >
          {label}
        </Grid>
        <Grid
          item
          xs={5}
          className={clsx(
            classes.flex,
            classes.buttonGrp,
            classes.justifyContentFlexEnd
          )}
        >
          {viewNamesGroup(messages)}
        </Grid>
      </Grid>
    </div>
  );
}
