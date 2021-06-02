import { ResolverContext } from '../context';
import { EquipmentDataSource } from '../datasources/EquipmentDataSource';
import { ScheduledEventDataSource } from '../datasources/ScheduledEventDataSource';
import Authorized from '../decorators/Authorized';
import {
  Equipment,
  EquipmentAssignmentStatus,
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
    return this.equipmentDataSource.getAll(equipmentIds);
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
    equipmentId: number
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
}
