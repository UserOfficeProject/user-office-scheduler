import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import { ProposalBooking } from '../models/ProposalBooking';

export default class ProposalBookingQueries {
  constructor(private proposalBookingDataSource: ProposalBookingDataSource) {}

  instrumentProposalBookings(instrumentId: number): Promise<ProposalBooking[]> {
    return this.proposalBookingDataSource.instrumentProposalBookings(
      instrumentId
    );
  }

  get(id: number): Promise<ProposalBooking | null> {
    return this.proposalBookingDataSource.get(id);
  }
}
