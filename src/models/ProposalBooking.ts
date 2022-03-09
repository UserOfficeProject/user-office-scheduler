import { ProposalBookingStatusCore } from '../generated/sdk';

export enum ProposalBookingFinalizeAction {
  COMPLETE = 'COMPLETE',
  RESTART = 'RESTART',
}

export class ProposalBooking {
  constructor(
    public id: number,
    public proposal: { primaryKey: number },
    public call: { id: number },
    public createdAt: Date,
    public updatedAt: Date,
    public status: ProposalBookingStatusCore,
    public allocatedTime: number,
    public instrument: { id: number }
  ) {}
}
