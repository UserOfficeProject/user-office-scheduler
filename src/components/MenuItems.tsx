import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {
  CalendarToday as CalendarTodayIcon,
  Build as BuildIcon,
} from '@material-ui/icons';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { PATH_CALENDAR, PATH_EQUIPMENTS } from './paths';

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
        <ListItemText primary="Equipments" />
      </ListItem>
    </>
  );
}
