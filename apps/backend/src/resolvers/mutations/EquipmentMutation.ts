import {
  InputType,
  Field,
  Resolver,
  Mutation,
  Ctx,
  Arg,
  Int,
} from 'type-graphql';

import { ResolverContext } from '../../context';
import {
  Equipment as EquipmentBase,
  EquipmentAssignmentStatus,
} from '../../models/Equipment';
import { TzLessDateTime } from '../CustomScalars';
import {
  EquipmentResponseWrap,
  ResponseWrapBase,
  SchedulerSuccessResponseWrap,
} from '../types/wrappers';
import { wrapResponse } from '../wrapResponse';

@InputType()
export class EquipmentInput implements Partial<EquipmentBase> {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => [Int], { nullable: true })
  instrumentIds?: number[];

  @Field(() => String, { nullable: true })
  color: string | null;

  @Field(() => TzLessDateTime, { nullable: true })
  maintenanceStartsAt?: Date;

  @Field(() => TzLessDateTime, { nullable: true })
  maintenanceEndsAt?: Date;

  @Field(() => Boolean)
  autoAccept: boolean;

  @Field(() => [Int], { nullable: true })
  equipmentResponsible: number[] | null;

  @Field(() => Int)
  ownerUserId: number;
}

@InputType()
export class AssignEquipmentsToScheduledEventInput {
  @Field(() => Int)
  scheduledEventId: number;

  @Field(() => Int)
  proposalBookingId: number;

  @Field(() => [Int])
  equipmentIds: number[];
}

@InputType()
export class DeleteEquipmentAssignmentInput {
  @Field(() => Int)
  scheduledEventId: number;

  @Field(() => Int)
  proposalBookingId: number;

  @Field(() => Int)
  equipmentId: number;
}

@InputType()
export class ConfirmEquipmentAssignmentInput {
  @Field(() => Int)
  scheduledEventId: number;

  @Field(() => Int)
  equipmentId: number;

  @Field(() => EquipmentAssignmentStatus)
  newStatus: EquipmentAssignmentStatus;
}

@Resolver()
export class EquipmentMutation {
  @Mutation(() => EquipmentResponseWrap)
  createEquipment(
    @Ctx() ctx: ResolverContext,
    @Arg('newEquipmentInput', () => EquipmentInput)
    newEquipmentInput: EquipmentInput
  ): Promise<ResponseWrapBase> {
    return wrapResponse(
      ctx.mutations.equipment.create(ctx, newEquipmentInput),
      EquipmentResponseWrap
    );
  }

  @Mutation(() => EquipmentResponseWrap)
  updateEquipment(
    @Ctx() ctx: ResolverContext,
    @Arg('id', () => Int) id: number,
    @Arg('updateEquipmentInput', () => EquipmentInput)
    updateEquipmentInput: EquipmentInput
  ): Promise<ResponseWrapBase> {
    return wrapResponse(
      ctx.mutations.equipment.update(ctx, { id, ...updateEquipmentInput }),
      EquipmentResponseWrap
    );
  }

  @Mutation(() => Boolean)
  assignToScheduledEvents(
    @Ctx() ctx: ResolverContext,
    @Arg(
      'assignEquipmentsToScheduledEventInput',
      () => AssignEquipmentsToScheduledEventInput
    )
    assignEquipmentsToScheduledEventInput: AssignEquipmentsToScheduledEventInput
  ): Promise<boolean> {
    return ctx.mutations.equipment.assign(
      ctx,
      assignEquipmentsToScheduledEventInput
    );
  }

  @Mutation(() => Boolean)
  deleteEquipmentAssignment(
    @Ctx() ctx: ResolverContext,
    @Arg('deleteEquipmentAssignmentInput', () => DeleteEquipmentAssignmentInput)
    deleteEquipmentAssignmentInput: DeleteEquipmentAssignmentInput
  ): Promise<boolean> {
    return ctx.mutations.equipment.deleteAssignment(
      ctx,
      deleteEquipmentAssignmentInput
    );
  }

  @Mutation(() => SchedulerSuccessResponseWrap)
  confirmEquipmentAssignment(
    @Ctx() ctx: ResolverContext,
    @Arg(
      'confirmEquipmentAssignmentInput',
      () => ConfirmEquipmentAssignmentInput
    )
    confirmEquipmentAssignmentInput: ConfirmEquipmentAssignmentInput
  ) {
    return wrapResponse(
      ctx.mutations.equipment.confirmAssignment(
        ctx,
        confirmEquipmentAssignmentInput
      ),
      SchedulerSuccessResponseWrap
    );
  }
}
