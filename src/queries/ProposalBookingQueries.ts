import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import { ProposalBooking } from '../models/ProposalBooking';

export default class ProposalBookingQueries {
  constructor(private proposalBookingDataSource: ProposalBookingDataSource) {}

  instrumentProposalBookings(id: number): Promise<ProposalBooking[]> {
    return this.proposalBookingDataSource.instrumentProposalBookings(id);
  }
}
