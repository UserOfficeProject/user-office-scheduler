import {
  Equipment,
  EquipmentAssignmentStatus,
  EquipmentInstrument,
  EquipmentResponsible,
} from '../models/Equipment';
import {
  EquipmentsScheduledEvent,
  ScheduledEvent,
} from '../models/ScheduledEvent';
import { Rejection } from '../rejection';
import {
  EquipmentInput,
  AssignEquipmentsToScheduledEventInput,
  DeleteEquipmentAssignmentInput,
  ConfirmEquipmentAssignmentInput,
} from '../resolvers/mutations/EquipmentMutation';

export interface EquipmentDataSource {
  create(newEquipmentInput: EquipmentInput): Promise<Equipment>;
  update(
    id: number,
    updateEquipmentInput: EquipmentInput
  ): Promise<Equipment | Rejection | null>;
  get(id: number): Promise<Equipment | null>;
  getAll(equipmentIds?: number[]): Promise<Equipment[]>;
  getAllUserEquipments(
    userId: number,
    userInstrumentIds: number[],
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
  getEquipmentResponsible(equipmentId: number): Promise<EquipmentResponsible[]>;
  getEquipmentInstruments(equipmentId: number): Promise<EquipmentInstrument[]>;
  equipmentEventsByProposalBookingId(
    proposalBookingId: number
  ): Promise<Array<EquipmentsScheduledEvent>>;
  equipmentEventsByScheduledEventId(
    scheduledEventId: number
  ): Promise<Array<EquipmentsScheduledEvent>>;
}
