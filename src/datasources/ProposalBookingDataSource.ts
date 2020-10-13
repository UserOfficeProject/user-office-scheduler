import {
  ProposalBooking,
  ProposalBookingFinalizeAction,
} from '../models/ProposalBooking';

export interface ProposalBookingDataSource {
  // TODO
  create(event: any): Promise<void>;
  get(id: number): Promise<ProposalBooking | null>;
  instrumentProposalBookings(instrumentId: number): Promise<ProposalBooking[]>;
  finalize(
    action: ProposalBookingFinalizeAction,
    id: number
  ): Promise<ProposalBooking>;
  activate(id: number): Promise<ProposalBooking>;
}
