import { ResolverContext } from '../context';
import { SystemDataSource } from '../datasources/SystemDataSource';
import Authorized from '../decorators/Authorized';
import { HealthStats } from '../resolvers/queries/SystemQuery';
import { Roles } from '../types/shared';

export default class SystemQueries {
  constructor(private systemDataSource: SystemDataSource) {}

  async healthCheck(): Promise<HealthStats> {
    return this.systemDataSource.healthCheck();
  }

  @Authorized([Roles.USER_OFFICER])
  async getAllQueryAndMutationMethods(context: ResolverContext) {
    const allQueryMethods: string[] = [];
    const allMutationMethods: string[] = [];

    Object.keys(context.queries).forEach((queryKey) => {
      const element =
        context.queries[queryKey as keyof ResolverContext['queries']];

      const proto = Object.getPrototypeOf(element);
      if (!proto.constructor.name.startsWith('System')) {
        const names = Object.getOwnPropertyNames(proto).filter(
          (item) => item !== 'constructor'
        );

        const classNamesWithMethod = names.map(
          (item) => `${proto.constructor.name}.${item}`
        );

        allQueryMethods.push(...classNamesWithMethod);
      }
    });

    Object.keys(context.mutations).forEach((mutationKey) => {
      const element =
        context.mutations[mutationKey as keyof ResolverContext['mutations']];

      const proto = Object.getPrototypeOf(element);
      if (!proto.constructor.name.startsWith('System')) {
        const names = Object.getOwnPropertyNames(proto).filter(
          (item) => item !== 'constructor'
        );

        const classNamesWithMethod = names.map(
          (item) => `${proto.constructor.name}.${item}`
        );

        allMutationMethods.push(...classNamesWithMethod);
      }
    });

    return { queries: allQueryMethods, mutations: allMutationMethods };
  }
}
