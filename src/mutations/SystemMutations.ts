import { logger } from '@user-office-software/duo-logger';

import { ResolverContext } from '../context';
import { SystemDataSource } from '../datasources/SystemDataSource';
import Authorized from '../decorators/Authorized';
import { Roles } from '../types/shared';

export default class SystemMutations {
  constructor(private systemDataSource: SystemDataSource) {}

  @Authorized([Roles.USER_OFFICER])
  async resetDb(ctx: ResolverContext, includeSeeds: boolean): Promise<string> {
    if (process.env.NODE_ENV === 'development') {
      logger.logWarn('Resetting database', {});

      await this.systemDataSource.resetDB(includeSeeds);

      return 'OK';
    } else {
      throw new Error('Can not reset db in non-development environment');
    }
  }
}
