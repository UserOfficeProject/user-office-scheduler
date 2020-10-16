import { LostTime } from '../../models/LostTime';
import {
  ProposalBooking,
  ProposalBookingStatus,
} from '../../models/ProposalBooking';
import {
  ScheduledEvent,
  ScheduledEventBookingType,
} from '../../models/ScheduledEvent';

export type MetaFields = 'created_at' | 'updated_at';

export interface ScheduledEventRecord {
  readonly scheduled_event_id: number;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly booking_type: ScheduledEventBookingType;
  readonly starts_at: Date;
  readonly ends_at: Date;
  readonly scheduled_by: number;
  readonly description: string | null;
  readonly proposal_booking_id: number | null;
  readonly instrument_id: number;
}

export const createScheduledEventObject = (
  scheduledEvent: ScheduledEventRecord
) =>
  new ScheduledEvent(
    scheduledEvent.scheduled_event_id,
    scheduledEvent.created_at,
    scheduledEvent.updated_at,
    scheduledEvent.booking_type,
    scheduledEvent.starts_at,
    scheduledEvent.ends_at,
    { id: scheduledEvent.scheduled_by }, // federation expect `{[@key field1]: $value, [@key field2]}` format
    scheduledEvent.description,
    { id: scheduledEvent.instrument_id }
  );

export interface ProposalBookingRecord {
  readonly proposal_booking_id: number;
  readonly proposal_id: number;
  readonly call_id: number;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly status: ProposalBookingStatus;
  readonly allocated_time: number;
  readonly instrument_id: number;
}

export const createProposalBookingObject = (
  proposalBooking: ProposalBookingRecord
) =>
  new ProposalBooking(
    proposalBooking.proposal_booking_id,
    { id: proposalBooking.proposal_id },
    { id: proposalBooking.call_id },
    proposalBooking.created_at,
    proposalBooking.updated_at,
    proposalBooking.status,
    proposalBooking.allocated_time,
    { id: proposalBooking.instrument_id }
  );

export interface LostTimeRecord {
  readonly lost_time_id: number;
  readonly proposal_booking_id: number;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly starts_at: Date;
  readonly ends_at: Date;
}

export const createLostTimeObject = (lostTime: LostTimeRecord) =>
  new LostTime(
    lostTime.lost_time_id,
    lostTime.proposal_booking_id,
    lostTime.created_at,
    lostTime.updated_at,
    lostTime.starts_at,
    lostTime.ends_at
  );
