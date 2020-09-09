import { SystemDataSource } from '../SystemDataSource';
import { SystemRecord, createSystemObject } from './records';

export default class PostgreSystemDataSource implements SystemDataSource {
  async healthCheck() {
    const system: SystemRecord = { message: 'Healthy' };

    return createSystemObject(system);
  }
}
