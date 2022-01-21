import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Badge,
  Popper,
  Card,
  ClickAwayListener,
  CardHeader,
  Avatar,
  useMediaQuery,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React, { useState, useContext } from 'react';

import { UserContext } from 'context/UserContext';
import { getFullUserName } from 'utils/user';

export const drawerWidth = 240;

type AppToolbarProps = {
  open: boolean;
  handleDrawerOpen: () => void;
};

export default function AppToolbar({
  open,
  handleDrawerOpen,
}: AppToolbarProps) {
  const isTabletOrMobile = useMediaQuery('(max-width: 1224px)');

  const useStyles = makeStyles((theme) => ({
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: isTabletOrMobile ? 0 : drawerWidth,
      width: isTabletOrMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
      transition: isTabletOrMobile
        ? 'none'
        : theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
    },
    menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: isTabletOrMobile ? 'inline-flex' : 'none',
    },
    title: {
      flexGrow: 1,
    },
    profilePopper: {
      zIndex: theme.zIndex.drawer + 2,
    },
  }));

  const classes = useStyles();

  const { user } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  const handleProfileOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setProfileOpen((prev) => !prev);
  };

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, open && classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Open drawer"
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        >
          User Office Scheduler
        </Typography>
        <IconButton
          color="inherit"
          aria-controls="simple-menu"
          aria-haspopup="true"
          data-cy="profile-page-btn"
          onClick={handleProfileOpen}
        >
          <Badge color="secondary">
            <AccountCircleIcon />
          </Badge>
        </IconButton>
        <Popper
          open={profileOpen}
          anchorEl={anchorEl}
          placement="bottom-end"
          className={classes.profilePopper}
        >
          <ClickAwayListener onClickAway={() => setProfileOpen(false)}>
            <Card>
              <CardHeader
                avatar={<Avatar />}
                title={getFullUserName(user)}
                subheader={user?.email}
              />
            </Card>
          </ClickAwayListener>
        </Popper>
      </Toolbar>
    </AppBar>
  );
}
