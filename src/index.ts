// import this first, so environment variables are loaded
import 'dotenv/config';

import { logger } from '@esss-swap/duo-logger';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';
import express from 'express';

// register event handlers
import './events';

import exceptionHandler from './middlewares/exceptionHandler';
import apolloServer, { PATH } from './middlewares/graphql';
import healthCheck from './middlewares/healthCheck';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = express();

  app.use(cookieParser()).use(exceptionHandler());

  app.use('/health-check', healthCheck());

  await apolloServer(app);

  process.on('uncaughtException', error => {
    logger.logException('Unhandled NODE exception', error);
  });

  app.listen(PORT, () => {
    console.info(
      `Running a GraphQL API server at http://localhost:${PORT}${PATH}`
    );
  });
}

bootstrap();
