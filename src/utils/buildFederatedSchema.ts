import {
  printSchema,
  buildFederatedSchema as buildApolloFederationSchema,
} from '@apollo/federation';
import federationDirectives from '@apollo/federation/dist/directives';
import { addResolversToSchema, GraphQLResolverMap } from 'apollo-graphql';
import { specifiedDirectives } from 'graphql';
import gql from 'graphql-tag';
import {
  buildSchema,
  BuildSchemaOptions,
  createResolversMap,
} from 'type-graphql';

// TODO: should be ported to a lerna as a separate package, so we can reuse it across the backends
export async function buildFederatedSchema<TContext extends {} = {}>(
  options: Omit<BuildSchemaOptions, 'skipCheck'>,
  referenceResolvers?: GraphQLResolverMap<TContext> // this should be `GraphQLReferenceResolver` but the types not match
) {
  const schema = await buildSchema({
    ...options,
    directives: [
      ...specifiedDirectives,
      ...federationDirectives,
      ...(options.directives || []),
    ],
    skipCheck: true,
    // we don't use `class-validator`, we have yup instead
    // we have to do this to disable `class-validator` warning
    validate: false,
  });

  const federatedSchema = buildApolloFederationSchema({
    typeDefs: gql(printSchema(schema)),
    // FIXME: see if we can remove the any cast
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolvers: createResolversMap(schema) as any,
  });

  if (referenceResolvers) {
    addResolversToSchema(federatedSchema, referenceResolvers);
  }

  return federatedSchema;
}
