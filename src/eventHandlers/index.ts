import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import {
  createListenToRabbitMQHandler,
  createPostToRabbitMQHandler,
} from './messageBroker';

export default function createEventHandlers({
  proposalBookingDataSource,
}: {
  proposalBookingDataSource: ProposalBookingDataSource;
}) {
  return [
    createListenToRabbitMQHandler({ proposalBookingDataSource }),
    createPostToRabbitMQHandler({ proposalBookingDataSource }),
  ];
}
