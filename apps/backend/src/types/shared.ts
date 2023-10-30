import { Institution, Instrument } from '../generated/sdk';

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
  id: number;
  email: string;
};

export interface UserWithAccessPermissions extends User {
  accessPermissions?: Record<string, boolean>;
  isApiAccessToken?: boolean;
}

type Country = {
  countryId: number;
  country: string;
};

type Member = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  oidcSub: string | null;
  oauthIssuer: string | null;
  institution: Institution;
  country: Country;
};

export type ProposalMessageData = {
  abstract: string;
  allocatedTime: number;
  callId: number;
  instrument?: Pick<Instrument, 'id' | 'shortCode'>;
  members: Member[];
  newStatus?: string;
  proposalPk: number;
  proposer?: Member;
  shortCode: string;
  title: string;
  instrumentId?: number; // instrumentId is here for backwards compatibility.
  submitted: boolean;
};
