import { SystemDataSource } from '../datasources/SystemDataSource';
import { System } from '../models/System';

export default class SystemQueries {
  constructor(private systemDataSource: SystemDataSource) {}

  async healthCheck(): Promise<System> {
    return this.systemDataSource.healthCheck();
  }
}
