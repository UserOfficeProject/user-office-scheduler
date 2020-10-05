import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import { ApplicationEvent } from '../events/applicationEvents';
import { Event } from '../events/event.enum';
import { Queue, RabbitMQMessageBroker } from '../messageBroker';

export default function createHandler({
  proposalBookingDataSource,
}: {
  proposalBookingDataSource: ProposalBookingDataSource;
}) {
  const rabbitMQ = new RabbitMQMessageBroker();

  rabbitMQ.listenOn(Queue.PROPOSAL, async (type, message) => {
    switch (type) {
      case Event.PROPOSAL_NOTIFIED:
        await proposalBookingDataSource.create(message);

        return;
      default:
        console.warn('Unknown type');
    }
  });

  return async function messageBrokerHandler(event: ApplicationEvent) {
    switch (event.type) {
    }
  };
}
