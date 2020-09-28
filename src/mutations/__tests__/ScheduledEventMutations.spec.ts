import MockupScheduledEventDataSource from '../../datasources/mockups/ScheduledEventDataSource';
import { ScheduledEventBookingType } from '../../models/ScheduledEvent';
import ScheduledEventMutations from '../ScheduledEventMutations';

const scheduledEventMutations = new ScheduledEventMutations(
  new MockupScheduledEventDataSource()
);

test('should create a new scheduled event', () => {
  const startsAt = new Date();
  const endsAt = new Date(+startsAt + 60 * 60 * 1e3);

  return expect(
    scheduledEventMutations.create({
      bookingType: ScheduledEventBookingType.USER_OPERATIONS,
      description: null,
      startsAt,
      endsAt,
      scheduledById: 0,
    })
  ).resolves.toMatchObject({
    bookingType: ScheduledEventBookingType.USER_OPERATIONS,
    description: null,
    startsAt,
    endsAt,
    scheduledBy: { id: 0 },
  });
});
