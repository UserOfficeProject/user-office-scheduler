import { ResolverContext } from '../context';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import Authorized from '../decorators/Authorized';
import {
  helperInstrumentScientistHasInstrument,
  helperInstrumentScientistHasAccess,
} from '../helpers/instrumentHelpers';
import { ProposalBooking } from '../models/ProposalBooking';
import { Roles } from '../types/shared';

export default class ProposalBookingQueries {
  constructor(private proposalBookingDataSource: ProposalBookingDataSource) {}

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async instrumentProposalBookings(
    ctx: ResolverContext,
    instrumentId: number
  ): Promise<ProposalBooking[]> {
    await helperInstrumentScientistHasInstrument(ctx, instrumentId);

    return this.proposalBookingDataSource.instrumentProposalBookings(
      instrumentId
    );
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async get(ctx: ResolverContext, id: number): Promise<ProposalBooking | null> {
    const proposalBooking = await this.proposalBookingDataSource.get(id);

    if (!proposalBooking) {
      return null;
    }

    await helperInstrumentScientistHasAccess(ctx, proposalBooking);

    return proposalBooking;
  }
}
