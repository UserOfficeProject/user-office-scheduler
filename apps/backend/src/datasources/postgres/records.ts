import { ProposalBookingStatusCore } from '../../generated/sdk';
import {
  Equipment,
  EquipmentInstrument,
  EquipmentResponsible,
} from '../../models/Equipment';
import { LostTime } from '../../models/LostTime';
import { ProposalBooking } from '../../models/ProposalBooking';
import {
  ScheduledEvent,
  ScheduledEventBookingType,
} from '../../models/ScheduledEvent';

export type MetaFields = 'created_at' | 'updated_at';

export type PaginatedRecord<T> = T & { _total: number };

export interface ScheduledEventRecord {
  readonly scheduled_event_id: number;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly booking_type: ScheduledEventBookingType;
  readonly starts_at: Date;
  readonly ends_at: Date;
  readonly scheduled_by: number;
  readonly local_contact: number;
  readonly description: string | null;
  readonly proposal_booking_id: number | null;
  readonly status: ProposalBookingStatusCore;
  readonly instrument_id: number;
  readonly equipment_id: number;
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
    { id: scheduledEvent.instrument_id },
    scheduledEvent.proposal_booking_id,
    scheduledEvent.status,
    scheduledEvent.equipment_id,
    scheduledEvent.local_contact !== null // NOTE: because we can have 0 as local_contact
      ? { id: scheduledEvent.local_contact }
      : undefined // federation expect `{[@key field1]: $value, [@key field2]}` format
  );

export interface ProposalBookingRecord {
  readonly proposal_booking_id: number;
  readonly proposal_pk: number;
  readonly call_id: number;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly status: ProposalBookingStatusCore;
  readonly allocated_time: number;
  readonly instrument_id: number;
}

export const createProposalBookingObject = (
  proposalBooking: ProposalBookingRecord
) =>
  new ProposalBooking(
    proposalBooking.proposal_booking_id,
    { primaryKey: proposalBooking.proposal_pk },
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
  readonly scheduled_event_id: number;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly starts_at: Date;
  readonly ends_at: Date;
}

export const createLostTimeObject = (lostTime: LostTimeRecord) =>
  new LostTime(
    lostTime.lost_time_id,
    lostTime.proposal_booking_id,
    lostTime.scheduled_event_id,
    lostTime.created_at,
    lostTime.updated_at,
    lostTime.starts_at,
    lostTime.ends_at
  );

export interface EquipmentRecord {
  readonly equipment_id: number;
  readonly owner_id: number;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly name: string;
  readonly description: string;
  readonly color: string | null;
  readonly maintenance_starts_at: Date;
  readonly maintenance_ends_at: Date;
  readonly auto_accept: boolean;
}

export interface EquipmentResponsibleRecord {
  readonly equipment_responsible_id: number;
  readonly equipment_id: number;
  readonly user_id: number;
}

export interface EquipmentInstrumentRecord {
  readonly equipment_id: number;
  readonly instrument_id: number;
}

export const createEquipmentObject = (equipment: EquipmentRecord) =>
  new Equipment(
    equipment.equipment_id,
    { id: equipment.owner_id },
    equipment.created_at,
    equipment.updated_at,
    equipment.name,
    equipment.description,
    equipment.color,
    equipment.maintenance_starts_at,
    equipment.maintenance_ends_at,
    equipment.auto_accept
  );

export const createEquipmentResponsibleObject = (
  equipmentResponsible: EquipmentResponsibleRecord
) => new EquipmentResponsible(equipmentResponsible.user_id);

export const createEquipmentInstrumentObject = (
  equipmentInstrument: EquipmentInstrumentRecord
) => new EquipmentInstrument(equipmentInstrument.instrument_id);

export interface EquipmentsScheduledEventsRecord {
  readonly equipment_id: number;
  readonly scheduled_event_id: number;
  readonly status: string;
}
