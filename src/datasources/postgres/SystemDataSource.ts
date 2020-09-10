// TODO: for testing only, remove later
import { randomBytes } from 'crypto';

import { System, DbStat } from '../../models/System';
import { SystemDataSource } from '../SystemDataSource';
import database from './database';
import { SystemRecord, createSystemObject } from './records';

export default class PostgreSystemDataSource implements SystemDataSource {
  // for testing
  async healthCheck(): Promise<System> {
    const dbStats: DbStat[] = await database('pg_stat_activity')
      .count('*', { as: 'total' })
      .select('state')
      .groupBy(2);

    const system: SystemRecord = {
      id: randomBytes(6).toString('hex'),
      message: 'Healthy',
      dbStats,
    };

    return createSystemObject(system);
  }
}
