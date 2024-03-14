import { logger } from '@user-office-software/duo-logger';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';
import express from 'express';

// register event handlers
import './env-loader.js';
import './events';

import { configureGraylogLogger } from './config/configureGrayLogLogger';
import exceptionHandler from './middlewares/exceptionHandler';
import apolloServer, { PATH } from './middlewares/graphql';
import healthCheck from './middlewares/healthCheck';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = express();

  app.use(cookieParser()).use(exceptionHandler()).use(healthCheck());

  await apolloServer(app);

  process.on('uncaughtException', (error) => {
    logger.logException('Unhandled NODE exception', error);
  });

  app.listen(PORT, () => {
    logger.logInfo(
      `Running a GraphQL API server at http://localhost:${PORT}${PATH}`,
      {}
    );
  });

  configureGraylogLogger();
}

bootstrap();
