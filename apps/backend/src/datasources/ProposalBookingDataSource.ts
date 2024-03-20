import {
  ProposalBooking,
  ProposalBookingFinalizeAction,
} from '../models/ProposalBooking';
import { ProposalProposalBookingFilter } from '../resolvers/types/Proposal';
import { ProposalMessageData } from '../types/shared';

export interface ProposalBookingDataSource {
  // TODO(asztalos): validate input
  upsert(message: ProposalMessageData): Promise<void>;
  get(id: number): Promise<ProposalBooking | null>;
  delete(id: number): Promise<ProposalBooking | null>;
  getByProposalPk(
    proposalPk: number,
    filter?: ProposalProposalBookingFilter
  ): Promise<ProposalBooking | null>;
  instrumentProposalBookings(
    instrumentIds: number[],
    callId?: number
  ): Promise<ProposalBooking[]>;
  finalize(
    action: ProposalBookingFinalizeAction,
    id: number
  ): Promise<ProposalBooking>;
  activate(id: number): Promise<ProposalBooking>;
  reopen(id: number): Promise<ProposalBooking>;
}
