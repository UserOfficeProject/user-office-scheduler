import { makeStyles } from '@material-ui/core';
import React, { CSSProperties } from 'react';
import { EventProps } from 'react-big-calendar';

import EquipmentBookingInfo from 'components/equipment/EquipmentBookingInfo';
import ProposalBookingInfo from 'components/proposalBooking/ProposalBookingInfo';
import {
  GetScheduledEventsQuery,
  ProposalBooking,
  ProposalBookingStatus,
  ScheduledEvent,
  ScheduledEventBookingType,
} from 'generated/sdk';

export type BasicProposalBooking =
  GetScheduledEventsQuery['scheduledEvents'][number]['proposalBooking'];

export type CalendarScheduledEvent = Pick<
  ScheduledEvent,
  | 'id'
  | 'bookingType'
  | 'description'
  | 'bookingType'
  | 'equipmentId'
  | 'status'
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

export const isDraftEvent = (
  proposalBooking?: Pick<ProposalBooking, 'status'> | null
) => proposalBooking?.status === ProposalBookingStatus.DRAFT;

export const isClosedEvent = (
  proposalBooking?: Pick<ProposalBooking, 'status'> | null
) => proposalBooking?.status === ProposalBookingStatus.CLOSED;

export const getBookingTypeStyle = (
  bookingType: ScheduledEventBookingType,
  status: ProposalBookingStatus
): CSSProperties => {
  const opacity = isDraftEvent({ status }) ? '0.6' : '1';

  switch (bookingType) {
    case ScheduledEventBookingType.COMMISSIONING:
      return {
        backgroundColor: `rgba(147, 225, 216, ${opacity})`,
        color: '#000',
      };
    case ScheduledEventBookingType.MAINTENANCE:
      return {
        backgroundColor: `rgba(255, 166, 158, ${opacity})`,
        color: '#000',
      };
    case ScheduledEventBookingType.SHUTDOWN:
      return {
        backgroundColor: `rgba(170, 68, 101, ${opacity})`,
        color: '#fff',
      };
    case ScheduledEventBookingType.USER_OPERATIONS:
      return {
        backgroundColor: `rgba(145, 70, 175, ${opacity})`,
        color: '#fff',
      };
    case ScheduledEventBookingType.EQUIPMENT:
      return {
        backgroundColor: `rgba(124, 181, 236, ${opacity})`,
        color: '#fff',
      };
    default:
      return {};
  }
};

export const getClosedBookingStyle = (): CSSProperties => ({
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
});

export function eventPropGetter(event: CalendarScheduledEvent): {
  className?: string;
  style?: CSSProperties;
} {
  const eventStyle = isClosedEvent({ status: event.status })
    ? getClosedBookingStyle()
    : getBookingTypeStyle(event.bookingType, event.status);

  return {
    style: {
      borderRadius: 0,
      border: '1px solid #FFF',
      ...eventStyle,
    },
  };
}

export default function Event({
  event: {
    description,
    start,
    proposalBooking,
    status,
    bookingType,
    instrument,
    scheduledBy,
  },
  title,
}: EventProps<CalendarScheduledEvent>) {
  const classes = useStyles();
  switch (bookingType) {
    case ScheduledEventBookingType.USER_OPERATIONS:
      return (
        <ProposalBookingInfo
          booking={proposalBooking}
          scheduledEventStatus={status}
        />
      );
    case ScheduledEventBookingType.EQUIPMENT:
      return (
        <EquipmentBookingInfo
          name={description ?? 'NA'}
          instrument={instrument?.name ?? 'NA'}
          scheduledBy={
            `${scheduledBy?.firstname} ${scheduledBy?.lastname}` ?? 'NA'
          }
          proposalBooking={{ status }}
        />
      );
    default:
      return (
        <div data-cy={`event-${start.toISOString()}`}>
          <strong>{title}</strong>
          <div className={classes.eventDescription} data-cy="test-test">
            {description}
          </div>
        </div>
      );
  }
}
