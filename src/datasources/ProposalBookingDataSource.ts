import { ProposalBooking } from '../models/ProposalBooking';

export enum ProposalBookingDataSourceErrorTypes {
  SCHEDULED_EVENT_OVERLAP = 'SCHEDULED_EVENT_OVERLAP',
}

export class ProposalBookingDataSourceError {
  constructor(public readonly errorCode: ProposalBookingDataSourceErrorTypes) {}
}

export interface ProposalBookingDataSource {
  create(event: any): Promise<void>;

  instrumentProposalBookings(id: number): Promise<ProposalBooking[]>;
}
