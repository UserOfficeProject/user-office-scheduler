export enum ProposalBookingStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

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
    public status: ProposalBookingStatus,
    public allocatedTime: number,
    public instrument: { id: number }
  ) {}
}
