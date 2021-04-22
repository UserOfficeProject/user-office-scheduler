import { ScheduledEvent, ScheduledEventBookingType } from './ScheduledEvent';

export class EquipmentScheduledEvent extends ScheduledEvent {
  constructor(
    public id: number,
    public createdAt: Date,
    public updatedAt: Date,
    public bookingType: ScheduledEventBookingType,
    public startsAt: Date,
    public endsAt: Date,
    public scheduledBy: { id: number },
    public description: string | null,
    public instrument: { id: number },
    public proposalBookingId: number | null,
    public equipmentId: number
  ) {
    super(
      id,
      createdAt,
      updatedAt,
      bookingType,
      startsAt,
      endsAt,
      scheduledBy,
      description,
      instrument,
      proposalBookingId
    );
  }
}
