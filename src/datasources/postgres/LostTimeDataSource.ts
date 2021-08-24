import { LostTime } from '../../models/LostTime';
import { BulkUpsertLostTimesInput } from '../../resolvers/mutations/LostTimeMutation';
import { LostTimeDataSource } from '../LostTimeDataSource';
import database from './database';
import { createLostTimeObject, LostTimeRecord, MetaFields } from './records';

type BulkUpsertFields = Omit<LostTimeRecord, MetaFields>;

export default class PostgresLostTimeDataSource implements LostTimeDataSource {
  readonly tableName = 'lost_time';
  // eslint-disable-next-line quotes
  readonly nextId = database.raw("nextval('lost_time_lost_time_id_seq')");

  // technically we don't update anything
  // we only delete and (re)create
  bulkUpsert(
    bulkUpsertLostTimes: BulkUpsertLostTimesInput
  ): Promise<LostTime[]> {
    return database.transaction(async (trx) => {
      const { proposalBookingId, lostTimes } = bulkUpsertLostTimes;

      // delete existing events that weren't included in the upsert
      await trx<LostTimeRecord>(this.tableName)
        .where('proposal_booking_id', '=', proposalBookingId)
        .whereNotIn(
          'lost_time_id',
          lostTimes
            .filter(({ newlyCreated }) => !newlyCreated)
            .map(({ id }) => id)
        )
        .delete();

      // when the insert has empty array as param it
      // returns an object instead of an empty record array
      if (lostTimes.length === 0) {
        return [];
      }

      const newlyCreatedRecords = await trx<BulkUpsertFields>(this.tableName)
        .insert(
          lostTimes.map((newObj) => ({
            lost_time_id: newObj.newlyCreated ? this.nextId : newObj.id,
            proposal_booking_id: bulkUpsertLostTimes.proposalBookingId,
            scheduled_event_id: newObj.scheduledEventId,
            starts_at: newObj.startsAt,
            ends_at: newObj.endsAt,
          }))
        )
        .onConflict('lost_time_id')
        .merge()
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
