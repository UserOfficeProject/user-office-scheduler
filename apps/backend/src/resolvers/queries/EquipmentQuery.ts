import { Resolver, Query, Ctx, Arg, Int } from 'type-graphql';

import { ResolverContext } from '../../context';
import { Equipment } from '../types/Equipment';

@Resolver()
export class EquipmentQueries {
  @Query(() => [Equipment])
  equipments(
    @Ctx() ctx: ResolverContext,
    @Arg('equipmentIds', () => [Int], { nullable: true }) equipmentIds: number[]
  ): Promise<Equipment[]> {
    return ctx.queries.equipment.getEquipments(ctx, equipmentIds);
  }

  @Query(() => [Equipment])
  availableEquipments(
    @Ctx() ctx: ResolverContext,
    @Arg('scheduledEventId', () => Int) scheduledEventId: number
  ): Promise<Equipment[]> {
    return ctx.queries.equipment.availableEquipments(ctx, scheduledEventId);
  }

  @Query(() => Equipment, { nullable: true })
  equipment(
    @Ctx() ctx: ResolverContext,
    @Arg('id', () => Int) id: number
  ): Promise<Equipment | null> {
    return ctx.queries.equipment.getEquipment(ctx, id);
  }
}
