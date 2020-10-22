import { SystemDataSource } from '../datasources/SystemDataSource';
import { HealthStats } from '../resolvers/queries/SystemQuery';

export default class SystemQueries {
  constructor(private systemDataSource: SystemDataSource) {}

  async healthCheck(): Promise<HealthStats> {
    return this.systemDataSource.healthCheck();
  }
}
