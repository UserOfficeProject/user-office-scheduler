import PostgresLostTimeDataSource from './postgres/LostTimeDataSource';
import PostgresProposalBookingDataSource from './postgres/ProposalBookingDataSource';
import PostgreScheduledEventDataSource from './postgres/ScheduledEventDataSource';
import PostgreSystemDataSource from './postgres/SystemDataSource';

export const lostTimeDataSource = new PostgresLostTimeDataSource();
export const proposalBookingDataSource = new PostgresProposalBookingDataSource();
export const scheduledEventDataSource = new PostgreScheduledEventDataSource();
export const systemDataSource = new PostgreSystemDataSource();
