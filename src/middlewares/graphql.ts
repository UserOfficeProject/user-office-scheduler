import { ApolloServer } from 'apollo-server-express';
import { Express, Request as ExpressRequest } from 'express';

import 'reflect-metadata';
import baseContext from '../buildContext';
import { ResolverContext } from '../context';
import federationSources from '../resolvers/federationSources';
import { registerEnums } from '../resolvers/registerEnums';
import { buildFederatedSchema } from '../utils/buildFederatedSchema';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Request extends ExpressRequest {}

const PATH = '/graphql';

const apolloServer = async (app: Express) => {
  registerEnums();

  const { orphanedTypes, referenceResolvers } = federationSources();

  const schema = await buildFederatedSchema(
    {
      resolvers: [
        __dirname + '/../resolvers/**/*Query.{ts,js}',
        __dirname + '/../resolvers/**/*Mutation.{ts,js}',
        __dirname + '/../resolvers/**/*Resolver.{ts,js}',
      ],
      orphanedTypes: [...orphanedTypes],
    },
    {
      ...referenceResolvers,
    }
  );

  const server = new ApolloServer({
    schema,
    tracing: false,
    playground: {
      settings: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore-line igore until https://github.com/prisma-labs/graphql-playground/pull/1212 is merged
        'schema.polling.enable': false,
      },
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: async ({ req }: { req: Request }) => {
      // let user = null;
      // const userId = req.user?.user?.id as number;

      // if (req.user) {
      //   user = {
      //     ...(await baseContext.queries.user.getAgent(userId)),
      //     currentRole:
      //       req.user.currentRole || (req.user.roles ? req.user.roles[0] : null),
      //   } as UserWithRole;
      // }

      const context: ResolverContext = { ...baseContext /*, user*/ };

      return context;
    },
  });
  server.applyMiddleware({ app: app, path: PATH });
};

export default apolloServer;
