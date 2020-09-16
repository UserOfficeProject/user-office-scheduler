import {
  ScheduledEvent,
  ScheduledEventBookingType,
} from '../../models/ScheduledEvent';
import { System, DbStat } from '../../models/System';

export interface SystemRecord {
  readonly id: string;
  readonly message: string;
  readonly dbStats: DbStat[];
}

export const createSystemObject = (system: SystemRecord) =>
  new System(system.id, system.message, system.dbStats);

export interface ScheduledEventRecord {
  readonly scheduled_event_id: number;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly booking_type: ScheduledEventBookingType;
  readonly scheduled_from: Date;
  readonly ends_at: Date;
  readonly scheduled_by: number;
  readonly description: string;
}

export const createScheduledEventObject = (
  scheduledEvent: ScheduledEventRecord
) =>
  new ScheduledEvent(
    scheduledEvent.scheduled_event_id,
    scheduledEvent.created_at,
    scheduledEvent.updated_at,
    scheduledEvent.booking_type,
    scheduledEvent.scheduled_from,
    scheduledEvent.ends_at,
    { id: scheduledEvent.scheduled_by }, // federation expect `{[@key field1]: $value, [@key field2]}` format
    scheduledEvent.description
  );
