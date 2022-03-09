export enum Roles {
  USER = 'user',
  USER_OFFICER = 'user_officer',
  SEP_CHAIR = 'SEP_Chair',
  SEP_SECRETARY = 'SEP_Secretary',
  SEP_REVIEWER = 'SEP_Reviewer',
  INSTRUMENT_SCIENTIST = 'instrument_scientist',
  SAMPLE_SAFETY_REVIEWER = 'sample_safety_reviewer',
}

export type Role = {
  shortCode: string;
};

export type User = {
  id: string;
  email: string;
};

export type AuthJwtPayload = { user: User; roles: Role[]; currentRole: Role };
export type AuthJwtApiTokenPayload = { accessTokenId: string };
