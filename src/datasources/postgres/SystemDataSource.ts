import { promises as fs } from 'fs';
import path from 'path';

import { logger } from '@esss-swap/duo-logger';

import { SystemDataSource, HealthStats, DbStat } from '../SystemDataSource';
import database from './database';

const dbPatchesFolderPath = path.join(process.cwd(), 'db_patches');
const seedsPath = path.join(dbPatchesFolderPath, 'db_seeds');

export default class PostgreSystemDataSource implements SystemDataSource {
  constructor() {
    if (
      process.env.NODE_ENV === 'test' || // don't run db init while running unit tests
      process.env.SKIP_DB_INIT === '1' // don't run db init in e2e tests
    ) {
      logger.logInfo('Skipping db initialization', {
        NODE_ENV: process.env.NODE_ENV,
        SKIP_DB_INIT: process.env.SKIP_DB_INIT,
      });

      return;
    }

    this.initDb();
  }

  async healthCheck(): Promise<HealthStats> {
    try {
      const dbStats: DbStat[] = await database('pg_stat_activity')
        .count('*', { as: 'total' })
        .select('state')
        .groupBy(2);

      return {
        message: 'Healthy',
        dbStats,
      };
    } catch (error) {
      logger.logException('healthCheck failed', error);

      return {
        message: 'Unhealthy (╯°□°）╯︵ ┻━┻',
        dbStats: [],
      };
    }
  }

  async resetDB(includeSeeds: boolean) {
    try {
      await database.raw(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO "${process.env.DATABASE_USER}";
      GRANT ALL ON SCHEMA public TO public;
    `);

      await this.applyPatches();

      if (process.env.INCLUDE_SEEDS === '1' || includeSeeds) {
        await this.applySeeds();
      }
    } catch (e) {
      logger.logException('resetDB failed', e);

      throw e;
    }
  }

  private async applyPatches() {
    logger.logInfo('Applying patches started', { timestamp: new Date() });

    const log: string[] = [];

    const files = await fs.readdir(dbPatchesFolderPath);

    for (const file of files) {
      // ignore everything other than sql files
      if (!/\.sql$/i.test(file)) {
        continue;
      }

      const contents = await fs.readFile(
        path.join(dbPatchesFolderPath, file),
        'utf8'
      );
      await database
        .raw(contents)
        .then(() => {
          const msg = `${file} executed.`;
          log.push(msg);
        })
        .catch((err) => {
          const msg = `${file} failed: ${err}`;
          log.push(msg);

          throw log.join('\n');
        });
    }

    logger.logInfo('Applying patches finished', {});
  }

  private async applySeeds() {
    logger.logInfo('Applying seeds started', { timestamp: new Date() });

    const log: string[] = [];

    const files = await fs.readdir(seedsPath);

    for (const file of files) {
      // ignore everything other than sql files
      if (!/\.sql$/i.test(file)) {
        continue;
      }

      const contents = await fs.readFile(path.join(seedsPath, file), 'utf8');
      await database
        .raw(contents)
        .then(() => {
          const msg = `${file} executed.`;
          log.push(msg);
        })
        .catch((err) => {
          const msg = `${file} failed. ${err}`;
          log.push(msg);

          throw log;
        });
    }

    logger.logInfo('Applying seeds finished', {});
  }

  private async initDb() {
    let initDbFailed = 0;

    const initDb = () => {
      database('pg_stat_activity')
        .count('*', { as: 'total' })
        .select('state')
        .groupBy(2)
        .then(() => this.applyPatches())
        .catch((e) => {
          initDbFailed++;

          logger.logException('Failed to initialize db', e, { initDbFailed });

          if (initDbFailed >= 5) {
            process.exit(1);
          }

          setTimeout(initDb, 1000);
        });
    };

    setTimeout(initDb, 500);
  }
}
