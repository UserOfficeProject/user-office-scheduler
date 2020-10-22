import { ResolverContext } from '../context';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import Authorized from '../decorators/Authorized';
import { ProposalBooking } from '../models/ProposalBooking';

export default class ProposalBookingQueries {
  constructor(private proposalBookingDataSource: ProposalBookingDataSource) {}

  @Authorized([])
  instrumentProposalBookings(
    ctx: ResolverContext,
    instrumentId: number
  ): Promise<ProposalBooking[]> {
    return this.proposalBookingDataSource.instrumentProposalBookings(
      instrumentId
    );
  }

  @Authorized([])
  get(ctx: ResolverContext, id: number): Promise<ProposalBooking | null> {
    return this.proposalBookingDataSource.get(id);
  }
}
