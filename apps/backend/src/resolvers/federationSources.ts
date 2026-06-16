import { GraphQLResolverMap } from '@apollo/subgraph/dist/schema-helper';

import { ResolverContext } from '../context';

export default function federationSources(): {
  orphanedTypes: Array<{ new (): object }>;
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
