import { LostTime } from '../models/LostTime';
import { BulkUpsertLostTimesInput } from '../resolvers/mutations/LostTimeMutation';

export interface LostTimeDataSource {
  bulkUpsert(
    bulkUpsertLostTimes: BulkUpsertLostTimesInput
  ): Promise<LostTime[]>;
  proposalBookingLostTimes(
    proposalBookingId: number,
    scheduledEventId?: number
  ): Promise<LostTime[]>;
}
