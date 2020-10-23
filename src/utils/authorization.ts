import { Roles, Role } from '../types/shared';

export function hasRole(
  requiredRoles: Roles[],
  availableRoles: Role[]
): boolean {
  availableRoles = availableRoles || [];

  if (requiredRoles.length === 0) {
    return true;
  }

  return requiredRoles.some(requiredRole =>
    availableRoles.some(
      availableRole => requiredRole === availableRole.shortCode
    )
  );
}
