import { System, DbStat } from '../../models/System';

export interface SystemRecord {
  readonly id: string;
  readonly message: string;
  readonly dbStats: DbStat[];
}

export const createSystemObject = (system: SystemRecord) =>
  new System(system.id, system.message, system.dbStats);
