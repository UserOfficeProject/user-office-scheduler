import { logger } from '@user-office-software/duo-logger';

import { ResolverContext } from '../context';
import { eventBus } from '../events';
import { ApplicationEvent } from '../events/applicationEvents';
import { Event } from '../generated/sdk';
import { isRejection } from '../models/Rejection';

const EventBusDecorator = (eventType: Event) => {
  return (_target: object, _name: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const ctx = args[0] as ResolverContext;

      let loggedInUser = ctx.user;

      const result = (await originalMethod?.apply(this, args)) as Record<
        string,
        unknown
      >;

      // NOTE: Get the name of the object or class like: 'SEP', 'USER', 'Proposal' and lowercase it.
      const resultKey = (
        result.constructor as { name: string }
      ).name.toLowerCase();

      // NOTE: This needs to be checked because there are mutations where we don't have loggedIn user. Example: ResetPasswordEmailMutation.
      if (!loggedInUser) {
        loggedInUser = (result as { user?: ResolverContext['user'] }).user;
      }

      const event = {
        type: eventType,
        [resultKey]: result,
        key: resultKey,
        loggedInUserId: loggedInUser ? loggedInUser.id : null,
        isRejection: isRejection(result),
      } as unknown as ApplicationEvent;

      // NOTE: Do not log the event in testing environment.
      if (process.env.NODE_ENV !== 'test') {
        eventBus
          .publish(event)
          .catch((e) =>
            logger.logError(`EventBus publish failed ${event.type}`, e)
          );
      }

      return result;
    };
  };
};

export default EventBusDecorator;
