import { LostTimeDataSource } from '../datasources/LostTimeDataSource';
import { LostTime } from '../models/LostTime';

export default class LostTimeQueries {
  constructor(private lostTimeDataSource: LostTimeDataSource) {}

  proposalBookingLostTimes(proposalBookingId: number): Promise<LostTime[]> {
    return this.lostTimeDataSource.proposalBookingLostTimes(proposalBookingId);
  }
}
