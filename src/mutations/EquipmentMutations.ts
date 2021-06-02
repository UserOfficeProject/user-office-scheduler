/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ResolverContext } from '../context';
import { EquipmentDataSource } from '../datasources/EquipmentDataSource';
import { ProposalBookingDataSource } from '../datasources/ProposalBookingDataSource';
import Authorized from '../decorators/Authorized';
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
import { Roles } from '../types/shared';

export default class EquipmentMutations {
  constructor(
    private equipmentDataSource: EquipmentDataSource,
    private proposalBookingDataSource: ProposalBookingDataSource
  ) {}

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

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  addEquipmentResponsible(
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
