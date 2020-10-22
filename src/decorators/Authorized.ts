import { AuthenticationError, ApolloError } from 'apollo-server';

import { ResolverContext } from '../context';
import { Role } from '../types/shared';
import { hasRole } from '../utils/authorization';

const Authorized = (roles: Role[] = []) => {
  return (
    target: object,
    name: string,
    descriptor: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value?: (ctx: ResolverContext, ...args: any[]) => Promise<any>;
    }
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args) {
      const [ctx] = args;

      if (!ctx.user || !ctx.roles) {
        throw new AuthenticationError('Not authenticated');
      }

      const hasAccessRights = hasRole(roles, ctx.roles);

      if (hasAccessRights) {
        return await originalMethod?.apply(this, args);
      } else {
        throw new ApolloError(
          'Insufficient permissions',
          'INSUFFICIENT_PERMISSIONS'
        );
      }
    };
  };
};

export default Authorized;
