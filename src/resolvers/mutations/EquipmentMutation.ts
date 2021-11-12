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
import { EquipmentResponseWrap, ResponseWrapBase } from '../types/wrappers';
import { wrapResponse } from '../wrapResponse';

@InputType()
export class EquipmentInput implements Partial<EquipmentBase> {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => TzLessDateTime, { nullable: true })
  maintenanceStartsAt?: Date;

  @Field(() => TzLessDateTime, { nullable: true })
  maintenanceEndsAt?: Date;

  @Field(() => Boolean)
  autoAccept: boolean;
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

@InputType()
export class EquipmentResponsibleInput {
  @Field(() => Int)
  equipmentId: number;

  @Field(() => [Int])
  userIds: number[];
}

@InputType()
export class UpdateEquipmentOwnerInput {
  @Field(() => Int)
  equipmentId: number;

  @Field(() => Int)
  userId: number;
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
    @Arg('id', () => Int) id: number,
    @Arg('updateEquipmentInput', () => EquipmentInput)
    updateEquipmentInput: EquipmentInput
  ): Promise<ResponseWrapBase<EquipmentResponseWrap>> {
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

  @Mutation(() => Boolean)
  updateEquipmentOwner(
    @Ctx() ctx: ResolverContext,
    @Arg('updateEquipmentOwnerInput', () => UpdateEquipmentOwnerInput)
    updateEquipmentOwnerInput: UpdateEquipmentOwnerInput
  ): Promise<boolean> {
    return ctx.mutations.equipment.updateEquipmentOwner(
      ctx,
      updateEquipmentOwnerInput
    );
  }

  @Mutation(() => Boolean)
  addEquipmentResponsible(
    @Ctx() ctx: ResolverContext,
    @Arg('equipmentResponsibleInput', () => EquipmentResponsibleInput)
    equipmentResponsibleInput: EquipmentResponsibleInput
  ): Promise<boolean> {
    return ctx.mutations.equipment.addEquipmentResponsible(
      ctx,
      equipmentResponsibleInput
    );
  }
}
