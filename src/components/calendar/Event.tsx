import { makeStyles } from '@material-ui/core';
import React, { CSSProperties } from 'react';
import { EventProps } from 'react-big-calendar';

import EquipmentBookingInfo from 'components/equipment/EquipmentBookingInfo';
import ProposalBookingInfo from 'components/proposalBooking/ProposalBookingInfo';
import {
  GetScheduledEventsQuery,
  ScheduledEvent,
  ScheduledEventBookingType,
} from 'generated/sdk';

export type BasicProposalBooking = GetScheduledEventsQuery['scheduledEvents'][number]['proposalBooking'];

export type CalendarScheduledEvent = Pick<
  ScheduledEvent,
  'id' | 'bookingType' | 'description' | 'bookingType'
> & {
  start: Date;
  end: Date;
  title: string;
  proposalBooking: BasicProposalBooking;
  instrument: GetScheduledEventsQuery['scheduledEvents'][number]['instrument'];
  scheduledBy: GetScheduledEventsQuery['scheduledEvents'][number]['scheduledBy'];
};

const useStyles = makeStyles(() => ({
  eventDescription: {
    marginTop: 5,
  },
}));

function getBookingTypeStyle(
  bookingType: ScheduledEventBookingType
): CSSProperties | undefined {
  switch (bookingType) {
    case ScheduledEventBookingType.COMMISSIONING:
      return {
        backgroundColor: '#93E1D8',
        color: '#000',
      };
    case ScheduledEventBookingType.MAINTENANCE:
      return {
        backgroundColor: '#FFA69E',
        color: '#000',
      };
    case ScheduledEventBookingType.SHUTDOWN:
      return {
        backgroundColor: '#AA4465',
        color: '#fff',
      };
    case ScheduledEventBookingType.USER_OPERATIONS:
      return {
        backgroundColor: '#9146AF',
        color: '#fff',
      };
    case ScheduledEventBookingType.EQUIPMENT:
      return {
        backgroundColor: '#7CB5EC',
        color: '#fff',
      };
    default:
      return;
  }
}

export function eventPropGetter(
  event: CalendarScheduledEvent
): {
  className?: string;
  style?: CSSProperties;
} {
  return {
    style: {
      borderRadius: 0,
      border: '1px solid #FFF',
      ...getBookingTypeStyle(event.bookingType),
    },
  };
}

export default function Event({
  event: {
    description,
    start,
    proposalBooking,
    bookingType,
    instrument,
    scheduledBy,
  },
  title,
}: EventProps<CalendarScheduledEvent>) {
  const classes = useStyles();
  switch (bookingType) {
    case ScheduledEventBookingType.USER_OPERATIONS:
      return <ProposalBookingInfo booking={proposalBooking} />;
    case ScheduledEventBookingType.EQUIPMENT:
      return (
        <EquipmentBookingInfo
          name={description ?? 'NA'}
          instrument={instrument?.name ?? 'NA'}
          scheduledBy={
            `${scheduledBy?.firstname} ${scheduledBy?.lastname}` ?? 'NA'
          }
        />
      );
    default:
      return (
        <div data-cy={`event-${start.toISOString()}`}>
          <strong>{title}</strong>
          <div className={classes.eventDescription}>{description}</div>
        </div>
      );
  }
}
