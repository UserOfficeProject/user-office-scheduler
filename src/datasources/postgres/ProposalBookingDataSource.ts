/* eslint-disable @typescript-eslint/camelcase */
import {
  ProposalBooking,
  ProposalBookingFinalizeAction,
  ProposalBookingStatus,
} from '../../models/ProposalBooking';
import { ProposalProposalBookingFilter } from '../../resolvers/types/Proposal';
import { ProposalBookingDataSource } from '../ProposalBookingDataSource';
import database from './database';
import { createProposalBookingObject, ProposalBookingRecord } from './records';

type CreateFields = Pick<
  ProposalBookingRecord,
  'proposal_id' | 'call_id' | 'status' | 'allocated_time' | 'instrument_id'
>;

export default class PostgresProposalBookingDataSource
  implements ProposalBookingDataSource {
  readonly tableName = 'proposal_bookings';

  async upsert(event: {
    proposalId: number;
    callId: number;
    allocatedTime: number;
    instrumentId: number;
  }): Promise<void> {
    await database<CreateFields>(this.tableName)
      .insert({
        proposal_id: event.proposalId,
        call_id: event.callId,
        status: ProposalBookingStatus.DRAFT,
        allocated_time: event.allocatedTime,
        instrument_id: event.instrumentId,
      })
      .onConflict(['proposal_id', 'call_id'])
      .merge({
        allocated_time: event.allocatedTime,
        instrument_id: event.instrumentId,
      })
      .returning<ProposalBookingRecord>(['*']);
  }

  async get(id: number): Promise<ProposalBooking | null> {
    const proposalBooking = await database<ProposalBookingRecord>(
      this.tableName
    )
      .select()
      .where('proposal_booking_id', id)
      .first();

    return proposalBooking
      ? createProposalBookingObject(proposalBooking)
      : null;
  }

  async getByProposalId(
    proposalId: number,
    filter?: ProposalProposalBookingFilter
  ): Promise<ProposalBooking | null> {
    const proposalBooking = await database<ProposalBookingRecord>(
      this.tableName
    )
      .select()
      .where('proposal_id', proposalId)
      .modify(qb => {
        if (filter?.status) {
          qb.whereIn('status', filter.status);
        }
      })
      .first();

    return proposalBooking
      ? createProposalBookingObject(proposalBooking)
      : null;
  }

  async instrumentProposalBookings(
    instrumentId: number
  ): Promise<ProposalBooking[]> {
    const proposalBookings = await database<ProposalBookingRecord>(
      this.tableName
    )
      .select()
      .where('instrument_id', instrumentId)
      .orderBy('created_at', 'asc');

    return proposalBookings.map(createProposalBookingObject);
  }

  async finalize(
    action: ProposalBookingFinalizeAction,
    id: number
  ): Promise<ProposalBooking> {
    const [updatedRecord] = await database<ProposalBookingRecord>(
      this.tableName
    )
      .update(
        'status',
        action === ProposalBookingFinalizeAction.CLOSE
          ? ProposalBookingStatus.CLOSED
          : ProposalBookingStatus.DRAFT
      )
      .where('proposal_booking_id', id)
      .where('status', ProposalBookingStatus.BOOKED)
      .returning<ProposalBookingRecord[]>(['*']);

    if (!updatedRecord) {
      throw new Error(`Failed to finalize proposal booking '${id}'`);
    }

    return createProposalBookingObject(updatedRecord);
  }

  async activate(id: number): Promise<ProposalBooking> {
    const [updatedRecord] = await database<ProposalBookingRecord>(
      this.tableName
    )
      .update('status', ProposalBookingStatus.BOOKED)
      .where('proposal_booking_id', id)
      .where('status', ProposalBookingStatus.DRAFT)
      .returning<ProposalBookingRecord[]>(['*']);

    if (!updatedRecord) {
      throw new Error(`Failed to activate proposal booking '${id}'`);
    }

    return createProposalBookingObject(updatedRecord);
  }
}
