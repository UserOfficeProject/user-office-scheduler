import {
  createListenToRabbitMQHandler,
  createPostToRabbitMQHandler,
} from './messageBroker';
import { EquipmentDataSource } from '../datasources/EquipmentDataSource';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';

export default function createEventHandlers({
  proposalBookingDataSource,
  equipmentDataSource,
}: {
  proposalBookingDataSource: ProposalBookingDataSource;
  equipmentDataSource: EquipmentDataSource;
}) {
  return [
    createListenToRabbitMQHandler({
      proposalBookingDataSource,
      equipmentDataSource,
    }),
    createPostToRabbitMQHandler({ proposalBookingDataSource }),
  ];
}
