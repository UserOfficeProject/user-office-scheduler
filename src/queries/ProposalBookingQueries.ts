import { ResolverContext } from '../context';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import Authorized from '../decorators/Authorized';
import { instrumentScientistHasInstrument } from '../helpers/instrumentHelpers';
import {
  instrumentScientistHasAccess,
  userHacAccess,
} from '../helpers/permissionHelpers';
import {
  ProposalBooking,
  ProposalBookingStatus,
} from '../models/ProposalBooking';
import { ProposalProposalBookingFilter } from '../resolvers/types/Proposal';
import { Roles } from '../types/shared';
import { hasRole } from '../utils/authorization';

export default class ProposalBookingQueries {
  constructor(private proposalBookingDataSource: ProposalBookingDataSource) {}

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async instrumentProposalBookings(
    ctx: ResolverContext,
    instrumentId: number
  ): Promise<ProposalBooking[]> {
    if (!(await instrumentScientistHasInstrument(ctx, instrumentId))) {
      return [];
    }

    return this.proposalBookingDataSource.instrumentProposalBookings(
      instrumentId
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
      !(await userHacAccess(ctx, proposalBooking))
    ) {
      return null;
    }

    return proposalBooking;
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST, Roles.USER])
  async getByProposalId(
    ctx: ResolverContext,
    proposalId: number,
    filter?: ProposalProposalBookingFilter
  ): Promise<ProposalBooking | null> {
    // don't show proposal bookings is draft state for users
    if (
      !hasRole([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST], ctx.roles!)
    ) {
      filter = {
        status: [ProposalBookingStatus.BOOKED, ProposalBookingStatus.CLOSED],
      };
    }

    const proposalBooking = await this.proposalBookingDataSource.getByProposalId(
      proposalId,
      filter
    );

    if (!proposalBooking) {
      return null;
    }

    if (
      !(await instrumentScientistHasAccess(ctx, proposalBooking)) &&
      !(await userHacAccess(ctx, proposalBooking))
    ) {
      return null;
    }

    return proposalBooking;
  }
}
