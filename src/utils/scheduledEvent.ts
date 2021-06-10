import { Moment } from 'moment';

type BaseEvent = { id: string; startsAt: Moment | Date; endsAt: Moment | Date };

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
    // console.log('outer run');

    return events.some((innerEvent) => {
      // console.log('inner run');

      if (innerEvent.id === outerEvent.id) {
        return false;
      }

      return isOverlapping(outerEvent, innerEvent);
    });
  });
}
