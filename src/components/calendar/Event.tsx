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
  'id' | 'bookingType' | 'description' | 'bookingType' | 'equipmentId'
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

const getClosedBookingStyle = (): CSSProperties => ({
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
});

export function eventPropGetter(event: CalendarScheduledEvent): {
  className?: string;
  style?: CSSProperties;
} {
  const eventStyle = isClosedEvent(event.proposalBooking)
    ? getClosedBookingStyle()
    : getBookingTypeStyle(event.bookingType);

  return {
    style: {
      borderRadius: 0,
      border: '1px solid #FFF',
      opacity: isDraftEvent(event.proposalBooking) ? '0.6' : 'unset',
      ...eventStyle,
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
          proposalBooking={proposalBooking}
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
