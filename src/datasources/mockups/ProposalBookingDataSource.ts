import {
  ProposalBooking,
  ProposalBookingFinalizeAction,
} from '../../models/ProposalBooking';
import { ProposalBookingDataSource } from '../ProposalBookingDataSource';

export default class MockupProposalBookingDataSource
  implements ProposalBookingDataSource
{
  getByProposalPK(
    proposalPK: number,
    filter?:
      | import('../../resolvers/types/Proposal').ProposalProposalBookingFilter
      | undefined
  ): Promise<ProposalBooking | null> {
    throw new Error('Method not implemented.');
  }
  upsert(event: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  get(id: number): Promise<ProposalBooking | null> {
    throw new Error('Method not implemented.');
  }
  instrumentProposalBookings(instrumentId: number): Promise<ProposalBooking[]> {
    throw new Error('Method not implemented.');
  }
  finalize(
    action: ProposalBookingFinalizeAction,
    id: number
  ): Promise<ProposalBooking> {
    throw new Error('Method not implemented.');
  }
  activate(id: number): Promise<ProposalBooking> {
    throw new Error('Method not implemented.');
  }
}
