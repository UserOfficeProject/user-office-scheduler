import { System } from '../../models/System';

export interface SystemRecord {
  readonly message: string;
}

export const createSystemObject = (system: SystemRecord) =>
  new System(system.message);
