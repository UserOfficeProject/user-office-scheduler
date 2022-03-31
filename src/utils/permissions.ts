import { AuthenticatedUser } from 'context/UserContext';
import { GetEquipmentQuery, UserRole } from 'generated/sdk';

export const isEquipmentResponsiblePerson = (
  equipment: GetEquipmentQuery['equipment'] | null,
  loggedInUser?: AuthenticatedUser | null,
  loggedInUserCurrentRole?: UserRole | null
) =>
  loggedInUserCurrentRole === UserRole.INSTRUMENT_SCIENTIST &&
  !!equipment?.equipmentResponsible?.find(
    (user) => user.id === loggedInUser?.id
  );

export const isEquipmentOwner = (
  equipment: GetEquipmentQuery['equipment'] | null,
  loggedInUser?: AuthenticatedUser | null
) => equipment?.owner?.id === loggedInUser?.id;
