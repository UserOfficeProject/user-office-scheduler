import { BaseContext, ApolloServer, ContextFunction } from '@apollo/server';
import {
  ExpressContextFunctionArgument,
  expressMiddleware,
} from '@apollo/server/express4';
import {
  ApolloServerPluginInlineTraceDisabled,
  ApolloServerPluginLandingPageDisabled,
} from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { logger } from '@user-office-software/duo-logger';
import { json } from 'body-parser';
import cors from 'cors';
import { Express } from 'express';
import 'reflect-metadata';
import jsonwebtoken from 'jsonwebtoken';

import baseContext from '../buildContext';
import { ResolverContext } from '../context';
import { AuthJwtApiTokenPayload, AuthJwtPayload } from '../generated/sdk';
import initGraphQLClient from '../graphql/client';
import federationSources from '../resolvers/federationSources';
import { registerEnums } from '../resolvers/registerEnums';
import { UserWithAccessPermissions } from '../types/shared';
import { buildFederatedSchema } from '../utils/buildFederatedSchema';

export const PATH = '/graphql';

const context: ContextFunction<
  [ExpressContextFunctionArgument],
  BaseContext
> = async ({ req }) => {
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
          } as UserWithAccessPermissions;

          context.user = user;
        } else {
          context.user = authJwtPayload?.user;
          context.roles = authJwtPayload?.roles;
          context.currentRole = authJwtPayload?.currentRole;
        }
      }
    } catch (error) {
      logger.logException('Context creation error', error);

      throw error;
    }
  }

  return context;
};

const apolloServer = async (app: Express) => {
  registerEnums();

  const { orphanedTypes, referenceResolvers } = federationSources();

  // NOTE: glob package that is used in type-graphql for resolvers pattern is expecting only forward slashes.(https://www.npmjs.com/package/glob#:~:text=Please%20only%20use%20forward%2Dslashes%20in%20glob%20expressions.)
  const fixedPath = __dirname.split('\\').join('/');

  const schema = await buildFederatedSchema(
    {
      resolvers: [
        fixedPath + '/../resolvers/**/*Query.{ts,js}',
        fixedPath + '/../resolvers/**/*Mutation.{ts,js}',
      ],
      orphanedTypes: [...orphanedTypes],
      // we don't use `class-validator`, we have yup instead
      // we have to do this to disable `class-validator` warning
      validate: false,
    },
    {
      ...referenceResolvers,
    }
  );

  const plugins = [
    ApolloServerPluginInlineTraceDisabled(),
    // Explicitly disable playground in prod
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageLocalDefault({
          footer: false,
          embed: { initialState: { pollForSchemaUpdates: false } },
        }),
  ];

  const server = new ApolloServer({
    schema,
    plugins,
    formatError: (formattedError, error) => {
      const env = process.env.NODE_ENV;

      // TODO: Refactor the error handling to follow core-backend: https://github.com/UserOfficeProject/user-office-core/pull/133

      return formattedError;
    },
  });

  await server.start();

  app.use(
    PATH,
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context,
    })
  );
};

export default apolloServer;
