import { Role } from '../types/shared';

export function hasRole(
  requiredRoles: Role[],
  availableRoles: Role[]
): boolean {
  if (requiredRoles.length === 0) {
    return true;
  }

  return requiredRoles.some(requiredRole =>
    availableRoles.some(
      availableRole => requiredRole.shortCode === availableRole.shortCode
    )
  );
}
