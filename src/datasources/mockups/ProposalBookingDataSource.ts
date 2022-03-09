import {
  ProposalBooking,
  ProposalBookingFinalizeAction,
} from '../../models/ProposalBooking';
import { ProposalBookingDataSource } from '../ProposalBookingDataSource';

export default class MockupProposalBookingDataSource
  implements ProposalBookingDataSource
{
  getByProposalPk(
    proposalPk: number,
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
  delete(proposalPk: number): Promise<ProposalBooking | null> {
    throw new Error('Method not implemented.');
  }
  instrumentProposalBookings(
    instrumentIds: number[]
  ): Promise<ProposalBooking[]> {
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
  reopen(id: number): Promise<ProposalBooking> {
    throw new Error('Method not implemented.');
  }
}
