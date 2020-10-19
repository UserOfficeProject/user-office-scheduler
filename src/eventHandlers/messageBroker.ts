import { Queue, RabbitMQMessageBroker } from '@esss-swap/duo-message-broker';

import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import { ApplicationEvent } from '../events/applicationEvents';
import { Event } from '../events/event.enum';

export default function createHandler({
  proposalBookingDataSource,
}: {
  proposalBookingDataSource: ProposalBookingDataSource;
}) {
  const rabbitMQ = new RabbitMQMessageBroker();

  // don't try to initialize during testing
  // causes infinite loop
  if (process.env.NODE_ENV !== 'test') {
    rabbitMQ.setup();
  }

  rabbitMQ.listenOn(Queue.PROPOSAL, async (type, message) => {
    switch (type) {
      case Event.PROPOSAL_NOTIFIED:
        await proposalBookingDataSource.create(message);

        return;
      default:
        console.warn('Listener', Queue.PROPOSAL, 'Unknown type', {
          type,
          message,
        });
    }
  });

  return async function messageBrokerHandler(event: ApplicationEvent) {
    switch (event.type) {
    }
  };
}
