import { ResolverContext } from '../context';
import { ProposalBooking } from '../models/ProposalBooking';
import { Roles } from '../types/shared';
import { hasRole } from '../utils/authorization';

export async function instrumentScientistHasAccess(
  ctx: ResolverContext,
  proposalBookingSource: number | ProposalBooking
): Promise<boolean> {
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
    return false;
  }

  if (hasRole([Roles.USER_OFFICER], ctx.roles!)) {
    return true;
  }

  if (!hasRole([Roles.INSTRUMENT_SCIENTIST], ctx.roles!)) {
    return false;
  }

  const { instrumentScientistHasAccess } = await ctx.clients
    .userOffice()
    .instrumentScientistHasAccess({
      proposalPK: +proposalBooking.proposal.id,
      instrumentId: +proposalBooking.instrument.id,
    });

  if (!instrumentScientistHasAccess) {
    return false;
  }

  return true;
}

export async function userHacAccess(
  ctx: ResolverContext,
  proposalBookingSource: number | ProposalBooking
) {
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
    return false;
  }

  if (hasRole([Roles.USER_OFFICER], ctx.roles!)) {
    return true;
  }

  if (!hasRole([Roles.USER], ctx.roles!)) {
    return false;
  }

  const { userHasAccessToProposal } = await ctx.clients
    .userOffice()
    .userHasAccess({
      proposalPK: +proposalBooking.proposal.id,
    });

  if (!userHasAccessToProposal) {
    return false;
  }

  return true;
}

export function isUserOfficer(agent: ResolverContext | null) {
  if (agent == null) {
    return false;
  }

  return agent?.currentRole?.shortCode === Roles.USER_OFFICER;
}
