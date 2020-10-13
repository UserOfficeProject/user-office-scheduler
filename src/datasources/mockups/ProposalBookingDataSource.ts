import {
  ProposalBooking,
  ProposalBookingFinalizeAction,
} from '../../models/ProposalBooking';
import { ProposalBookingDataSource } from '../ProposalBookingDataSource';

export default class MockupProposalBookingDataSource
  implements ProposalBookingDataSource {
  create(event: any): Promise<void> {
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
