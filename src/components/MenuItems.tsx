import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { CalendarToday } from '@material-ui/icons';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { PATH_CALENDAR } from './paths';

export default function MenuItems() {
  return (
    <ListItem component={NavLink} to={PATH_CALENDAR} button>
      <ListItemIcon>
        <CalendarToday />
      </ListItemIcon>
      <ListItemText primary="Calendar" />
    </ListItem>
  );
}
