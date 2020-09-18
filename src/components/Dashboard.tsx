import {
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  makeStyles,
} from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import AppToolbar, { drawerWidth } from './appToolbar/AppToolbar';
import Calendar from './calendar/Calendar';
import MenuItems from './MenuItems';
import { PATH_CALENDAR, PATH_ROOT } from './paths';

const useStyles = makeStyles(theme => ({
  root: { display: 'flex' },
  content: {
    flexGrow: 1,
    height: 'calc(100vh - 64px)',
    marginTop: '64px',
    padding: `0 ${theme.spacing(2)}px`,
    width: `calc(100% - ${drawerWidth}px)`,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppToolbar open={open} handleDrawerOpen={handleDrawerOpen} />
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        <List disablePadding>
          <MenuItems />
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <Switch>
          <Route path={PATH_CALENDAR} component={Calendar} />
          <Route path={PATH_ROOT}>
            <Redirect to={PATH_CALENDAR} />
          </Route>
        </Switch>
      </main>
    </div>
  );
}
