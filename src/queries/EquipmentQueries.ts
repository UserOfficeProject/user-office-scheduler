import { ResolverContext } from '../context';
import { EquipmentDataSource } from '../datasources/EquipmentDataSource';
import { ScheduledEventDataSource } from '../datasources/ScheduledEventDataSource';
import Authorized from '../decorators/Authorized';
import { getUserInstruments } from '../helpers/instrumentHelpers';
import { isUserOfficer } from '../helpers/permissionHelpers';
import {
  Equipment,
  EquipmentAssignmentStatus,
  EquipmentInstrument,
  EquipmentResponsible,
} from '../models/Equipment';
import { Roles } from '../types/shared';

export default class EquipmentQueries {
  constructor(
    private equipmentDataSource: EquipmentDataSource,
    private scheduledEventDataSource: ScheduledEventDataSource
  ) {}

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  async getEquipment(
    ctx: ResolverContext,
    id: number
  ): Promise<Equipment | null> {
    return this.equipmentDataSource.get(id);
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  async getEquipments(
    ctx: ResolverContext,
    equipmentIds?: number[]
  ): Promise<Equipment[]> {
    if (isUserOfficer(ctx)) {
      const allEquipments = this.equipmentDataSource.getAll(equipmentIds);

      return allEquipments;
    } else {
      if (!ctx.user) {
        return [];
      }

      const userInstruments = await getUserInstruments(ctx);
      const userInstrumentIds = userInstruments.map(
        (instrument) => instrument.id
      );

      const equipments = this.equipmentDataSource.getAllUserEquipments(
        ctx.user.id,
        userInstrumentIds,
        equipmentIds
      );

      return equipments;
    }
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  async availableEquipments(
    ctx: ResolverContext,
    scheduledEventId: number
  ): Promise<Equipment[]> {
    const scheduledEvent = await this.scheduledEventDataSource.get(
      scheduledEventId
    );

    if (!scheduledEvent) {
      return [];
    }

    return this.equipmentDataSource.availableEquipments(scheduledEvent);
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  scheduledEventEquipments(
    ctx: ResolverContext,
    scheduledEventId: number
  ): Promise<Array<Equipment & { status: EquipmentAssignmentStatus }>> {
    return this.equipmentDataSource.scheduledEventEquipments(scheduledEventId);
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  equipmentAssignmentStatus(
    ctx: ResolverContext,
    scheduledEventId: number,
    equipmentId?: number
  ): Promise<EquipmentAssignmentStatus | null> {
    return this.equipmentDataSource.equipmentAssignmentStatus(
      scheduledEventId,
      equipmentId
    );
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  getEquipmentResponsible(
    ctx: ResolverContext,
    equipmentId: number
  ): Promise<EquipmentResponsible[]> {
    return this.equipmentDataSource.getEquipmentResponsible(equipmentId);
  }

  @Authorized([Roles.USER_OFFICER, Roles.INSTRUMENT_SCIENTIST]) // TODO: make sure we use the right permissions
  getEquipmentInstruments(
    ctx: ResolverContext,
    equipmentId: number
  ): Promise<EquipmentInstrument[]> {
    return this.equipmentDataSource.getEquipmentInstruments(equipmentId);
  }
}
