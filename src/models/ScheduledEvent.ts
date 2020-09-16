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
    public scheduledFrom: Date, // TODO
    public endsAt: Date, // TODO
    public scheduledBy: { id: number }, // todo
    public description: string | null
  ) {}
}
