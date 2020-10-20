import fs from 'fs';

import { logger } from '@esss-swap/duo-logger';
import Knex from 'knex';

const db = Knex({
  client: 'postgresql',
  connection: {
    host: process.env.DATABASE_HOSTNAME,
    port: +(process.env.DATABASE_PORT as string) || 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    timezone: 'UTC',
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
db.on('query-error', function(error: any, obj: any) {
  logger.logError('QUERY ERROR', { error, obj });
});

if (process.env.DATABASE_LOG_QUERIES === '1') {
  db.on('query', function({ sql }) {
    // TODO: add timestamp to logger (maybe only ConsoleLogger needs it)
    logger.logDebug(`${new Date().toISOString()} - QUERY`, sql);
  });
}

export default db;

let initDbFailed = 0;

function initDb() {
  db('pg_stat_activity')
    .count('*', { as: 'total' })
    .select('state')
    .groupBy(2)
    .then(async () => {
      const log = [`Upgrade started: ${Date.now()}`];
      const directoryPath = './db_patches';
      fs.readdir(directoryPath, async function(err, files) {
        if (err) {
          logger.logError(err.message, err);
          log.push(err.message);

          return false;
        }

        for await (const file of files) {
          // ignore everything other than sql files
          if (!/\.sql$/i.test(file)) {
            continue;
          }

          const contents = fs.readFileSync(`${directoryPath}/${file}`, 'utf8');
          await db
            .raw(contents)
            .then(result => {
              const msg = `${file} executed. ${result.command || ''}\n`;
              log.push(msg);
            })
            .catch(err => {
              const msg = `${file} failed. ${err}`;
              log.push(msg);

              throw log;
            });
        }

        logger.logInfo('Db initialization is done', { log });
      });
    })
    .catch(e => {
      initDbFailed++;

      logger.logError('Failed to initialize db', e);

      if (initDbFailed >= 2) {
        process.exit(1);
      }

      setTimeout(initDb, 1500);
    });
}

setTimeout(initDb, 1500);
