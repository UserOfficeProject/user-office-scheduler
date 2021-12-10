import { makeStyles } from '@material-ui/core';
import * as H from 'history';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Views } from 'react-big-calendar';
import Timeline, {
  DateHeader,
  SidebarHeader,
  TimelineHeaders,
} from 'react-calendar-timeline';
// @ts-expect-error @types/react-calendar-timeline is not updated with tle latest changes on react-calendar-timeline
import containerResizeDetector from 'react-calendar-timeline/lib/resize-detector/container';
import 'react-calendar-timeline/lib/Timeline.css';
import { useHistory } from 'react-router';

import { InstrumentAndEquipmentContext } from 'context/InstrumentAndEquipmentContext';
import {
  BasicUserDetailsFragment,
  ScheduledEventBookingType,
  ScheduledEventFilter,
} from 'generated/sdk';
import { useQuery } from 'hooks/common/useQuery';
import { PartialEquipment } from 'hooks/equipment/useEquipments';
import { PartialInstrument } from 'hooks/instrument/useUserInstruments';
import { toTzLessDateTime, TZ_LESS_DATE_TIME_FORMAT } from 'utils/date';

import {
  CalendarScheduledEventWithUniqeId,
  getEquipmentIdsFromQuery,
  getInstrumentIdsFromQuery,
  SchedulerViewPeriod,
} from './CalendarViewContainer';
import { getBookingTypeStyle } from './Event';
import 'moment/locale/en-gb';
import Toolbar, { getLabelText } from './Toolbar';

type TimeLineViewProps = {
  events: CalendarScheduledEventWithUniqeId[];
  filter: ScheduledEventFilter;
  onSelectEvent: (selectedEvent: CalendarScheduledEventWithUniqeId) => void;
};

// NOTE: Debounce the function because there are too many calls on scroll so we want to avoid bombarding the backend with so many requests for new events
const handleTimeChange = debounce(
  (newStart: moment.Moment, query: URLSearchParams, history: H.History) => {
    query.set('startsAt', newStart.format(TZ_LESS_DATE_TIME_FORMAT));
    history.push(`?${query}`);
  },
  500
);

const useStyles = makeStyles((theme) => ({
  root: {
    '& .react-calendar-timeline': {
      '& .rct-header-root': {
        background: theme.palette.primary.main,

        '& .primaryHeader .customPrimaryHeader ~ .customPrimaryHeader': {
          display: 'none',
        },

        '& .customPrimaryHeader': {
          left: '0 !important',
          width: '100% !important',
          textAlign: 'center',
          padding: theme.spacing(0.5),
          color: '#fff',
        },
      },
      '& .rct-items .rct-item .rct-item-content': {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        width: '100%',
      },

      '& .rct-sidebar .rct-sidebar-row': {
        padding: 0,

        '& .custom-group': {
          background: 'lightgray',
          padding: '0 4px',
        },
      },

      '& .rct-scroll .row-root .rct-vertical-lines': {
        display: 'none',
      },
    },
  },
}));

// TODO: Cleanup and refactor grouping logic
const TimeLineView: React.FC<TimeLineViewProps> = ({
  events,
  filter,
  onSelectEvent,
}) => {
  const { instruments, equipments, localContacts } = useContext(
    InstrumentAndEquipmentContext
  );
  const query = useQuery();
  const history = useHistory();
  const classes = useStyles();

  const queryView =
    (query.get('viewPeriod') as SchedulerViewPeriod) || Views.WEEK;
  const startsAt = query.get('startsAt');
  const queryInstrument = query.get('instrument');
  const queryEquipment = query.get('equipment');
  const queryLocalContact = query.get('localContact');

  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedInstruments, setSelectedInstruments] = useState<
    PartialInstrument[]
  >([]);
  const [selectedEquipments, setSelectedEquipments] = useState<
    PartialEquipment[]
  >([]);
  const [selectedLocalContacts, setSelectedLocalContacts] = useState<
    BasicUserDetailsFragment[]
  >([]);
  const [instrumentGroups, setInstrumentGroups] = useState<
    {
      id: string | number;
      title: string;
      parent: string | null;
      root: boolean;
    }[]
  >([]);
  const [equipmentGroups, setEquipmentGroups] = useState<
    {
      id: string | number;
      title: string;
      parent: string | null;
      root: boolean;
    }[]
  >([]);
  const [localContactGroups, setLocalContactGroups] = useState<
    {
      id: string | number;
      title: string;
      parent: string | null;
      root: boolean;
    }[]
  >([]);

  const initialVisibleTimeStart = moment
    .utc(startsAt || moment().startOf(queryView))
    .local();
  const initialVisibleTimeEnd = moment(initialVisibleTimeStart).add(
    1,
    queryView
  );

  const [visibleTimeStart, setVisibleTimeStart] = useState(
    initialVisibleTimeStart
  );
  const [visibleTimeEnd, setVisibleTimeEnd] = useState(initialVisibleTimeEnd);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    instruments_root: true,
    equipments_root: true,
    local_contact_root: true,
  });

  useEffect(() => {
    if (startsAt) {
      const newVisibleTimeStart = moment.utc(startsAt).local();
      const newVisibleTimeEnd = moment(newVisibleTimeStart).add(1, queryView);

      setVisibleTimeStart(newVisibleTimeStart);
      setVisibleTimeEnd(newVisibleTimeEnd);
    }
  }, [startsAt, queryView]);

  useEffect(() => {
    const queryInstrumentIds = getInstrumentIdsFromQuery(queryInstrument);

    if (queryInstrumentIds?.length !== 0 && instruments.length) {
      setSelectedInstruments(
        instruments.filter((item) => queryInstrumentIds.includes(item.id))
      );
    } else {
      setSelectedInstruments([]);
    }
  }, [instruments, queryInstrument, setSelectedInstruments]);

  useEffect(() => {
    const queryEquipmentIds = getEquipmentIdsFromQuery(queryEquipment);

    if (queryEquipmentIds?.length !== 0 && equipments.length) {
      setSelectedEquipments(
        equipments.filter((item) => queryEquipmentIds.includes(item.id))
      );
    } else {
      setSelectedEquipments([]);
    }
  }, [equipments, queryEquipment, setSelectedEquipments]);

  useEffect(() => {
    const queryLocalContactIds = getEquipmentIdsFromQuery(queryLocalContact);

    if (queryLocalContactIds?.length !== 0 && localContacts.length) {
      setSelectedLocalContacts(
        localContacts.filter((item) => queryLocalContactIds.includes(item.id))
      );
    } else {
      setSelectedLocalContacts([]);
    }
  }, [localContacts, queryLocalContact, setSelectedLocalContacts]);

  useEffect(() => {
    if (selectedInstruments.length) {
      const newInstrumentGroups = [
        {
          id: 'instruments_root',
          title: 'Instruments',
          parent: null,
          root: true,
        },
        ...selectedInstruments.map((selectedInstrument) => ({
          id: `INSTRUMENT_${selectedInstrument.id}`,
          title: selectedInstrument.name,
          parent: 'instruments_root',
          root: false,
        })),
      ];

      setInstrumentGroups(newInstrumentGroups);
    } else {
      setInstrumentGroups([]);
    }
  }, [selectedInstruments, setInstrumentGroups]);

  useEffect(() => {
    if (selectedEquipments.length) {
      const newEquipmentGroups = [
        {
          id: 'equipments_root',
          title: 'Equipments',
          parent: null,
          root: true,
        },
        ...selectedEquipments.map((selectedEquipment) => ({
          id: `EQUIPMENT_${selectedEquipment.id}`,
          title: selectedEquipment.name,
          parent: 'equipments_root',
          root: false,
        })),
      ];

      setEquipmentGroups(newEquipmentGroups);
    } else {
      setEquipmentGroups([]);
    }
  }, [selectedEquipments, setEquipmentGroups]);

  useEffect(() => {
    if (selectedLocalContacts.length) {
      const newLocalContactGroups = [
        {
          id: 'local_contact_root',
          title: 'Local contacts',
          parent: null,
          root: true,
        },
        ...selectedLocalContacts.map((selectedLocalContact) => ({
          id: `LOCAL_CONTACT_${selectedLocalContact.id}`,
          title: `${selectedLocalContact.firstname} ${selectedLocalContact.lastname}`,
          parent: 'local_contact_root',
          root: false,
        })),
      ];

      setLocalContactGroups(newLocalContactGroups);
    } else {
      setLocalContactGroups([]);
    }
  }, [selectedLocalContacts, setLocalContactGroups]);

  const allGroups = [
    ...instrumentGroups,
    ...equipmentGroups,
    ...localContactGroups,
  ];

  const getEventTitle = (event: CalendarScheduledEventWithUniqeId) => {
    return `${event.proposalBooking?.proposal?.title || event.title} (${
      event.proposalBooking?.proposal?.proposalId || event.description
    }) - [${toTzLessDateTime(event.start)} - ${toTzLessDateTime(
      event.end
    )}] - ${event.status}`;
  };

  const eventItems = events
    .map((event) => ({
      id: `${event.id}_${event.bookingType}_${event.equipmentId}`,
      group:
        event.bookingType === ScheduledEventBookingType.EQUIPMENT
          ? `EQUIPMENT_${event.equipmentId}`
          : `INSTRUMENT_${event.instrument?.id || 0}`,
      title: getEventTitle(event),
      itemProps: {
        onClick: () => onSelectEvent(event),
        onTouchStart: () => onSelectEvent(event),
        style: {
          ...getBookingTypeStyle(event.bookingType, event.status),
          overflow: 'hidden',
        },
      },
      start_time: moment(event.start),
      end_time: moment(event.end),
    }))
    .concat(
      ...events
        .filter(
          (event) =>
            event.bookingType === ScheduledEventBookingType.USER_OPERATIONS &&
            event.localContact
        )
        .map((event) => ({
          id: `${event.id}_${event.bookingType}_${event.equipmentId}`,
          group: `LOCAL_CONTACT_${event.localContact!.id}`,
          title: getEventTitle(event),
          itemProps: {
            onClick: () => onSelectEvent(event),
            onTouchStart: () => onSelectEvent(event),
            style: {
              ...getBookingTypeStyle(event.bookingType, event.status),
              overflow: 'hidden',
            },
          },
          start_time: moment(event.start),
          end_time: moment(event.end),
        }))
    );

  const onTimeChange = (
    newVisibleTimeStart: number,
    newVisibleTimeEnd: number
  ) => {
    const newStart = moment(newVisibleTimeStart);
    const newEnd = moment(newVisibleTimeEnd);

    // NOTE: Like this we prevent calling handleTimeChange on initial render because it's not needed to do one more re-render
    if (
      !isInitialized ||
      !newStart.diff(visibleTimeStart, 'hours') ||
      !selectedInstruments.length
    ) {
      setIsInitialized(true);

      return;
    }

    setVisibleTimeStart(newStart);
    setVisibleTimeEnd(newEnd);

    handleTimeChange(newStart, query, history);
  };

  const toggleGroup = (id: string | number) => {
    setOpenGroups({ ...openGroups, [id]: !openGroups[id] });
  };

  const timeLineReadyGroups = allGroups.length
    ? allGroups
        .filter((g) => g.root || (g.parent && openGroups[g.parent]))
        .map((group) => {
          return {
            ...group,
            title: group.root ? (
              <div
                onClick={() => toggleGroup(group.id)}
                style={{ cursor: 'pointer' }}
              >
                {openGroups[group.id] ? '[-]' : '[+]'} <b>{group.title}</b>
              </div>
            ) : (
              <div className="rct-sidebar-row" style={{ paddingLeft: 10 }}>
                {group.title}
              </div>
            ),
          };
        })
    : [];

  return (
    <div data-cy="calendar-timeline-view" className={classes.root}>
      <Toolbar
        filter={filter}
        shouldIncludeCalendarNavigation
        multipleInstruments
      />
      <Timeline
        groups={timeLineReadyGroups}
        groupRenderer={({ group }) => {
          return (
            <div className={`${group.root ? 'custom-group' : ''}`}>
              <span className="title">{group.title}</span>
              {/* <p className="tip">{group.tip}</p> */}
            </div>
          );
        }}
        items={eventItems}
        visibleTimeStart={visibleTimeStart.valueOf()}
        visibleTimeEnd={visibleTimeEnd.valueOf()}
        resizeDetector={containerResizeDetector}
        horizontalLineClassNamesForGroup={(group) =>
          group.root ? ['row-root'] : []
        }
        stackItems
        canMove={false}
        canResize={false}
        onTimeChange={onTimeChange}
      >
        {queryView === 'week' && (
          <TimelineHeaders>
            <SidebarHeader>
              {({ getRootProps }) => {
                return <div {...getRootProps()} />;
              }}
            </SidebarHeader>
            <DateHeader
              unit="primaryHeader"
              className="primaryHeader"
              intervalRenderer={(props) => {
                if (!props) {
                  return;
                }
                const { getIntervalProps } = props;

                return (
                  <div className="customPrimaryHeader" {...getIntervalProps()}>
                    {getLabelText(queryView, visibleTimeStart.toString())}
                  </div>
                );
              }}
            />
            <DateHeader />
          </TimelineHeaders>
        )}
      </Timeline>
    </div>
  );
};

export default TimeLineView;
