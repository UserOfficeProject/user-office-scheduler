import { Proposal, Event } from '../generated/sdk';
import { ScheduledEvent } from '../models/ScheduledEvent';

interface GeneralEvent {
  type: Event;
  key: string;
  loggedInUserId: number | null;
  isRejection: boolean;
}

interface ProposalStatusChangedByWorkflowEvent extends GeneralEvent {
  type: Event.PROPOSAL_STATUS_CHANGED_BY_WORKFLOW;
  proposal: Proposal;
}

interface ProposalStatusChangedByUserEvent extends GeneralEvent {
  type: Event.PROPOSAL_STATUS_CHANGED_BY_USER;
  proposal: Proposal;
}

interface ProposalBookingTimeSlotAddedEvent extends GeneralEvent {
  type: Event.PROPOSAL_BOOKING_TIME_SLOT_ADDED;
  scheduledevent: ScheduledEvent;
}

interface ProposalBookingTimeSlotsRemovedEvent extends GeneralEvent {
  type: Event.PROPOSAL_BOOKING_TIME_SLOTS_REMOVED;
  scheduledevents: ScheduledEvent[];
}

interface ProposalBookingTimeSlotActivatedEvent extends GeneralEvent {
  type: Event.PROPOSAL_BOOKING_TIME_ACTIVATED;
  scheduledevent: ScheduledEvent;
}

interface ProposalBookingTimeSlotCompletedEvent extends GeneralEvent {
  type: Event.PROPOSAL_BOOKING_TIME_COMPLETED;
  scheduledevent: ScheduledEvent;
}

interface ProposalBookingTimeSlotUpdatedEvent extends GeneralEvent {
  type: Event.PROPOSAL_BOOKING_TIME_UPDATED;
  scheduledevent: ScheduledEvent;
}

interface ProposalBookingTimeSlotReopenEvent extends GeneralEvent {
  type: Event.PROPOSAL_BOOKING_TIME_REOPENED;
  scheduledevent: ScheduledEvent;
}

export type ApplicationEvent =
  | ProposalStatusChangedByWorkflowEvent
  | ProposalStatusChangedByUserEvent
  | ProposalBookingTimeSlotAddedEvent
  | ProposalBookingTimeSlotsRemovedEvent
  | ProposalBookingTimeSlotActivatedEvent
  | ProposalBookingTimeSlotCompletedEvent
  | ProposalBookingTimeSlotReopenEvent
  | ProposalBookingTimeSlotUpdatedEvent;
