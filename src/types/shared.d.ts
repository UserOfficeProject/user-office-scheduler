export type Role = {
  shortCode: string;
};

export type User = {
  id: string;
  email: string;
};

export type AuthJwtPayload = { user: User; roles: Role[]; currentRole: Role };
