import makeStyles from '@mui/styles/makeStyles';
import React, { CSSProperties } from 'react';
import { EventProps } from 'react-big-calendar';

import EquipmentBookingInfo from 'components/equipment/EquipmentBookingInfo';
import ProposalBookingInfo from 'components/proposalBooking/ProposalBookingInfo';
import {
  BasicUserDetailsFragment,
  GetScheduledEventsQuery,
  ProposalBooking,
  ProposalBookingStatusCore,
  ScheduledEvent,
  ScheduledEventBookingType,
} from 'generated/sdk';
import { getFullUserName } from 'utils/user';

export type BasicProposalBooking =
  GetScheduledEventsQuery['scheduledEvents'][number]['proposalBooking'];

export type CalendarScheduledEvent = Pick<
  ScheduledEvent,
  | 'id'
  | 'bookingType'
  | 'description'
  | 'color'
  | 'bookingType'
  | 'equipmentId'
  | 'status'
> & {
  localContact:
    | Pick<BasicUserDetailsFragment, 'id' | 'firstname' | 'lastname'>
    | null
    | undefined;
  start: Date;
  startTableRenderValue: string;
  end: Date;
  endTableRenderValue: string;
  title: string;
  bookingTypeTableRenderValue: string;
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
) => proposalBooking?.status === ProposalBookingStatusCore.DRAFT;

export const isCompletedEvent = (
  proposalBooking?: Pick<ProposalBooking, 'status'> | null
) => proposalBooking?.status === ProposalBookingStatusCore.COMPLETED;

export const getBookingTypeStyle = (
  event: CalendarScheduledEvent
): CSSProperties => {
  const opacity = isDraftEvent({ status: event.status }) ? 0.6 : 1;
  const grayscale = isCompletedEvent({ status: event.status }) ? 0.5 : 0;

  const filter = `grayscale(${grayscale}) opacity(${opacity})`;

  switch (event.bookingType) {
    case ScheduledEventBookingType.MAINTENANCE:
      return {
        background: 'rgb(255, 166, 158)',
        color: '#000',
        filter: filter,
      };
    case ScheduledEventBookingType.SHUTDOWN:
      return {
        background: 'rgb(170, 68, 101)',
        color: '#fff',
        filter: filter,
      };
    case ScheduledEventBookingType.USER_OPERATIONS:
      return {
        background: 'rgb(145, 70, 175)',
        color: '#fff',
        filter: filter,
      };
    case ScheduledEventBookingType.EQUIPMENT:
      return {
        background: event.color || 'rgb(124, 181, 236)', // Default background some blue-ish variant.
        color: '#fff', // Default text color white.
        filter: filter,
      };
    default:
      return {};
  }
};

export const eventPropGetter = (
  event: CalendarScheduledEvent
): {
  className?: string;
  style?: CSSProperties;
} => ({
  style: {
    borderRadius: 0,
    border: '1px solid #FFF',
    ...getBookingTypeStyle(event),
  },
});

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
          scheduledBy={getFullUserName(scheduledBy)}
          proposalBooking={{ status }}
        />
      );
    default:
      return (
        <div data-cy={`event-${new Date(start).toISOString()}`}>
          <strong>{title}</strong>
          <div className={classes.eventDescription} data-cy="test-test">
            {description}
          </div>
        </div>
      );
  }
}
