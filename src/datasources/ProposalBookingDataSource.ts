import {
  ProposalBooking,
  ProposalBookingFinalizeAction,
} from '../models/ProposalBooking';
import { ProposalProposalBookingFilter } from '../resolvers/types/Proposal';

export interface ProposalBookingDataSource {
  // TODO(asztalos): validate input
  upsert(event: any): Promise<void>;
  get(id: number): Promise<ProposalBooking | null>;
  getByProposalPk(
    proposalPk: number,
    filter?: ProposalProposalBookingFilter
  ): Promise<ProposalBooking | null>;
  instrumentProposalBookings(instrumentId: number): Promise<ProposalBooking[]>;
  finalize(
    action: ProposalBookingFinalizeAction,
    id: number
  ): Promise<ProposalBooking>;
  activate(id: number): Promise<ProposalBooking>;
}
