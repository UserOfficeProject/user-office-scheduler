import { logger } from '@esss-swap/duo-logger';
// import { bulkUpsertLostTimeValidationSchema } from '@esss-swap/duo-validation';

import { ResolverContext } from '../context';
import { LostTimeDataSource } from '../datasources/LostTimeDataSource';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import Authorized from '../decorators/Authorized';
// import ValidateArgs from '../decorators/ValidateArgs';
import { instrumentScientistHasAccess } from '../helpers/permissionHelpers';
import { LostTime } from '../models/LostTime';
import { rejection, Rejection } from '../rejection';
import {
  AddLostTimeInput,
  DeleteLostTimeInput,
  UpdateLostTimeInput,
} from '../resolvers/mutations/LostTimeMutation';
import { Roles } from '../types/shared';

export default class LostTimeMutations {
  constructor(
    private lostTimeDataSource: LostTimeDataSource,
    private proposalBookingDataSource: ProposalBookingDataSource
  ) {}

  // @ValidateArgs(bulkUpsertLostTimeValidationSchema)
  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async addLostTime(
    ctx: ResolverContext,
    addLostTimeInput: AddLostTimeInput
  ): Promise<LostTime | Rejection> {
    const proposalBooking = await this.proposalBookingDataSource.get(
      addLostTimeInput.proposalBookingId
    );

    if (!proposalBooking) {
      return rejection('NOT_FOUND');
    }

    if (!(await instrumentScientistHasAccess(ctx, proposalBooking))) {
      return rejection('NOT_ALLOWED');
    }

    return this.lostTimeDataSource
      .addLostTime(addLostTimeInput)
      .catch((error: Error) => {
        logger.logException('Adding lost time failed', error);

        return rejection('INTERNAL_ERROR');
      });
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async updateLostTime(
    ctx: ResolverContext,
    updateLostTimeInput: UpdateLostTimeInput
  ): Promise<LostTime | Rejection> {
    return this.lostTimeDataSource
      .updateLostTime(updateLostTimeInput)
      .catch((error: Error) => {
        logger.logException('Updating lost time failed', error);

        return rejection('INTERNAL_ERROR');
      });
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async deleteLostTime(
    ctx: ResolverContext,
    deleteLostTimeInput: DeleteLostTimeInput
  ): Promise<LostTime | Rejection> {
    return this.lostTimeDataSource
      .deleteLostTime(deleteLostTimeInput)
      .catch((error: Error) => {
        logger.logException('Deleting lost time failed', error);

        return rejection('INTERNAL_ERROR');
      });
  }
}
