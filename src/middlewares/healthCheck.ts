import { logger } from '@esss-swap/duo-logger';
import express, { Request, Response } from 'express';

import baseContext from '../buildContext';

const router = express.Router();

router.get('/health-check', (req: Request, res: Response) => {
  baseContext.queries.system
    .healthCheck()
    .then(({ message }) => {
      message !== 'Healthy' ? res.status(500) : res.status(200);
      res.end();
    })
    .catch((e) => {
      logger.logException('Health check failed', e);
      res.status(500).end();
    });
});

export default function () {
  return router;
}
