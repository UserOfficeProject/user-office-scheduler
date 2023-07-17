import database from './database';
import { createLostTimeObject, LostTimeRecord } from './records';
import { LostTime } from '../../models/LostTime';
import {
  AddLostTimeInput,
  DeleteLostTimeInput,
  UpdateLostTimeInput,
} from '../../resolvers/mutations/LostTimeMutation';
import { LostTimeDataSource } from '../LostTimeDataSource';

export default class PostgresLostTimeDataSource implements LostTimeDataSource {
  readonly tableName = 'lost_time';
  // eslint-disable-next-line quotes
  readonly nextId = database.raw("nextval('lost_time_lost_time_id_seq')");

  // technically we don't update anything
  // we only delete and (re)create
  async addLostTime(addLostTimeInput: AddLostTimeInput): Promise<LostTime> {
    const { proposalBookingId, lostTime } = addLostTimeInput;

    const [newlyCreatedRecord] = await database(this.tableName)
      .insert({
        proposal_booking_id: proposalBookingId,
        scheduled_event_id: lostTime.scheduledEventId,
        starts_at: lostTime.startsAt,
        ends_at: lostTime.endsAt,
      })
      .returning<LostTimeRecord[]>(['*']);

    return createLostTimeObject(newlyCreatedRecord);
  }

  async updateLostTime(
    updateLostTimeInput: UpdateLostTimeInput
  ): Promise<LostTime> {
    const { id, endsAt, startsAt } = updateLostTimeInput;

    const [updatedRecord] = await database(this.tableName)
      .update({
        starts_at: startsAt,
        ends_at: endsAt,
      })
      .where('lost_time_id', id)
      .returning<LostTimeRecord[]>(['*']);

    return createLostTimeObject(updatedRecord);
  }

  async deleteLostTime(
    deleteLostTimeInput: DeleteLostTimeInput
  ): Promise<LostTime> {
    const { id } = deleteLostTimeInput;

    const [deletedRecord] = await database(this.tableName)
      .where('lost_time_id', id)
      .delete()
      .returning<LostTimeRecord[]>(['*']);

    return createLostTimeObject(deletedRecord);
  }

  async proposalBookingLostTimes(
    proposalBookingId: number,
    scheduledEventId?: number
  ): Promise<LostTime[]> {
    const lostTimeRecords = await database<LostTimeRecord>(this.tableName)
      .select()
      .where('proposal_booking_id', '=', proposalBookingId)
      .modify((query) => {
        if (scheduledEventId) {
          query.andWhere('scheduled_event_id', '=', scheduledEventId);
        }
      });

    return lostTimeRecords.map(createLostTimeObject);
  }
}
