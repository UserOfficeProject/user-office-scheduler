import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {
  CalendarToday as CalendarTodayIcon,
  Build as BuildIcon,
  LibraryAddCheck as LibraryAddCheckIcon,
} from '@material-ui/icons';
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { PATH_CALENDAR, PATH_EQUIPMENTS, PATH_REQUESTS } from './paths';

export default function MenuItems() {
  // NOTE: On reload remove the saved calendar state because if we keep it always there wont be any way to start from clean state or just /calendar url
  useEffect(() => {
    window.onbeforeunload = function () {
      localStorage.removeItem('calendarState');
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  const generateCalendarPath = () => {
    const localStorageCalendarState = localStorage.getItem('calendarState');
    const path = [];

    if (localStorageCalendarState) {
      const calendarState = JSON.parse(localStorageCalendarState);

      if (calendarState.activeView) {
        path.push(`viewPeriod=${calendarState.activeView}`);
      }
      if (calendarState.instrumentIds?.length) {
        path.push(
          `instrument=${encodeURIComponent(
            calendarState.instrumentIds.join(',')
          )}`
        );
      }
      if (calendarState.equipmentIds?.length) {
        path.push(
          `equipment=${encodeURIComponent(
            calendarState.equipmentIds.join(',')
          )}`
        );
      }
      if (calendarState.startsAt) {
        path.push(`startsAt=${encodeURIComponent(calendarState.startsAt)}`);
      }
      if (calendarState.schedulerView) {
        path.push(`schedulerView=${calendarState.schedulerView}`);
      }
    }

    console.log(`${PATH_CALENDAR}?${path.join('&')}`);

    return `${PATH_CALENDAR}?${path.join('&')}`;
  };

  return (
    <>
      <ListItem component={NavLink} to={generateCalendarPath()} button>
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
