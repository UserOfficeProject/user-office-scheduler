import { LostTime } from '../models/LostTime';
import {
  AddLostTimeInput,
  UpdateLostTimeInput,
  DeleteLostTimeInput,
} from '../resolvers/mutations/LostTimeMutation';

export interface LostTimeDataSource {
  addLostTime(addLostTimeInput: AddLostTimeInput): Promise<LostTime>;
  updateLostTime(updateLostTimeInput: UpdateLostTimeInput): Promise<LostTime>;
  deleteLostTime(deleteLostTimeInput: DeleteLostTimeInput): Promise<LostTime>;
  proposalBookingLostTimes(
    proposalBookingId: number,
    scheduledEventId?: number
  ): Promise<LostTime[]>;
}
