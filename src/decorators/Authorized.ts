/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLError } from 'graphql';

import { ResolverContext } from '../context';
import { Roles } from '../types/shared';
import { hasRole } from '../utils/authorization';

const Authorized = (roles: Roles[] = []) => {
  return (
    target: any,
    name: string,
    descriptor: {
      value?: (ctx: ResolverContext, ...args: any[]) => Promise<any>;
    }
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      const [ctx] = args;

      if (!ctx.user || !ctx.roles) {
        throw new GraphQLError('UNAUTHENTICATED', {
          extensions: {
            code: 'UNAUTHENTICATED',
            value: 'Not authenticated',
          },
        });
      }

      const hasAccessRights = hasRole(roles, ctx.roles);

      if (hasAccessRights) {
        return await originalMethod?.apply(this, args);
      } else {
        throw new GraphQLError('INSUFFICIENT_PERMISSIONS', {
          extensions: {
            code: 'INSUFFICIENT_PERMISSIONS',
            value: 'Insufficient',
          },
        });
      }
    };
  };
};

export default Authorized;
