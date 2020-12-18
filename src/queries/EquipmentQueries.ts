import { ResolverContext } from '../context';
import { EquipmentDataSource } from '../datasources/EquipmentDataSource';
import { ScheduledEventDataSource } from '../datasources/ScheduledEventDataSource';
import Authorized from '../decorators/Authorized';
import { Equipment, EquipmentAssignmentStatus } from '../models/Equipment';

export default class EquipmentQueries {
  constructor(
    private equipmentDataSource: EquipmentDataSource,
    private scheduledEventDataSource: ScheduledEventDataSource
  ) {}

  @Authorized() // TODO: use right roles
  async getEquipment(
    ctx: ResolverContext,
    id: number
  ): Promise<Equipment | null> {
    return this.equipmentDataSource.get(id);
  }

  @Authorized() // TODO: use right roles
  async getEquipments(ctx: ResolverContext): Promise<Equipment[]> {
    return this.equipmentDataSource.getAll();
  }

  @Authorized()
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

  @Authorized()
  scheduledEventEquipments(
    ctx: ResolverContext,
    scheduledEventId: number
  ): Promise<Array<Equipment & { status: EquipmentAssignmentStatus }>> {
    return this.equipmentDataSource.scheduledEventEquipments(scheduledEventId);
  }

  @Authorized()
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
}
