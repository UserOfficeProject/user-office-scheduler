/* eslint-disable @typescript-eslint/camelcase */
import {
  ProposalBooking,
  ProposalBookingStatus,
} from '../../models/ProposalBooking';
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

  async create(event: {
    proposalId: number;
    callId: number;
    allocatedTime: number;
    instrumentId: number;
  }): Promise<void> {
    try {
      await database<CreateFields>(this.tableName)
        .insert({
          proposal_id: event.proposalId,
          call_id: event.callId,
          status: ProposalBookingStatus.DRAFT,
          allocated_time: event.allocatedTime,
          instrument_id: event.instrumentId,
        })
        .returning<ProposalBookingRecord>(['*']);
    } catch (e) {
      // ignore duplicate entry error
      if ('code' in e && e.code === '23505') {
        return;
      }

      throw e;
    }
  }

  async instrumentProposalBookings(id: number): Promise<ProposalBooking[]> {
    const proposalBookings = await database<ProposalBookingRecord>(
      this.tableName
    )
      .select()
      .where('instrument_id', '=', id)
      .orderBy('created_at', 'asc');

    return proposalBookings.map(createProposalBookingObject);
  }
}
