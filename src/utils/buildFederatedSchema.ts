import { printSubgraphSchema, buildSubgraphSchema } from '@apollo/subgraph';
import { knownSubgraphDirectives } from '@apollo/subgraph/dist/directives';
import { addResolversToSchema, GraphQLResolverMap } from 'apollo-graphql';
import { specifiedDirectives } from 'graphql';
import gql from 'graphql-tag';
import {
  buildSchema,
  BuildSchemaOptions,
  createResolversMap,
} from 'type-graphql';

import { ResolverContext } from '../context';

// TODO: should be ported to a lerna as a separate package, so we can reuse it across the backend repositories
export async function buildFederatedSchema(
  options: Omit<BuildSchemaOptions, 'skipCheck'>,
  referenceResolvers?: GraphQLResolverMap<ResolverContext>
) {
  const schema = await buildSchema({
    ...options,
    directives: [
      ...specifiedDirectives,
      ...knownSubgraphDirectives,
      ...(options.directives || []),
    ],
    skipCheck: true,
    // we don't use `class-validator`, we have yup instead
    // we have to do this to disable `class-validator` warning
    validate: false,
  });

  const federatedSchema = buildSubgraphSchema({
    typeDefs: gql(printSubgraphSchema(schema)),
    resolvers: createResolversMap(
      schema
    ) as GraphQLResolverMap<ResolverContext>,
  });

  if (referenceResolvers) {
    addResolversToSchema(federatedSchema, referenceResolvers);
  }

  return federatedSchema;
}
