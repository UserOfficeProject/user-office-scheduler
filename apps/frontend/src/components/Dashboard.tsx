import { ChevronLeft } from '@mui/icons-material';
import {
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  useMediaQuery,
} from '@mui/material';
import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';

import AppToolbar, { drawerWidth } from './appToolbar/AppToolbar';
import CalendarViewContainer from './calendar/CalendarViewContainer';
import CreateEditEquipment from './equipment/CreateEditEquipment';
import Equipments from './equipment/Equipments';
import ViewEquipment from './equipment/ViewEquipment';
import MenuItems from './MenuItems';
import {
  PATH_CALENDAR,
  PATH_ROOT,
  PATH_EQUIPMENTS,
  PATH_REQUESTS,
  PATH_VIEW_EQUIPMENT,
  PATH_CREATE_EQUIPMENT,
  PATH_EDIT_EQUIPMENT,
} from './paths';
import ViewRequests from './requests/ViewRequests';

const useStyles = makeStyles()((theme) => ({
  root: { display: 'flex' },
  content: {
    flexGrow: 1,
    height: 'calc(100vh - 64px)',
    marginTop: '64px',
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
    minHeight: '64px',
    [theme.breakpoints.down('md')]: {
      minHeight: '56px',
    },
  },
  drawerOpen: {
    width: drawerWidth,
    zIndex: theme.zIndex.drawer + 1,
    overflowX: 'hidden',
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
  const isTabletOrMobile = useMediaQuery('(max-width: 1224px)');
  const { classes, cx } = useStyles();
  const [open, setOpen] = React.useState(
    localStorage.drawerOpen
      ? localStorage.drawerOpen === '1'
      : !isTabletOrMobile
  );

  const handleDrawerOpen = () => {
    localStorage.setItem('drawerOpen', '1');
    setOpen(true);
  };

  const handleDrawerClose = () => {
    localStorage.setItem('drawerOpen', '0');
    setOpen(false);
  };

  useEffect(() => {
    if (isTabletOrMobile) {
      setOpen(false);
    } else if (localStorage.getItem('drawerOpen') === '1') {
      setOpen(true);
    }
  }, [isTabletOrMobile]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppToolbar open={open} handleDrawerOpen={handleDrawerOpen} />
      <Drawer
        variant={isTabletOrMobile ? 'temporary' : 'permanent'}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        className={cx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: !isTabletOrMobile
            ? cx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              })
            : '',
        }}
        open={open}
        onClose={handleDrawerClose}
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
          <Route path={PATH_CALENDAR} component={CalendarViewContainer} />
          <Route path={PATH_EQUIPMENTS} component={Equipments} exact />
          <Route
            path={PATH_CREATE_EQUIPMENT}
            component={CreateEditEquipment}
            exact
          />
          <Route
            path={PATH_EDIT_EQUIPMENT}
            component={CreateEditEquipment}
            exact
          />
          <Route path={PATH_VIEW_EQUIPMENT} component={ViewEquipment} exact />
          <Route path={PATH_REQUESTS} component={ViewRequests} exact />
          <Route path={PATH_ROOT}>
            <Redirect to={PATH_CALENDAR} />
          </Route>
        </Switch>
      </main>
    </div>
  );
}
