import { makeStyles } from '@material-ui/core';
import React, { CSSProperties } from 'react';
import { EventProps } from 'react-big-calendar';

import { ScheduledEvent, ScheduledEventBookingType } from 'generated/sdk';

export type CalendarScheduledEvent = Pick<
  ScheduledEvent,
  'id' | 'bookingType' | 'description'
> & {
  start: Date;
  end: Date;
  title: string;
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
      border: 0,
      ...getBookingTypeStyle(event.bookingType),
    },
  };
}

export default function Event({
  event: { description, start },
  title,
}: EventProps<CalendarScheduledEvent>) {
  const classes = useStyles();

  return (
    <div data-cy={`event-${start.toISOString()}`}>
      <strong>{title}</strong>
      {/* TODO: should be hidden in some cases, like Month view */}
      {description && (
        <div className={classes.eventDescription}>{description}</div>
      )}
    </div>
  );
}
