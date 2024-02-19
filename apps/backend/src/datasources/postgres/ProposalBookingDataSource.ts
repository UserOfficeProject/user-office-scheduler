import database from './database';
import { createProposalBookingObject, ProposalBookingRecord } from './records';
import { ProposalBookingStatusCore } from '../../generated/sdk';
import {
  ProposalBooking,
  ProposalBookingFinalizeAction,
} from '../../models/ProposalBooking';
import { ProposalProposalBookingFilter } from '../../resolvers/types/Proposal';
import { ProposalBookingDataSource } from '../ProposalBookingDataSource';

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
    instruments: { id: number; shortCode: string; allocatedTime: number }[];
  }): Promise<void> {
    if (event.instruments.length) {
      await Promise.all(
        event.instruments.map(
          (instrument) =>
            instrument.allocatedTime &&
            database<CreateFields>(this.tableName)
              .insert({
                proposal_pk: event.proposalPk,
                call_id: event.callId,
                status: ProposalBookingStatusCore.DRAFT,
                allocated_time: instrument.allocatedTime,
                instrument_id: instrument.id,
              })
              .onConflict(['proposal_pk', 'call_id', 'instrument_id'])
              .merge({
                allocated_time: instrument.allocatedTime,
                instrument_id: instrument.id,
              })
              .returning<ProposalBookingRecord>(['*'])
        )
      );
    }
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

  async delete(proposalPk: number): Promise<ProposalBooking | null> {
    const [proposalBooking] = await database(this.tableName)
      .where('proposal_pk', proposalPk)
      .delete()
      .returning<ProposalBookingRecord[]>(['*']);

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
    instrumentIds: number[],
    callId?: number
  ): Promise<ProposalBooking[]> {
    const proposalBookings = await database<ProposalBookingRecord>(
      this.tableName
    )
      .select()
      .whereIn('instrument_id', instrumentIds)
      .modify((query) => {
        if (callId) {
          query.andWhere('call_id', callId);
        }
      })
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
      .returning<ProposalBookingRecord[]>(['*']);

    if (!updatedRecord) {
      throw new Error(`Failed to activate proposal booking '${id}'`);
    }

    return createProposalBookingObject(updatedRecord);
  }

  async reopen(id: number): Promise<ProposalBooking> {
    const [updatedRecord] = await database<ProposalBookingRecord>(
      this.tableName
    )
      .update('status', ProposalBookingStatusCore.ACTIVE)
      .where('proposal_booking_id', id)
      .where('status', ProposalBookingStatusCore.COMPLETED)
      .returning<ProposalBookingRecord[]>(['*']);

    if (!updatedRecord) {
      throw new Error(`Failed to re-open proposal booking '${id}'`);
    }

    return createProposalBookingObject(updatedRecord);
  }
}
