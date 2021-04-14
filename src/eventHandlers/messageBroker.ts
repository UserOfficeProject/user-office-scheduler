import { logger } from '@esss-swap/duo-logger';
import { Queue, RabbitMQMessageBroker } from '@esss-swap/duo-message-broker';

import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import { ApplicationEvent } from '../events/applicationEvents';
import { Event } from '../generated/sdk';

export default function createHandler({
  proposalBookingDataSource,
}: {
  proposalBookingDataSource: ProposalBookingDataSource;
}) {
  if (process.env.UO_FEATURE_DISABLE_MESSAGE_BROKER === '1') {
    return async () => {
      // no op
    };
  }

  const rabbitMQ = new RabbitMQMessageBroker();

  // don't try to initialize during testing
  // causes infinite loop
  if (process.env.NODE_ENV !== 'test') {
    rabbitMQ.setup({
      hostname: process.env.RABBITMQ_HOSTNAME,
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
    });
  }

  rabbitMQ.listenOn(Queue.PROPOSAL, async (type, message) => {
    switch (type) {
      case Event.PROPOSAL_STATUS_CHANGED_BY_WORKFLOW:
      case Event.PROPOSAL_STATUS_CHANGED_BY_USER:
        logger.logDebug(`Listener on ${Queue.PROPOSAL}: Received event`, {
          type,
          message,
        });
        await proposalBookingDataSource.upsert(message);

        return;
      default:
        // captured and logged by duo-message-broker
        // message forwarded to dead-letter queue (DL__PROPOSALS)
        throw 'Received unknown event';
    }
  });

  return async function messageBrokerHandler(event: ApplicationEvent) {
    switch (event.type) {
    }
  };
}
