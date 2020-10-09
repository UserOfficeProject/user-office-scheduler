/* eslint-disable @typescript-eslint/camelcase */
import { LostTime } from '../../models/LostTime';
import { BulkUpsertLostTimesInput } from '../../resolvers/mutations/LostTimeMutation';
import { LostTimeDataSource } from '../LostTimeDataSource';
import database from './database';
import { createLostTimeObject, LostTimeRecord, MetaFields } from './records';

type BulkUpsertFields = Omit<LostTimeRecord, 'lost_time_id' | MetaFields>;

export default class PostgresLostTimeDataSource implements LostTimeDataSource {
  readonly tableName = 'lost_time';

  // technically we don't update anything
  // we only delete and (re)create
  bulkUpsert(
    bulkUpsertLostTimes: BulkUpsertLostTimesInput
  ): Promise<LostTime[]> {
    return database.transaction(async trx => {
      const { proposalBookingId, lostTimes } = bulkUpsertLostTimes;

      // delete existing related events
      await trx<Pick<LostTimeRecord, 'proposal_booking_id'>>(this.tableName)
        .where('proposal_booking_id', '=', proposalBookingId)
        .delete();

      // when the insert has empty array as param it
      // returns an object instead of an empty record array
      if (lostTimes.length === 0) {
        return [];
      }

      const newlyCreatedRecords = await trx<BulkUpsertFields>(this.tableName)
        .insert(
          lostTimes.map(newObj => ({
            proposal_booking_id: bulkUpsertLostTimes.proposalBookingId,
            starts_at: newObj.startsAt,
            ends_at: newObj.endsAt,
          }))
        )
        .returning<LostTimeRecord[]>(['*']);

      return newlyCreatedRecords.map(createLostTimeObject);
    });
  }

  async proposalBookingLostTimes(
    proposalBookingId: number
  ): Promise<LostTime[]> {
    const lostTimeRecords = await database<LostTimeRecord>(this.tableName)
      .select()
      .where('proposal_booking_id', '=', proposalBookingId);

    return lostTimeRecords.map(createLostTimeObject);
  }
}
