import { ResolverContext } from '../context';
import { EquipmentDataSource } from '../datasources/EquipmentDataSource';
import Authorized from '../decorators/Authorized';
import { Equipment } from '../models/Equipment';
import { Rejection, rejection } from '../rejection';
import {
  EquipmentInput,
  AssignEquipmentsToScheduledEventInput,
  DeleteEquipmentAssignmentInput,
  ConfirmEquipmentAssignmentInput,
} from '../resolvers/mutations/EquipmentMutation';
import { Roles } from '../types/shared';

export default class EquipmentMutations {
  constructor(private equipmentDataSource: EquipmentDataSource) {}

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  create(
    ctx: ResolverContext,
    newEquipmentInput: EquipmentInput
  ): Promise<Equipment | Rejection> {
    return this.equipmentDataSource.create(+ctx.user?.id!, newEquipmentInput);
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  async update(
    ctx: ResolverContext,
    id: number,
    updateEquipmentInput: EquipmentInput
  ): Promise<Equipment | Rejection> {
    const updated = await this.equipmentDataSource.update(
      id,
      updateEquipmentInput
    );

    if (updated === null) {
      return rejection('NOT_FOUND');
    }

    return updated;
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  assign(
    ctx: ResolverContext,
    assignEquipmentsToScheduledEventInput: AssignEquipmentsToScheduledEventInput
  ) {
    // TODO: check if has permission
    //  assignEquipmentsToScheduledEventInput.proposalBookingId

    return this.equipmentDataSource.assign(
      assignEquipmentsToScheduledEventInput
    );
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  deleteAssignment(
    ctx: ResolverContext,
    deleteEquipmentAssignmentInput: DeleteEquipmentAssignmentInput
  ) {
    // TODO: check if has permission
    //  assignEquipmentsToScheduledEventInput.proposalBookingId

    return this.equipmentDataSource.deleteAssignment(
      deleteEquipmentAssignmentInput
    );
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  confirmAssignment(
    ctx: ResolverContext,
    confirmEquipmentAssignmentInput: ConfirmEquipmentAssignmentInput
  ) {
    // TODO: check if has permission
    //  assignEquipmentsToScheduledEventInput.proposalBookingId

    return this.equipmentDataSource.confirmAssignment(
      confirmEquipmentAssignmentInput
    );
  }
}
