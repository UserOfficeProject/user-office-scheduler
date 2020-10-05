import PostgresProposalBookingDataSource from './postgres/ProposalBookingDataSource';
import PostgreScheduledEventDataSource from './postgres/ScheduledEventDataSource';
import PostgreSystemDataSource from './postgres/SystemDataSource';

export const scheduledEventDataSource = new PostgreScheduledEventDataSource();
export const systemDataSource = new PostgreSystemDataSource();
export const proposalBookingDataSource = new PostgresProposalBookingDataSource();
