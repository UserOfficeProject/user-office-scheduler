import { logger } from '@user-office-software/duo-logger';
import {
  ApolloServerPluginInlineTraceDisabled,
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { Express, Request as ExpressRequest } from 'express';
import 'reflect-metadata';
import jsonwebtoken from 'jsonwebtoken';

import baseContext from '../buildContext';
import { ResolverContext } from '../context';
import initGraphQLClient from '../graphql/client';
import federationSources from '../resolvers/federationSources';
import { registerEnums } from '../resolvers/registerEnums';
import { AuthJwtPayload, AuthJwtApiTokenPayload } from '../types/shared';
import { buildFederatedSchema } from '../utils/buildFederatedSchema';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Request extends ExpressRequest {}

export const PATH = '/graphql';

const apolloServer = async (app: Express) => {
  registerEnums();

  const { orphanedTypes, referenceResolvers } = federationSources();

  const schema = await buildFederatedSchema(
    {
      resolvers: [
        __dirname + '/../resolvers/**/*Query.{ts,js}',
        __dirname + '/../resolvers/**/*Mutation.{ts,js}',
      ],
      orphanedTypes: [...orphanedTypes],
    },
    {
      ...referenceResolvers,
    }
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginInlineTraceDisabled(),
      // Explicitly disable playground in prod
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground({
            settings: { 'schema.polling.enable': false },
          }),
    ],

    context: async ({ req }: { req: Request }) => {
      const context: ResolverContext = {
        ...baseContext,
        clients: { userOffice: initGraphQLClient(req.headers.authorization) },
      };
      const { authorization } = req.headers;

      if (authorization) {
        try {
          const token = authorization.split(' ')[1];

          if (!token) {
            throw new Error('Invalid token!');
          }

          const authJwtPayload = jsonwebtoken.decode(token) as
            | AuthJwtPayload
            | AuthJwtApiTokenPayload;

          if (authJwtPayload) {
            if (authJwtPayload && 'accessTokenId' in authJwtPayload) {
              const { accessTokenAndPermissions } = await context.clients
                .userOffice()
                .getAccessTokenAndPermissions({
                  accessTokenId: authJwtPayload.accessTokenId,
                });

              const user = {
                accessPermissions: accessTokenAndPermissions?.accessPermissions
                  ? JSON.parse(accessTokenAndPermissions.accessPermissions)
                  : null,
                isApiAccessToken: true,
              } as any;

              context.user = user;
            } else {
              context.user = authJwtPayload?.user;
              context.roles = authJwtPayload?.roles;
              context.currentRole = authJwtPayload?.currentRole;
            }
          }
        } catch (error) {
          logger.logException('failed to decode token', error);
          throw error;
        }
      }

      return context;
    },
  });

  await server.start();

  server.applyMiddleware({ app: app, path: PATH });
};

export default apolloServer;
