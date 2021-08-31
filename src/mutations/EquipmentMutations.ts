/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { equipmentValidationSchema } from '@esss-swap/duo-validation';

import { ResolverContext } from '../context';
import { EquipmentDataSource } from '../datasources/EquipmentDataSource';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import Authorized from '../decorators/Authorized';
import ValidateArgs from '../decorators/ValidateArgs';
import { Equipment } from '../models/Equipment';
import { ProposalBookingStatus } from '../models/ProposalBooking';
import { Rejection, rejection } from '../rejection';
import {
  EquipmentInput,
  AssignEquipmentsToScheduledEventInput,
  DeleteEquipmentAssignmentInput,
  ConfirmEquipmentAssignmentInput,
  EquipmentResponsibleInput,
} from '../resolvers/mutations/EquipmentMutation';
import { Roles, User } from '../types/shared';

export default class EquipmentMutations {
  constructor(
    private equipmentDataSource: EquipmentDataSource,
    private proposalBookingDataSource: ProposalBookingDataSource
  ) {}

  @ValidateArgs(equipmentValidationSchema)
  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  async create(
    ctx: ResolverContext,
    newEquipmentInput: EquipmentInput
  ): Promise<Equipment | Rejection> {
    return this.equipmentDataSource.create(
      +(ctx.user as User).id,
      newEquipmentInput
    );
  }

  @ValidateArgs(equipmentValidationSchema)
  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  async update(
    ctx: ResolverContext,
    updateEquipmentInput: EquipmentInput & {
      id: number;
    }
  ): Promise<Equipment | Rejection> {
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

    if (
      !proposalBooking ||
      // if the booking is not in DRAFT state disallow assigning any equipment
      proposalBooking.status !== ProposalBookingStatus.DRAFT
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

    if (
      !proposalBooking ||
      // if the booking is not in DRAFT state disallow delete any assigned equipment
      proposalBooking.status !== ProposalBookingStatus.DRAFT
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
    // TODO: check if has permission
    //  assignEquipmentsToScheduledEventInput.proposalBookingId

    return this.equipmentDataSource.confirmAssignment(
      confirmEquipmentAssignmentInput
    );
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  async addEquipmentResponsible(
    ctx: ResolverContext,
    equipmentResponsibleInput: EquipmentResponsibleInput
  ) {
    // TODO: check if has permission
    //  assignEquipmentsToScheduledEventInput.proposalBookingId

    return this.equipmentDataSource.addEquipmentResponsible(
      equipmentResponsibleInput
    );
  }
}
