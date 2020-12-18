import {
  InputType,
  Field,
  ID,
  Resolver,
  Mutation,
  Ctx,
  Arg,
} from 'type-graphql';

import { ResolverContext } from '../../context';
import {
  Equipment as EquipmentBase,
  EquipmentAssignmentStatus,
} from '../../models/Equipment';
import { TzLessDateTime } from '../CustomScalars';
import { EquipmentResponseWrap, ResponseWrapBase } from '../types/wrappers';
import { wrapResponse } from '../wrapResponse';

@InputType()
export class EquipmentInput implements Partial<EquipmentBase> {
  @Field(() => String)
  name: string;

  @Field(() => TzLessDateTime, { nullable: true })
  maintenanceStartsAt?: Date;

  @Field(() => TzLessDateTime, { nullable: true })
  maintenanceEndsAt?: Date;

  @Field(() => Boolean)
  autoAccept: boolean;
}

@InputType()
export class AssignEquipmentsToScheduledEventInput {
  @Field(() => ID)
  scheduledEventId: number;

  @Field(() => ID)
  proposalBookingId: number;

  @Field(() => [ID])
  equipmentIds: number[];
}

@InputType()
export class DeleteEquipmentAssignmentInput {
  @Field(() => ID)
  scheduledEventId: number;

  @Field(() => ID)
  proposalBookingId: number;

  @Field(() => ID)
  equipmentId: number;
}

@InputType()
export class ConfirmEquipmentAssignmentInput {
  @Field(() => ID)
  scheduledEventId: number;

  @Field(() => ID)
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
  ): Promise<ResponseWrapBase<EquipmentResponseWrap>> {
    return wrapResponse(
      ctx.mutations.equipment.create(ctx, newEquipmentInput),
      EquipmentResponseWrap
    );
  }

  @Mutation(() => EquipmentResponseWrap)
  updateEquipment(
    @Ctx() ctx: ResolverContext,
    @Arg('id', () => ID) id: number,
    @Arg('updateEquipmentInput', () => EquipmentInput)
    updateEquipmentInput: EquipmentInput
  ): Promise<ResponseWrapBase<EquipmentResponseWrap>> {
    return wrapResponse(
      ctx.mutations.equipment.update(ctx, id, updateEquipmentInput),
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

  @Mutation(() => Boolean)
  confirmEquipmentAssignment(
    @Ctx() ctx: ResolverContext,
    @Arg(
      'confirmEquipmentAssignmentInput',
      () => ConfirmEquipmentAssignmentInput
    )
    confirmEquipmentAssignmentInput: ConfirmEquipmentAssignmentInput
  ): Promise<boolean> {
    return ctx.mutations.equipment.confirmAssignment(
      ctx,
      confirmEquipmentAssignmentInput
    );
  }
}
