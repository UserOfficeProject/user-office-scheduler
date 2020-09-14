/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLResolverMap } from 'apollo-graphql';

import { ResolverContext } from '../context';
import { System, resolveSystemReference } from './types/System';

export default function federationSources(): {
  orphanedTypes: Array<{ new (): any }>;
  referenceResolvers: GraphQLResolverMap<ResolverContext>;
} {
  return {
    orphanedTypes: [System],
    referenceResolvers: {
      System: { __resolveReference: resolveSystemReference },
    },
  };
}
