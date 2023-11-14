import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp,
} from '@mui/icons-material';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Badge,
  useMediaQuery,
  Box,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';
import React, { useState, useContext } from 'react';
import { makeStyles } from 'tss-react/mui';

import { UserContext } from 'context/UserContext';

import RoleSelection from './RoleSelection';

export const drawerWidth = 240;

type AppToolbarProps = {
  open: boolean;
  handleDrawerOpen: () => void;
};

const useStyles = makeStyles<{ isTabletOrMobile: boolean }>()(
  (theme, { isTabletOrMobile }) => ({
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    appBar: {
      zIndex: !isTabletOrMobile ? theme.zIndex.drawer + 1 : theme.zIndex.drawer,
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
  })
);

export default function AppToolbar({
  open,
  handleDrawerOpen,
}: AppToolbarProps) {
  const isTabletOrMobile = useMediaQuery('(max-width: 1224px)');

  const { classes, cx } = useStyles({ isTabletOrMobile });

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, handleLogout } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [show, setShow] = useState(false);

  const handleProfileOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOnLogout = () => {
    setIsLoggingOut(true);
    handleLogout()
      .then(() => {})
      .finally(() => {
        setIsLoggingOut(false);
      });
  };
  const handleModalClose = () => setShow(false);

  return (
    <>
      <Dialog
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={show}
        onClose={handleModalClose}
        style={{ backdropFilter: 'blur(6px)' }}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <RoleSelection onClose={handleModalClose} />
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleModalClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <AppBar
        position="fixed"
        className={cx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            className={cx(classes.menuButton, open && classes.menuButtonHidden)}
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
          <Box display="flex" flexGrow={1} justifyContent="end">
            Logged in as {user?.email}
          </Box>
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
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                setShow(true);
                handleClose();
              }}
            >
              <Box paddingRight={1} paddingTop={1}>
                <SupervisedUserCircleIcon />
              </Box>
              Roles
            </MenuItem>
            <MenuItem
              data-cy="logout"
              onClick={handleOnLogout}
              disabled={isLoggingOut}
            >
              <Box paddingRight={1} paddingTop={1}>
                <ExitToApp />
              </Box>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
}
