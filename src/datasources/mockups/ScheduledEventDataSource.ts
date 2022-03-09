/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ProposalBookingStatusCore } from '../../generated/sdk';
import { ProposalBookingFinalizeAction } from '../../models/ProposalBooking';
import {
  ScheduledEvent,
  ScheduledEventBookingType,
} from '../../models/ScheduledEvent';
import {
  DeleteScheduledEventsInput,
  NewScheduledEventInput,
  UpdateScheduledEventInput,
} from '../../resolvers/mutations/ScheduledEventMutation';
import { ScheduledEventFilter } from '../../resolvers/queries/ScheduledEventQuery';
import { ScheduledEventDataSource } from '../ScheduledEventDataSource';

export const dummyScheduledEvents: ScheduledEvent[] = [
  new ScheduledEvent(
    123,
    new Date(),
    new Date(),
    ScheduledEventBookingType.MAINTENANCE,
    new Date(),
    new Date(),
    { id: 0 },
    null,
    { id: 0 },
    1,
    ProposalBookingStatusCore.DRAFT,
    0
  ),
  new ScheduledEvent(
    321,
    new Date(),
    new Date(),
    ScheduledEventBookingType.SHUTDOWN,
    new Date(),
    new Date(),
    { id: 0 },
    'dummy',
    { id: 0 },
    2,
    ProposalBookingStatusCore.DRAFT,
    0
  ),
];

export default class MockupScheduledEventDataSource
  implements ScheduledEventDataSource
{
  async create(
    scheduledById: number,
    newScheduledEvent: NewScheduledEventInput
  ): Promise<ScheduledEvent> {
    return new ScheduledEvent(
      100,
      new Date(),
      new Date(),
      newScheduledEvent.bookingType,
      newScheduledEvent.startsAt,
      newScheduledEvent.endsAt,
      { id: scheduledById },
      newScheduledEvent.description,
      { id: newScheduledEvent.instrumentId },
      1,
      ProposalBookingStatusCore.DRAFT,
      0
    );
  }

  async update(
    updateScheduledEvent: UpdateScheduledEventInput
  ): Promise<ScheduledEvent> {
    throw new Error('Method not implemented.');
  }

  async activate(id: number): Promise<ScheduledEvent> {
    throw new Error('Method not implemented.');
  }
  async reopen(id: number): Promise<ScheduledEvent> {
    throw new Error('Method not implemented.');
  }

  async finalize(
    id: number,
    action: ProposalBookingFinalizeAction
  ): Promise<ScheduledEvent> {
    throw new Error('Method not implemented.');
  }

  async delete(
    deleteScheduledEvents: DeleteScheduledEventsInput
  ): Promise<ScheduledEvent[]> {
    return dummyScheduledEvents;
  }

  async get(id: number): Promise<ScheduledEvent | null> {
    return dummyScheduledEvents.find((se) => se.id === id) ?? null;
  }

  async getAll(filter?: ScheduledEventFilter): Promise<ScheduledEvent[]> {
    return dummyScheduledEvents;
  }

  proposalBookingScheduledEvents(
    proposalBookingId: number
  ): Promise<ScheduledEvent[]> {
    throw new Error('Method not implemented.');
  }

  proposalBookingScheduledEvent(
    proposalBookingId: number,
    scheduledEventId: number
  ): Promise<ScheduledEvent | null> {
    throw new Error('Method not implemented.');
  }
  equipmentScheduledEvents(
    equipmentIds: number[],
    startsAt: Date,
    endsAt: Date
  ): Promise<ScheduledEvent[]> {
    throw new Error('Method not implemented.');
  }
}
