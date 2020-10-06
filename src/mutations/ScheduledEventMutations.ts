import { logger } from '@esss-swap/duo-logger';

import { ScheduledEventDataSource } from '../datasources/ScheduledEventDataSource';
import { ScheduledEvent } from '../models/ScheduledEvent';
import { rejection, Rejection } from '../rejection';
import {
  BulkUpsertScheduledEventsInput,
  NewScheduledEventInput,
} from '../resolvers/mutations/CreateScheduledEventMutation';

export default class ScheduledEventMutations {
  constructor(private scheduledEventDataSource: ScheduledEventDataSource) {}

  // TODO: validate input fields
  create(
    newScheduledEvent: NewScheduledEventInput
  ): Promise<ScheduledEvent | Rejection> {
    return this.scheduledEventDataSource
      .create(newScheduledEvent)
      .catch(error => {
        logger.logException('Could not create scheduled event', error, {
          newScheduledEvent,
        });

        return rejection('INTERNAL_ERROR');
      });
  }

  bulkUpsert(
    bulkUpsertScheduledEvents: BulkUpsertScheduledEventsInput
  ): Promise<ScheduledEvent[] | Rejection> {
    return this.scheduledEventDataSource
      .bulkUpsert(bulkUpsertScheduledEvents)
      .catch(error => {
        logger.logException('bulkUpsert failed', error, {
          bulkUpsertScheduledEvents,
        });

        return rejection('INTERNAL_ERROR');
      });
  }
}
