import { ResolverContext } from '../context';
import { Instrument } from '../generated/sdk';
import { Roles } from '../types/shared';
import { hasRole } from '../utils/authorization';

export async function instrumentScientistHasInstrument(
  ctx: ResolverContext,
  instrumentId: number
): Promise<boolean> {
  if (!hasRole([Roles.USER_OFFICER], ctx.roles!)) {
    const { instrumentScientistHasInstrument } = await ctx.clients
      .userOffice()
      .instrumentScientistHasInstrument({
        instrumentId: +instrumentId,
      });

    if (!instrumentScientistHasInstrument) {
      return false;
    }
  }

  return true;
}

export async function getUserInstruments(
  ctx: ResolverContext
): Promise<Pick<Instrument, 'id'>[]> {
  const { userInstruments } = await ctx.clients.userOffice().userInstruments();

  if (!userInstruments?.instruments) {
    return [];
  }

  return userInstruments.instruments;
}
