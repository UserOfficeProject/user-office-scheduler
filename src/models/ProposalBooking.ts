export enum ProposalBookingStatus {
  DRAFT = 'DRAFT',
  BOOKED = 'BOOKED',
  CLOSED = 'CLOSED',
}

export enum ProposalBookingFinalizeAction {
  CLOSE = 'CLOSE',
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
