export enum ScheduledEventBookingType {
  USER_OPERATIONS = 'USER_OPERATIONS',
  MAINTENANCE = 'MAINTENANCE',
  SHUTDOWN = 'SHUTDOWN',
  COMMISSIONING = 'COMMISSIONING',
}

export class ScheduledEvent {
  constructor(
    public id: number,
    public createdAt: Date,
    public updatedAt: Date,
    public bookingType: ScheduledEventBookingType,
    public startsAt: Date,
    public endsAt: Date,
    public scheduledBy: { id: number },
    public description: string | null,
    public instrument: { id: number }
  ) {}
}
