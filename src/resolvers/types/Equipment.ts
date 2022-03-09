import { Type } from 'class-transformer';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Int,
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
import { Instrument } from './Instrument';
import { ScheduledEvent } from './ScheduledEvent';
import { BasicUserDetails } from './User';

@ObjectType()
export class Equipment implements Partial<EquipmentBase> {
  @Field(() => Int)
  id: number;

  // external type
  @Type(() => BasicUserDetails)
  @Field({ nullable: true })
  owner?: BasicUserDetails;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  color: string | null;

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

  @FieldResolver(() => [BasicUserDetails])
  equipmentResponsible(
    @Root() equipment: Equipment,
    @Ctx() ctx: ResolverContext
  ): Promise<BasicUserDetails[]> {
    return ctx.queries.equipment.getEquipmentResponsible(ctx, equipment.id);
  }

  @FieldResolver(() => [Instrument])
  equipmentInstruments(
    @Root() equipment: Equipment,
    @Ctx() ctx: ResolverContext
  ): Promise<Instrument[]> {
    return ctx.queries.equipment.getEquipmentInstruments(ctx, equipment.id);
  }
}
