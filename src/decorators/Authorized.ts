/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthenticationError, ApolloError } from 'apollo-server';

import { ResolverContext } from '../context';
import { rejection } from '../rejection';
import { Roles } from '../types/shared';
import { hasRole } from '../utils/authorization';

const Authorized = (roles: Roles[] = []) => {
  return (
    target: any,
    name: string,
    descriptor: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value?: (ctx: ResolverContext, ...args: any[]) => Promise<any>;
    }
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      const [ctx] = args;
      const isMutation = target.constructor.name.includes('Mutation');

      console.log(ctx);

      if ((ctx?.user as any).isApiAccessToken) {
        if (
          (ctx?.user as any).accessPermissions?.[
            `${target.constructor.name}.${name}`
          ]
        ) {
          return await originalMethod?.apply(this, args);
        } else {
          return isMutation ? rejection('INSUFFICIENT_PERMISSIONS') : null;
        }
      }

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
