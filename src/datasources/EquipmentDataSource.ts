import {
  Equipment,
  EquipmentAssignmentStatus,
  EquipmentResponsible,
} from '../models/Equipment';
import {
  EquipmentsScheduledEvent,
  ScheduledEvent,
} from '../models/ScheduledEvent';
import {
  EquipmentInput,
  AssignEquipmentsToScheduledEventInput,
  DeleteEquipmentAssignmentInput,
  ConfirmEquipmentAssignmentInput,
  EquipmentResponsibleInput,
} from '../resolvers/mutations/EquipmentMutation';

export interface EquipmentDataSource {
  create(userId: number, newEquipmentInput: EquipmentInput): Promise<Equipment>;
  update(
    id: number,
    updateEquipmentInput: EquipmentInput
  ): Promise<Equipment | null>;
  get(id: number): Promise<Equipment | null>;
  getAll(equipmentIds?: number[]): Promise<Equipment[]>;
  getAllUserEquipments(
    userId: string,
    equipmentIds?: number[]
  ): Promise<Equipment[]>;
  scheduledEventEquipments(
    scheduledEventId: number
  ): Promise<Array<Equipment & { status: EquipmentAssignmentStatus }>>;
  equipmentAssignmentStatus(
    scheduledEventId: number,
    equipmentId?: number
  ): Promise<EquipmentAssignmentStatus | null>;
  availableEquipments(scheduledEvent: ScheduledEvent): Promise<Equipment[]>;
  assign(
    assignEquipmentsToScheduledEventInput: AssignEquipmentsToScheduledEventInput
  ): Promise<boolean>;
  deleteAssignment(
    deleteEquipmentAssignmentInput: DeleteEquipmentAssignmentInput
  ): Promise<boolean>;
  confirmAssignment(
    confirmEquipmentAssignmentInput: ConfirmEquipmentAssignmentInput
  ): Promise<boolean>;
  addEquipmentResponsible(
    addEquipmentResponsibleInput: EquipmentResponsibleInput
  ): Promise<boolean>;
  getEquipmentResponsible(equipmentId: number): Promise<EquipmentResponsible[]>;
  equipmentEventsByProposalBookingId(
    proposalBookingId: number
  ): Promise<Array<EquipmentsScheduledEvent>>;
}
