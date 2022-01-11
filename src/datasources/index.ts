import PostgresEquipmentDataSource from './postgres/EquipmentDataSource';
import PostgresLostTimeDataSource from './postgres/LostTimeDataSource';
import PostgresProposalBookingDataSource from './postgres/ProposalBookingDataSource';
import PostgresScheduledEventDataSource from './postgres/ScheduledEventDataSource';
import PostgresSystemDataSource from './postgres/SystemDataSource';

export const equipmentDataSource = new PostgresEquipmentDataSource();
export const lostTimeDataSource = new PostgresLostTimeDataSource();
export const proposalBookingDataSource =
  new PostgresProposalBookingDataSource();
export const scheduledEventDataSource = new PostgresScheduledEventDataSource();
export const systemDataSource = new PostgresSystemDataSource();
