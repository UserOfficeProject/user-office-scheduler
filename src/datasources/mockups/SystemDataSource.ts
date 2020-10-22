import { SystemDataSource, HealthStats } from '../SystemDataSource';

export default class MockSystemDataSource implements SystemDataSource {
  async healthCheck(): Promise<HealthStats> {
    return {
      message: 'Healthy!',
      dbStats: [
        { total: 12, state: null },
        { total: 34, state: 'active' },
        { total: 56, state: 'idle' },
      ],
    };
  }
}
