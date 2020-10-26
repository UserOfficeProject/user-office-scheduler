import { ResolverContext } from '../context';
import { ProposalBooking } from '../models/ProposalBooking';
import { rejection, Rejection } from '../rejection';
import { Roles } from '../types/shared';
import { hasRole } from '../utils/authorization';

export async function helperInstrumentScientistHasAccess(
  ctx: ResolverContext,
  proposalBookingSource: number | ProposalBooking
): Promise<void | Rejection> {
  let proposalBooking: ProposalBooking | null;

  if (proposalBookingSource instanceof ProposalBooking) {
    proposalBooking = proposalBookingSource;
  } else {
    proposalBooking = await ctx.queries.proposalBooking.get(
      ctx,
      proposalBookingSource
    );
  }

  if (!proposalBooking) {
    return rejection('NOT_FOUND');
  }

  if (!hasRole([Roles.USER_OFFICER], ctx.roles!)) {
    const {
      instrumentScientistHasAccess,
    } = await ctx.clients.userOffice().instrumentScientistHasAccess({
      proposalId: +proposalBooking.proposal.id,
      instrumentId: +proposalBooking.instrument.id,
    });

    if (!instrumentScientistHasAccess) {
      return rejection('NOT_FOUND');
    }
  }
}

export async function helperInstrumentScientistHasInstrument(
  ctx: ResolverContext,
  instrumentId: number
): Promise<void | Rejection> {
  if (!hasRole([Roles.USER_OFFICER], ctx.roles!)) {
    const {
      instrumentScientistHasInstrument,
    } = await ctx.clients.userOffice().instrumentScientistHasInstrument({
      instrumentId: +instrumentId,
    });

    if (!instrumentScientistHasInstrument) {
      return rejection('NOT_FOUND');
    }
  }
}
