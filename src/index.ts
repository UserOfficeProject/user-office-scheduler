import { logger } from '@esss-swap/duo-logger';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';
import express from 'express';

// import authorization from './middlewares/authorization';
import exceptionHandler from './middlewares/exceptionHandler';
import apolloServer from './middlewares/graphql';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = express();

  app
    .use(cookieParser())
    // .use(authorization())
    .use(exceptionHandler());

  await apolloServer(app);

  process.on('uncaughtException', error => {
    logger.logException('Unhandled NODE exception', error);
  });

  app.listen(PORT, () => {
    console.info(`Running a GraphQL API server at http://localhost:${PORT}/`);
  });
}

bootstrap();
