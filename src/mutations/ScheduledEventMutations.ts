import { logger } from '@esss-swap/duo-logger';

import {
  ScheduledEventDataSource,
  ScheduledEventDataSourceError,
  ScheduledEventDataSourceErrorTypes,
} from '../datasources/ScheduledEventDataSource';
import { ScheduledEvent } from '../models/ScheduledEvent';
import { rejection, Rejection } from '../rejection';
import { NewScheduledEventInput } from '../resolvers/mutations/CreateScheduledEventMutation';

export default class ScheduledEventMutations {
  constructor(private scheduledEventDataSource: ScheduledEventDataSource) {}

  // TODO: validate input fields
  create(
    newScheduledEvent: NewScheduledEventInput
  ): Promise<ScheduledEvent | Rejection> {
    return this.scheduledEventDataSource
      .create(newScheduledEvent)
      .catch(error => {
        if (
          error instanceof ScheduledEventDataSourceError &&
          error.errorCode ===
            ScheduledEventDataSourceErrorTypes.SCHEDULED_EVENT_OVERLAP
        ) {
          return rejection(
            // TODO: add to validators
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ScheduledEventDataSourceErrorTypes.SCHEDULED_EVENT_OVERLAP as any
          );
        }

        logger.logException('Could not create scheduled event', error, {
          newScheduledEvent,
        });

        return rejection('INTERNAL_ERROR');
      });
  }
}
