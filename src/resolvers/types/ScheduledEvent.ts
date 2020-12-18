import { Type } from 'class-transformer';
import {
  Field,
  ID,
  ObjectType,
  FieldResolver,
  Resolver,
  Root,
  Ctx,
  Arg,
} from 'type-graphql';

import { ResolverContext } from '../../context';
import { EquipmentAssignmentStatus } from '../../models/Equipment';
import {
  ScheduledEvent as ScheduledEventBase,
  ScheduledEventBookingType,
} from '../../models/ScheduledEvent';
import { TzLessDateTime } from '../CustomScalars';
import { Equipment, EquipmentWithAssignmentStatus } from './Equipment';
import { Instrument } from './Instrument';
import { User } from './User';

@ObjectType()
export class ScheduledEvent implements Partial<ScheduledEventBase> {
  @Field(() => ID)
  id: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => ScheduledEventBookingType)
  bookingType: ScheduledEventBookingType;

  @Field(() => TzLessDateTime)
  startsAt: Date;

  @Field(() => TzLessDateTime)
  endsAt: Date;

  // external type
  @Type(() => User)
  @Field()
  scheduledBy: User;

  @Field(() => String, { nullable: true })
  description?: string | null;

  // external type
  @Type(() => User)
  @Field()
  instrument: Instrument;
}

@Resolver(() => ScheduledEvent)
export class EquipmentResolver {
  @FieldResolver(() => [EquipmentWithAssignmentStatus])
  equipments(
    @Root() scheduledEvent: ScheduledEvent,
    @Ctx() ctx: ResolverContext
  ): Promise<Array<Equipment & { status: EquipmentAssignmentStatus }>> {
    return ctx.queries.equipment.scheduledEventEquipments(
      ctx,
      scheduledEvent.id
    );
  }

  @FieldResolver(() => EquipmentAssignmentStatus, { nullable: true })
  equipmentAssignmentStatus(
    @Root() scheduledEvent: ScheduledEvent,
    @Ctx() ctx: ResolverContext,
    @Arg('equipmentId', () => ID) equipmentId: number
  ): Promise<EquipmentAssignmentStatus | null> {
    return ctx.queries.equipment.equipmentAssignmentStatus(
      ctx,
      scheduledEvent.id,
      equipmentId
    );
  }
}
