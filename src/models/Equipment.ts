export enum EquipmentAssignmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}
export class Equipment {
  constructor(
    public id: number,
    public owner: { id: number },
    public createdAt: Date,
    public updatedAt: Date,
    public name: string,
    public description: string,
    public color: string | null,
    public backgroundColor: string | null,
    public maintenanceStartsAt: Date,
    public maintenanceEndsAt: Date,
    public autoAccept: boolean
  ) {}
}

export class EquipmentResponsible {
  constructor(public id: number) {}
}
