import { logger } from '@esss-swap/duo-logger';

import { SystemDataSource, HealthStats, DbStat } from '../SystemDataSource';
import database from './database';

export default class PostgreSystemDataSource implements SystemDataSource {
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
}
