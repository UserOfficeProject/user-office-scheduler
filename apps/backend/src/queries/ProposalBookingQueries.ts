import { ResolverContext } from '../context';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import Authorized from '../decorators/Authorized';
import { ProposalBookingStatusCore } from '../generated/sdk';
import { instrumentScientistHasInstrument } from '../helpers/instrumentHelpers';
import {
  instrumentScientistHasAccess,
  isApiToken,
  userHacAccess,
} from '../helpers/permissionHelpers';
import { ProposalBooking } from '../models/ProposalBooking';
import { ProposalProposalBookingFilter } from '../resolvers/types/Proposal';
import { Roles } from '../types/shared';
import { hasRole } from '../utils/authorization';

export default class ProposalBookingQueries {
  constructor(private proposalBookingDataSource: ProposalBookingDataSource) {}

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async instrumentProposalBookings(
    ctx: ResolverContext,
    instrumentIds: number[]
  ): Promise<ProposalBooking[]> {
    const results = await Promise.all(
      instrumentIds.map(
        async (instrumentId) =>
          (await instrumentScientistHasInstrument(ctx, instrumentId)) ||
          isApiToken(ctx)
      )
    );

    const newInstrumentIdsByRole = instrumentIds.filter(
      (_item, index) => results[index]
    );

    return this.proposalBookingDataSource.instrumentProposalBookings(
      newInstrumentIdsByRole
    );
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST, Roles.USER])
  async get(ctx: ResolverContext, id: number): Promise<ProposalBooking | null> {
    const proposalBooking = await this.proposalBookingDataSource.get(id);

    if (!proposalBooking) {
      return null;
    }

    if (
      !(await instrumentScientistHasAccess(ctx, proposalBooking)) &&
      !(await userHacAccess(ctx, proposalBooking)) &&
      !isApiToken(ctx)
    ) {
      return null;
    }

    return proposalBooking;
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST, Roles.USER])
  async getByProposalPk(
    ctx: ResolverContext,
    proposalPk: number,
    filter?: ProposalProposalBookingFilter
  ): Promise<ProposalBooking | null> {
    // don't show proposal bookings is draft state for users
    if (!hasRole([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST], ctx.roles)) {
      filter = {
        status: [
          ProposalBookingStatusCore.ACTIVE,
          ProposalBookingStatusCore.COMPLETED,
        ],
      };
    }

    const proposalBooking =
      await this.proposalBookingDataSource.getByProposalPk(proposalPk, filter);

    if (!proposalBooking) {
      return null;
    }

    if (
      !(await instrumentScientistHasAccess(ctx, proposalBooking)) &&
      !(await userHacAccess(ctx, proposalBooking)) &&
      !isApiToken(ctx)
    ) {
      return null;
    }

    return proposalBooking;
  }
}
