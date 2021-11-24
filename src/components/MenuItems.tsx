import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {
  CalendarToday as CalendarTodayIcon,
  Build as BuildIcon,
  LibraryAddCheck as LibraryAddCheckIcon,
} from '@material-ui/icons';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { PATH_CALENDAR, PATH_EQUIPMENTS, PATH_REQUESTS } from './paths';

export default function MenuItems() {
  return (
    <>
      <ListItem component={NavLink} to={PATH_CALENDAR} button>
        <ListItemIcon>
          <CalendarTodayIcon />
        </ListItemIcon>
        <ListItemText primary="Calendar" />
      </ListItem>
      <ListItem component={NavLink} to={PATH_EQUIPMENTS} button>
        <ListItemIcon>
          <BuildIcon />
        </ListItemIcon>
        <ListItemText primary="Equipment list" />
      </ListItem>
      <ListItem component={NavLink} to={PATH_REQUESTS} button>
        <ListItemIcon>
          <LibraryAddCheckIcon />
        </ListItemIcon>
        <ListItemText primary="Equipment requests" />
      </ListItem>
    </>
  );
}
