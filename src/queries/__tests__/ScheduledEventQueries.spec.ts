import MockupScheduledEventDataSource, {
  dummyScheduledEvents,
} from '../../datasources/mockups/ScheduledEventDataSource';
import ScheduledEventQueries from '../ScheduledEventQueries';

const scheduledEventQueries = new ScheduledEventQueries(
  new MockupScheduledEventDataSource()
);

test('should return the list of all scheduled events', () => {
  return expect(
    scheduledEventQueries.scheduledEvents({
      instrumentId: 0,
      endsAt: null,
      startsAt: null,
    })
  ).resolves.toEqual(dummyScheduledEvents);
});

test('should return the scheduled event with the given ID', () => {
  return expect(scheduledEventQueries.scheduledEvent(123)).resolves.toEqual(
    dummyScheduledEvents.find(({ id }) => id === 123)
  );
});

test('should return null when the scheduled event does not exist', () => {
  return expect(scheduledEventQueries.scheduledEvent(999)).resolves.toBe(null);
});
