import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { CalendarToday } from '@material-ui/icons';
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function MenuItems() {
  return (
    <ListItem component={NavLink} to="/calendar" button>
      <ListItemIcon>
        <CalendarToday />
      </ListItemIcon>
      <ListItemText primary="Calendar" />
    </ListItem>
  );
}
