import { Type } from 'class-transformer';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  ID,
  ObjectType,
  Resolver,
  Root,
} from 'type-graphql';

import { ResolverContext } from '../../context';
import {
  Equipment as EquipmentBase,
  EquipmentAssignmentStatus,
} from '../../models/Equipment';
import { TzLessDateTime } from '../CustomScalars';
import { ScheduledEvent } from './ScheduledEvent';
import { User } from './User';

@ObjectType()
export class Equipment implements Partial<EquipmentBase> {
  @Field(() => ID)
  id: number;

  // external type
  @Type(() => User)
  @Field({ nullable: true })
  owner?: User;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  name: string;

  @Field(() => TzLessDateTime, { nullable: true })
  maintenanceStartsAt?: Date;

  @Field(() => TzLessDateTime, { nullable: true })
  maintenanceEndsAt?: Date;

  @Field(() => Boolean)
  autoAccept: boolean;
}

@ObjectType()
export class EquipmentWithAssignmentStatus extends Equipment {
  @Field(() => EquipmentAssignmentStatus)
  status: EquipmentAssignmentStatus;
}

@Resolver(() => Equipment)
export class EquipmentResolvers {
  @FieldResolver(() => [ScheduledEvent])
  events(
    @Root() equipment: Equipment,
    @Ctx() ctx: ResolverContext,
    @Arg('startsAt', () => TzLessDateTime) startsAt: Date,
    @Arg('endsAt', () => TzLessDateTime) endsAt: Date
  ): Promise<ScheduledEvent[]> {
    return ctx.queries.scheduledEvent.equipmentScheduledEvents(
      ctx,
      [equipment.id],
      startsAt,
      endsAt
    );
  }

  @FieldResolver(() => [User])
  equipmentResponsible(
    @Root() equipment: Equipment,
    @Ctx() ctx: ResolverContext
  ): Promise<User[]> {
    return ctx.queries.equipment.getEquipmentResponsible(ctx, equipment.id);
  }
}
