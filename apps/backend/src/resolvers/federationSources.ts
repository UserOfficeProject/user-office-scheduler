/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLResolverMap } from '@apollo/subgraph/dist/schema-helper';

import { ResolverContext } from '../context';

export default function federationSources(): {
  orphanedTypes: Array<{ new (): any }>;
  referenceResolvers: GraphQLResolverMap<ResolverContext>;
} {
  return {
    orphanedTypes: [],
    referenceResolvers: {
      // Example:
      // ScheduledEvent: { __resolveReference: resolveScheduledEventReference },
    },
  };
}
