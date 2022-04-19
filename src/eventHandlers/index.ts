import { EquipmentDataSource } from '../datasources/EquipmentDataSource';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import {
  createListenToRabbitMQHandler,
  createPostToRabbitMQHandler,
} from './messageBroker';

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
