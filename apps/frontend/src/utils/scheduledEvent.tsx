import moment, { Moment } from 'moment';
import React from 'react';
import { stringOrDate } from 'react-big-calendar';

import { ScheduledEventBookingType } from 'generated/sdk';

type BaseEvent = { id: number; startsAt: Moment | Date; endsAt: Moment | Date };

type CalendarEvent = {
  start: Date;
  end: Date;
  bookingType: ScheduledEventBookingType;
};

export const SHUTDOWN_OVERLAP_WARNING = (
  <>
    The selected time slot falls within a <strong>shutdown</strong> period. Are
    you sure you want to schedule this event during a shutdown?
  </>
);

/**
 * Checks if a time range overlaps with any SHUTDOWN background events.
 * Returns true if there is an overlap with at least one SHUTDOWN event.
 */
export function overlapsWithShutdown(
  start: stringOrDate,
  end: stringOrDate,
  backgroundEvents: CalendarEvent[]
): boolean {
  const eventStart = moment(start);
  const eventEnd = moment(end);

  return backgroundEvents.some((bgEvent) => {
    if (bgEvent.bookingType !== ScheduledEventBookingType.SHUTDOWN) {
      return false;
    }

    const bgStart = moment(bgEvent.start);
    const bgEnd = moment(bgEvent.end);

    return eventStart.isBefore(bgEnd) && eventEnd.isAfter(bgStart);
  });
}

export function isOverlapping<T extends BaseEvent>(eventA: T, eventB: T) {
  if (
    (eventA.startsAt >= eventB.startsAt && eventA.endsAt <= eventB.endsAt) ||
    //
    (eventA.startsAt < eventB.endsAt && eventA.endsAt > eventB.startsAt)
  ) {
    return true;
  }

  return false;
}

export function hasOverlappingEvents<T extends BaseEvent>(
  events: T[]
): boolean {
  // this is a n^2 in worst case
  // but will stop at first match
  // comparing 1000 events takes 500ms
  // TODO: optimize in the future
  return events.some((outerEvent) => {
    return events.some((innerEvent) => {
      if (innerEvent.id === outerEvent.id) {
        return false;
      }

      return isOverlapping(outerEvent, innerEvent);
    });
  });
}
