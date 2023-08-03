export class LostTime {
  constructor(
    public id: number,
    public proposalBookingId: number,
    public scheduledEventId: number,
    public createdAt: Date,
    public updatedAt: Date,
    public startsAt: Date,
    public endsAt: Date
  ) {}
}
