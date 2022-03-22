import { equipmentValidationSchema } from '@user-office-software/duo-validation';

import { ResolverContext } from '../context';
import { EquipmentDataSource } from '../datasources/EquipmentDataSource';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import { ScheduledEventDataSource } from '../datasources/ScheduledEventDataSource';
import Authorized from '../decorators/Authorized';
import ValidateArgs from '../decorators/ValidateArgs';
import { ProposalBookingStatusCore } from '../generated/sdk';
import {
  isEquipmentResponsibleOrOwner,
  isUserOfficer,
} from '../helpers/permissionHelpers';
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
  constructor(
    private equipmentDataSource: EquipmentDataSource,
    private proposalBookingDataSource: ProposalBookingDataSource,
    private scheduledEventDataSource: ScheduledEventDataSource
  ) {}

  @ValidateArgs(equipmentValidationSchema)
  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async create(
    ctx: ResolverContext,
    newEquipmentInput: EquipmentInput
  ): Promise<Equipment | Rejection> {
    return this.equipmentDataSource.create(newEquipmentInput);
  }

  @ValidateArgs(equipmentValidationSchema)
  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST])
  async update(
    ctx: ResolverContext,
    updateEquipmentInput: EquipmentInput & {
      id: number;
    }
  ): Promise<Equipment | Rejection> {
    const equipment = await this.equipmentDataSource.get(
      updateEquipmentInput.id
    );

    if (!equipment) {
      return rejection('NOT_FOUND');
    }
    const equipmentResponsible =
      await this.equipmentDataSource.getEquipmentResponsible(
        updateEquipmentInput.id
      );

    const allEquipmentUserIds = [equipment.owner, ...equipmentResponsible].map(
      (user) => user.id
    );

    if (
      !isUserOfficer(ctx) &&
      !isEquipmentResponsibleOrOwner(ctx, allEquipmentUserIds)
    ) {
      return rejection('NOT_ALLOWED');
    }

    const updated = await this.equipmentDataSource.update(
      updateEquipmentInput.id,
      updateEquipmentInput
    );

    if (updated === null) {
      return rejection('NOT_FOUND');
    }

    return updated;
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  async assign(
    ctx: ResolverContext,
    assignEquipmentsToScheduledEventInput: AssignEquipmentsToScheduledEventInput
  ) {
    const proposalBooking = await this.proposalBookingDataSource.get(
      assignEquipmentsToScheduledEventInput.proposalBookingId
    );

    const scheduledEvent = await this.scheduledEventDataSource.get(
      assignEquipmentsToScheduledEventInput.scheduledEventId
    );

    if (
      !proposalBooking ||
      !scheduledEvent ||
      // if the scheduled event is not DRAFT state disallow assigning any equipment
      scheduledEvent.status !== ProposalBookingStatusCore.DRAFT
    ) {
      return false;
    }

    // TODO: check if has permission
    //  assignEquipmentsToScheduledEventInput.proposalBookingId

    return this.equipmentDataSource.assign(
      assignEquipmentsToScheduledEventInput
    );
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  async deleteAssignment(
    ctx: ResolverContext,
    deleteEquipmentAssignmentInput: DeleteEquipmentAssignmentInput
  ) {
    const proposalBooking = await this.proposalBookingDataSource.get(
      deleteEquipmentAssignmentInput.proposalBookingId
    );

    const scheduledEvent = await this.scheduledEventDataSource.get(
      deleteEquipmentAssignmentInput.scheduledEventId
    );

    if (
      !proposalBooking ||
      !scheduledEvent ||
      // if the scheduled event is not DRAFT state disallow delete any assigned equipment
      scheduledEvent.status !== ProposalBookingStatusCore.DRAFT
    ) {
      return false;
    }

    // TODO: check if has permission
    //  assignEquipmentsToScheduledEventInput.proposalBookingId

    return this.equipmentDataSource.deleteAssignment(
      deleteEquipmentAssignmentInput
    );
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  async confirmAssignment(
    ctx: ResolverContext,
    confirmEquipmentAssignmentInput: ConfirmEquipmentAssignmentInput
  ) {
    const equipment = await this.equipmentDataSource.get(
      confirmEquipmentAssignmentInput.equipmentId
    );

    if (!equipment) {
      return rejection('NOT_FOUND');
    }
    const equipmentResponsible =
      await this.equipmentDataSource.getEquipmentResponsible(
        confirmEquipmentAssignmentInput.equipmentId
      );

    const allEquipmentUserIds = [equipment.owner, ...equipmentResponsible].map(
      (user) => user.id
    );

    if (
      !isUserOfficer(ctx) &&
      !isEquipmentResponsibleOrOwner(ctx, allEquipmentUserIds)
    ) {
      return rejection('NOT_ALLOWED');
    }

    return this.equipmentDataSource.confirmAssignment(
      confirmEquipmentAssignmentInput
    );
  }
}
