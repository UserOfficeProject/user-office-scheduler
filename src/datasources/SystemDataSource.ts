import { System } from '../models/System';

export interface SystemDataSource {
  healthCheck(): Promise<System>;
}
