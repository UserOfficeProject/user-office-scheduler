export enum ProposalBookingStatus {
  DRAFT = 'DRAFT',
}

export class ProposalBooking {
  constructor(
    public id: number,
    public proposal: { id: number },
    public call: { id: number },
    public createdAt: Date,
    public updatedAt: Date,
    public status: ProposalBookingStatus,
    public allocatedTime: number,
    public instrument: { id: number }
  ) {}
}
