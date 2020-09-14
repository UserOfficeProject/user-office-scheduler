// TODO: for testing only, remove later
import { randomBytes } from 'crypto';

import { System } from '../../models/System';
import { SystemDataSource } from '../SystemDataSource';

export default class MockSystemDataSource implements SystemDataSource {
  async healthCheck(): Promise<System> {
    return new System(randomBytes(6).toString('hex'), 'Healthy!', [
      { total: 12, state: null },
      { total: 34, state: 'active' },
      { total: 56, state: 'idle' },
    ]);
  }
}
