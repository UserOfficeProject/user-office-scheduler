import { ProposalBookingStatusCore } from '../generated/sdk';

export enum ScheduledEventBookingType {
  USER_OPERATIONS = 'USER_OPERATIONS',
  MAINTENANCE = 'MAINTENANCE',
  SHUTDOWN = 'SHUTDOWN',
  EQUIPMENT = 'EQUIPMENT',
}

export type BookingTypes = typeof ScheduledEventBookingType;

export const CalendarExplicitBookableTypes: Record<
  keyof Pick<BookingTypes, 'SHUTDOWN' | 'MAINTENANCE' | 'USER_OPERATIONS'>,
  string
> = {
  MAINTENANCE: 'Maintenance',
  SHUTDOWN: 'Shutdown',
  USER_OPERATIONS: 'User operations',
};

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
    public instrument: { id: number },
    public proposalBookingId: number | null,
    public status: ProposalBookingStatusCore,
    public equipmentId: number,
    public localContact?: { id: number }
  ) {}
}

export class EquipmentsScheduledEvent {
  constructor(
    public equipmentId: number,
    public scheduledEventId: number,
    public status: string
  ) {}
}
