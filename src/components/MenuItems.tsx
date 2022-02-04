import {
  CalendarToday as CalendarTodayIcon,
  Build as BuildIcon,
  LibraryAddCheck as LibraryAddCheckIcon,
} from '@mui/icons-material';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { useQuery } from 'hooks/common/useQuery';

import {
  getArrayOfIdsFromQuery,
  SchedulerViewPeriod,
} from './calendar/CalendarViewContainer';
import { PATH_CALENDAR, PATH_EQUIPMENTS, PATH_REQUESTS } from './paths';

const generateCalendarPath = (calendarState: CalendarLocalStorageState) => {
  const path = [];

  if (calendarState.activeView) {
    path.push(`viewPeriod=${calendarState.activeView}`);
  }

  if (calendarState.instrumentIds?.length) {
    path.push(
      `instrument=${encodeURIComponent(calendarState.instrumentIds.join(','))}`
    );
  }

  if (calendarState.localContactIds?.length) {
    path.push(
      `localContact=${encodeURIComponent(
        calendarState.localContactIds.join(',')
      )}`
    );
  }

  if (calendarState.equipmentIds?.length) {
    path.push(
      `equipment=${encodeURIComponent(calendarState.equipmentIds.join(','))}`
    );
  }

  if (calendarState.startsAt) {
    path.push(`startsAt=${encodeURIComponent(calendarState.startsAt)}`);
  }

  if (calendarState.schedulerView) {
    path.push(`schedulerView=${calendarState.schedulerView}`);
  }

  return `${PATH_CALENDAR}?${path.join('&')}`;
};

const getCalendarLocalStorageState = (): CalendarLocalStorageState | null => {
  const calendarlocalStorageState = localStorage.getItem('calendarState');

  return calendarlocalStorageState && JSON.parse(calendarlocalStorageState);
};

type CalendarLocalStorageState = {
  instrumentIds: number[] | null;
  equipmentIds: number[] | null;
  localContactIds: number[] | null;
  schedulerView: string | null;
  activeView: string | null;
  startsAt: string | null;
};

export default function MenuItems() {
  const query = useQuery();
  const location = useLocation();

  const [calendarPath, setCalendarPath] = useState(PATH_CALENDAR);

  const queryInstrument = query.get('instrument');
  const queryEquipment = query.get('equipment');
  const queryLocalContact = query.get('localContact');
  const querySchedulerView = query.get('schedulerView');
  const queryView = query.get('viewPeriod') as SchedulerViewPeriod;
  const queryStartsAt = query.get('startsAt');

  useEffect(() => {
    if (location.pathname !== PATH_CALENDAR) {
      return;
    }

    const calendarInitialState: CalendarLocalStorageState = {
      instrumentIds: null,
      equipmentIds: null,
      localContactIds: null,
      schedulerView: null,
      activeView: null,
      startsAt: null,
    };

    const calendarlocalStorageState =
      getCalendarLocalStorageState() || calendarInitialState;

    const calendarNewState = {
      instrumentIds: getArrayOfIdsFromQuery(queryInstrument),
      equipmentIds: getArrayOfIdsFromQuery(queryEquipment),
      localContactIds: getArrayOfIdsFromQuery(queryLocalContact),
      schedulerView: querySchedulerView,
      activeView: queryView || calendarlocalStorageState.activeView,
      startsAt: queryStartsAt || calendarlocalStorageState.startsAt,
    };

    localStorage.setItem('calendarState', JSON.stringify(calendarNewState));
    setCalendarPath(generateCalendarPath(calendarNewState));
  }, [
    querySchedulerView,
    queryView,
    queryStartsAt,
    queryInstrument,
    queryEquipment,
    queryLocalContact,
    location.pathname,
  ]);

  // NOTE: On reload remove the saved calendar state because if we keep it always there wont be any way to start from clean state or just /calendar url it will always be populated with localstorage state
  useEffect(() => {
    window.onbeforeunload = function () {
      localStorage.removeItem('calendarState');
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  return (
    <>
      <ListItem component={NavLink} to={calendarPath} button>
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
