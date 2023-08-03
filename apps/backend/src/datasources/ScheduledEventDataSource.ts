import { ProposalBookingFinalizeAction } from '../models/ProposalBooking';
import { ScheduledEvent } from '../models/ScheduledEvent';
import {
  DeleteScheduledEventsInput,
  NewScheduledEventInput,
  UpdateScheduledEventInput,
} from '../resolvers/mutations/ScheduledEventMutation';
import { ScheduledEventFilter } from '../resolvers/queries/ScheduledEventQuery';
import { ProposalBookingScheduledEventFilter } from '../resolvers/types/ProposalBooking';

export interface ScheduledEventDataSource {
  create(
    scheduledById: number,
    newScheduledEvent: NewScheduledEventInput
  ): Promise<ScheduledEvent>;
  update(
    updateScheduledEvent: UpdateScheduledEventInput
  ): Promise<ScheduledEvent>;
  activate(id: number): Promise<ScheduledEvent>;
  reopen(id: number): Promise<ScheduledEvent>;
  finalize(
    id: number,
    action: ProposalBookingFinalizeAction
  ): Promise<ScheduledEvent>;
  delete(
    deleteScheduledEvent: DeleteScheduledEventsInput
  ): Promise<ScheduledEvent[]>;
  get(id: number): Promise<ScheduledEvent | null>;
  getAll(filter: ScheduledEventFilter): Promise<ScheduledEvent[]>;
  proposalBookingScheduledEvents(
    proposalBookingId: number,
    filter?: ProposalBookingScheduledEventFilter
  ): Promise<ScheduledEvent[]>;
  proposalBookingScheduledEvent(
    proposalBookingId: number,
    scheduledEventId: number
  ): Promise<ScheduledEvent | null>;
  equipmentScheduledEvents(
    equipmentIds: number[],
    startsAt: Date,
    endsAt: Date,
    userId?: number | null
  ): Promise<ScheduledEvent[]>;
}
