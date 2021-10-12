import { ProposalBookingStatusCore } from '../../generated/sdk';
import {
  ProposalBooking,
  ProposalBookingFinalizeAction,
} from '../../models/ProposalBooking';
import { ProposalProposalBookingFilter } from '../../resolvers/types/Proposal';
import { ProposalBookingDataSource } from '../ProposalBookingDataSource';
import database from './database';
import { createProposalBookingObject, ProposalBookingRecord } from './records';

type CreateFields = Pick<
  ProposalBookingRecord,
  'proposal_pk' | 'call_id' | 'status' | 'allocated_time' | 'instrument_id'
>;

export default class PostgresProposalBookingDataSource
  implements ProposalBookingDataSource
{
  readonly tableName = 'proposal_bookings';

  async upsert(event: {
    proposalPk: number;
    callId: number;
    allocatedTime: number;
    instrumentId: number;
  }): Promise<void> {
    await database<CreateFields>(this.tableName)
      .insert({
        proposal_pk: event.proposalPk,
        call_id: event.callId,
        status: ProposalBookingStatusCore.DRAFT,
        allocated_time: event.allocatedTime,
        instrument_id: event.instrumentId,
      })
      .onConflict(['proposal_pk', 'call_id'])
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

  async getByProposalPk(
    proposalPk: number,
    filter?: ProposalProposalBookingFilter
  ): Promise<ProposalBooking | null> {
    const proposalBooking = await database<ProposalBookingRecord>(
      this.tableName
    )
      .select()
      .where('proposal_pk', proposalPk)
      .modify((qb) => {
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
    instrumentIds: number[]
  ): Promise<ProposalBooking[]> {
    const proposalBookings = await database<ProposalBookingRecord>(
      this.tableName
    )
      .select()
      .whereIn('instrument_id', instrumentIds)
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
        action === ProposalBookingFinalizeAction.COMPLETE
          ? ProposalBookingStatusCore.COMPLETED
          : ProposalBookingStatusCore.DRAFT
      )
      .where('proposal_booking_id', id)
      .whereIn('status', [
        ProposalBookingStatusCore.ACTIVE,
        ProposalBookingStatusCore.DRAFT,
      ])
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
      .update('status', ProposalBookingStatusCore.ACTIVE)
      .where('proposal_booking_id', id)
      .where('status', ProposalBookingStatusCore.DRAFT)
      .returning<ProposalBookingRecord[]>(['*']);

    if (!updatedRecord) {
      throw new Error(`Failed to activate proposal booking '${id}'`);
    }

    return createProposalBookingObject(updatedRecord);
  }
}
