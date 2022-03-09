import { Type } from 'class-transformer';
import {
  Field,
  ObjectType,
  FieldResolver,
  Resolver,
  Root,
  Ctx,
  Int,
  Directive,
} from 'type-graphql';

import { ResolverContext } from '../../context';
import { ProposalBookingStatusCore } from '../../generated/sdk';
import { EquipmentAssignmentStatus } from '../../models/Equipment';
import {
  ScheduledEvent as ScheduledEventBase,
  ScheduledEventBookingType,
} from '../../models/ScheduledEvent';
import { TzLessDateTime } from '../CustomScalars';
import { Equipment, EquipmentWithAssignmentStatus } from './Equipment';
import { Instrument } from './Instrument';
import { ProposalBooking } from './ProposalBooking';
import { BasicUserDetails } from './User';

@ObjectType()
@Directive('@key(fields: "id")')
export class ScheduledEvent implements Partial<ScheduledEventBase> {
  @Field(() => Int)
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

  @Field(() => Int, { nullable: true })
  proposalBookingId: number | null;

  // external type
  @Type(() => BasicUserDetails)
  @Field({ nullable: true })
  scheduledBy?: BasicUserDetails;

  // external type
  @Type(() => BasicUserDetails)
  @Field({ nullable: true })
  localContact?: BasicUserDetails;

  @Field(() => String, { nullable: true })
  description: string | null;

  // defaultValue is null for scheduled events for now and might be added later but we have value for equipment events
  @Field(() => String, { defaultValue: null, nullable: true })
  color?: string | null;

  // external type
  @Type(() => Instrument)
  @Field({ nullable: true })
  instrument?: Instrument;

  @Field(() => Int, { nullable: true })
  equipmentId?: number;

  @Field(() => ProposalBookingStatusCore)
  status: ProposalBookingStatusCore;
}

@Resolver(() => ScheduledEvent)
export class ScheduledEventResolver {
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
    @Ctx() ctx: ResolverContext
  ): Promise<EquipmentAssignmentStatus | null> {
    return ctx.queries.equipment.equipmentAssignmentStatus(
      ctx,
      scheduledEvent.id,
      scheduledEvent.equipmentId
    );
  }

  @FieldResolver(() => ProposalBooking, { nullable: true })
  async proposalBooking(
    @Root() scheduledEvent: ScheduledEvent,
    @Ctx() ctx: ResolverContext
  ): Promise<ProposalBooking | null> {
    if (scheduledEvent.proposalBookingId === null) {
      return null;
    }

    return ctx.queries.proposalBooking.get(
      ctx,
      scheduledEvent.proposalBookingId
    );
  }
}
