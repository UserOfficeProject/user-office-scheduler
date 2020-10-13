import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import createMessageBrokerHandler from './messageBroker';

export default function createEventHandlers({
  proposalBookingDataSource,
}: {
  proposalBookingDataSource: ProposalBookingDataSource;
}) {
  return [createMessageBrokerHandler({ proposalBookingDataSource })];
}
