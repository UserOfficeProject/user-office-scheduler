import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  IntStringDateBoolArray: any;
  /** DateTime without timezone in 'yyyy-MM-dd HH:mm:ss' format */
  TzLessDateTime: string;
};

export type AddProposalWorkflowStatusInput = {
  proposalWorkflowId: Scalars['Int'];
  sortOrder: Scalars['Int'];
  droppableGroupId: Scalars['String'];
  parentDroppableGroupId?: Maybe<Scalars['String']>;
  proposalStatusId: Scalars['Int'];
  nextProposalStatusId?: Maybe<Scalars['Int']>;
  prevProposalStatusId?: Maybe<Scalars['Int']>;
};

export type AddStatusChangingEventsToConnectionInput = {
  proposalWorkflowConnectionId: Scalars['Int'];
  statusChangingEvents: Array<Scalars['String']>;
};

export type AddTechnicalReviewInput = {
  proposalPk: Scalars['Int'];
  comment?: Maybe<Scalars['String']>;
  publicComment?: Maybe<Scalars['String']>;
  timeAllocation?: Maybe<Scalars['Int']>;
  status?: Maybe<TechnicalReviewStatus>;
  submitted?: Maybe<Scalars['Boolean']>;
  reviewerId?: Maybe<Scalars['Int']>;
};

export type AddUserRoleResponseWrap = {
  __typename?: 'AddUserRoleResponseWrap';
  rejection: Maybe<Rejection>;
  success: Maybe<Scalars['Boolean']>;
};

export enum AllocationTimeUnits {
  DAY = 'Day',
  HOUR = 'Hour'
}

export type Answer = {
  __typename?: 'Answer';
  question: Question;
  sortOrder: Scalars['Int'];
  topicId: Scalars['Int'];
  config: FieldConfig;
  dependencies: Array<FieldDependency>;
  dependenciesOperator: Maybe<DependenciesLogicOperator>;
  answerId: Maybe<Scalars['Int']>;
  value: Maybe<Scalars['IntStringDateBoolArray']>;
};

export type AnswerBasic = {
  __typename?: 'AnswerBasic';
  answerId: Maybe<Scalars['Int']>;
  answer: Scalars['IntStringDateBoolArray'];
  questionaryId: Scalars['Int'];
  questionId: Scalars['String'];
  createdAt: Scalars['DateTime'];
};

export type AnswerInput = {
  questionId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type ApiAccessTokenResponseWrap = {
  __typename?: 'ApiAccessTokenResponseWrap';
  rejection: Maybe<Rejection>;
  apiAccessToken: Maybe<PermissionsWithAccessToken>;
};

export type AssignChairOrSecretaryToSepInput = {
  userId: Scalars['Int'];
  roleId: UserRole;
  sepId: Scalars['Int'];
};

export type AssignEquipmentsToScheduledEventInput = {
  scheduledEventId: Scalars['ID'];
  proposalBookingId: Scalars['ID'];
  equipmentIds: Array<Scalars['ID']>;
};

export type AssignInstrumentsToCallInput = {
  instrumentIds: Array<Scalars['Int']>;
  callId: Scalars['Int'];
};

export type AuthJwtApiTokenPayload = {
  __typename?: 'AuthJwtApiTokenPayload';
  accessTokenId: Scalars['String'];
};

export type AuthJwtPayload = {
  __typename?: 'AuthJwtPayload';
  user: User;
  currentRole: Role;
  roles: Array<Role>;
};

export type BasicUserDetails = {
  __typename?: 'BasicUserDetails';
  id: Scalars['Int'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  organisation: Scalars['String'];
  position: Scalars['String'];
  placeholder: Maybe<Scalars['Boolean']>;
  created: Maybe<Scalars['DateTime']>;
};

export type BasicUserDetailsResponseWrap = {
  __typename?: 'BasicUserDetailsResponseWrap';
  rejection: Maybe<Rejection>;
  user: Maybe<BasicUserDetails>;
};

export type BooleanConfig = {
  __typename?: 'BooleanConfig';
  small_label: Scalars['String'];
  required: Scalars['Boolean'];
  tooltip: Scalars['String'];
};

export type BulkUpsertLostTimesInput = {
  proposalBookingId: Scalars['ID'];
  lostTimes: Array<SimpleLostTimeInput>;
};

export type BulkUpsertScheduledEventsInput = {
  proposalBookingId: Scalars['ID'];
  scheduledEvents: Array<SimpleScheduledEventInput>;
};

export type Call = {
  __typename?: 'Call';
  id: Scalars['Int'];
  shortCode: Scalars['String'];
  startCall: Scalars['DateTime'];
  endCall: Scalars['DateTime'];
  startReview: Scalars['DateTime'];
  endReview: Scalars['DateTime'];
  startSEPReview: Maybe<Scalars['DateTime']>;
  endSEPReview: Maybe<Scalars['DateTime']>;
  startNotify: Scalars['DateTime'];
  endNotify: Scalars['DateTime'];
  startCycle: Scalars['DateTime'];
  endCycle: Scalars['DateTime'];
  referenceNumberFormat: Maybe<Scalars['String']>;
  proposalSequence: Maybe<Scalars['Int']>;
  cycleComment: Scalars['String'];
  surveyComment: Scalars['String'];
  proposalWorkflowId: Maybe<Scalars['Int']>;
  allocationTimeUnit: AllocationTimeUnits;
  templateId: Maybe<Scalars['Int']>;
  instruments: Array<InstrumentWithAvailabilityTime>;
  proposalWorkflow: Maybe<ProposalWorkflow>;
  proposalCount: Scalars['Int'];
  isActive: Scalars['Boolean'];
};

export type CallResponseWrap = {
  __typename?: 'CallResponseWrap';
  rejection: Maybe<Rejection>;
  call: Maybe<Call>;
};

export type CallsFilter = {
  templateIds?: Maybe<Array<Scalars['Int']>>;
  isActive?: Maybe<Scalars['Boolean']>;
  isEnded?: Maybe<Scalars['Boolean']>;
  isReviewEnded?: Maybe<Scalars['Boolean']>;
  isSEPReviewEnded?: Maybe<Scalars['Boolean']>;
};

export type ChangeProposalsStatusInput = {
  statusId: Scalars['Int'];
  proposals: Array<ProposalPkWithCallId>;
};

export type CheckExternalTokenWrap = {
  __typename?: 'CheckExternalTokenWrap';
  rejection: Maybe<Rejection>;
  token: Maybe<Scalars['String']>;
};

export type CloneProposalInput = {
  callId: Scalars['Int'];
  proposalToClonePk: Scalars['Int'];
};

export type ConfirmEquipmentAssignmentInput = {
  scheduledEventId: Scalars['ID'];
  equipmentId: Scalars['ID'];
  newStatus: EquipmentAssignmentStatus;
};

export type CreateApiAccessTokenInput = {
  name: Scalars['String'];
  accessPermissions: Scalars['String'];
};

export type CreateCallInput = {
  shortCode: Scalars['String'];
  startCall: Scalars['DateTime'];
  endCall: Scalars['DateTime'];
  startReview: Scalars['DateTime'];
  endReview: Scalars['DateTime'];
  startSEPReview?: Maybe<Scalars['DateTime']>;
  endSEPReview?: Maybe<Scalars['DateTime']>;
  startNotify: Scalars['DateTime'];
  endNotify: Scalars['DateTime'];
  startCycle: Scalars['DateTime'];
  endCycle: Scalars['DateTime'];
  referenceNumberFormat?: Maybe<Scalars['String']>;
  proposalSequence?: Maybe<Scalars['Int']>;
  cycleComment: Scalars['String'];
  surveyComment: Scalars['String'];
  allocationTimeUnit: AllocationTimeUnits;
  proposalWorkflowId?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
};

export type CreateProposalStatusInput = {
  shortCode: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
};

export type CreateProposalWorkflowInput = {
  name: Scalars['String'];
  description: Scalars['String'];
};

export type CreateUserByEmailInviteResponseWrap = {
  __typename?: 'CreateUserByEmailInviteResponseWrap';
  rejection: Maybe<Rejection>;
  id: Maybe<Scalars['Int']>;
};

export enum DataType {
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  EMBELLISHMENT = 'EMBELLISHMENT',
  FILE_UPLOAD = 'FILE_UPLOAD',
  SELECTION_FROM_OPTIONS = 'SELECTION_FROM_OPTIONS',
  TEXT_INPUT = 'TEXT_INPUT',
  SAMPLE_DECLARATION = 'SAMPLE_DECLARATION',
  SAMPLE_BASIS = 'SAMPLE_BASIS',
  PROPOSAL_BASIS = 'PROPOSAL_BASIS',
  INTERVAL = 'INTERVAL',
  NUMBER_INPUT = 'NUMBER_INPUT',
  SHIPMENT_BASIS = 'SHIPMENT_BASIS',
  RICH_TEXT_INPUT = 'RICH_TEXT_INPUT',
  VISIT_BASIS = 'VISIT_BASIS'
}

export type DateConfig = {
  __typename?: 'DateConfig';
  small_label: Scalars['String'];
  required: Scalars['Boolean'];
  tooltip: Scalars['String'];
  minDate: Maybe<Scalars['String']>;
  maxDate: Maybe<Scalars['String']>;
  defaultDate: Maybe<Scalars['String']>;
  includeTime: Scalars['Boolean'];
};


export type DbStat = {
  __typename?: 'DbStat';
  total: Scalars['Float'];
  state: Maybe<Scalars['String']>;
};

export type DeleteApiAccessTokenInput = {
  accessTokenId: Scalars['String'];
};

export type DeleteEquipmentAssignmentInput = {
  scheduledEventId: Scalars['ID'];
  proposalBookingId: Scalars['ID'];
  equipmentId: Scalars['ID'];
};

export type DeleteProposalWorkflowStatusInput = {
  proposalStatusId: Scalars['Int'];
  proposalWorkflowId: Scalars['Int'];
  sortOrder: Scalars['Int'];
};

export enum DependenciesLogicOperator {
  AND = 'AND',
  OR = 'OR'
}

export type EmailVerificationResponseWrap = {
  __typename?: 'EmailVerificationResponseWrap';
  rejection: Maybe<Rejection>;
  success: Maybe<Scalars['Boolean']>;
};

export type EmbellishmentConfig = {
  __typename?: 'EmbellishmentConfig';
  omitFromPdf: Scalars['Boolean'];
  html: Scalars['String'];
  plain: Scalars['String'];
};

export type Entry = {
  __typename?: 'Entry';
  id: Scalars['Int'];
  value: Scalars['String'];
};

export type Equipment = {
  __typename?: 'Equipment';
  id: Scalars['ID'];
  owner: Maybe<User>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  maintenanceStartsAt: Maybe<Scalars['TzLessDateTime']>;
  maintenanceEndsAt: Maybe<Scalars['TzLessDateTime']>;
  autoAccept: Scalars['Boolean'];
  events: Array<ScheduledEvent>;
  equipmentResponsible: Array<User>;
};


export type EquipmentEventsArgs = {
  endsAt: Scalars['TzLessDateTime'];
  startsAt: Scalars['TzLessDateTime'];
};

export enum EquipmentAssignmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export type EquipmentInput = {
  name: Scalars['String'];
  maintenanceStartsAt?: Maybe<Scalars['TzLessDateTime']>;
  maintenanceEndsAt?: Maybe<Scalars['TzLessDateTime']>;
  autoAccept: Scalars['Boolean'];
};

export type EquipmentResponseWrap = {
  __typename?: 'EquipmentResponseWrap';
  error: Maybe<Scalars['String']>;
  equipment: Maybe<Equipment>;
};

export type EquipmentResponsibleInput = {
  equipmentId: Scalars['ID'];
  userIds: Array<Scalars['Int']>;
};

export type EquipmentWithAssignmentStatus = {
  __typename?: 'EquipmentWithAssignmentStatus';
  id: Scalars['ID'];
  owner: Maybe<User>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  maintenanceStartsAt: Maybe<Scalars['TzLessDateTime']>;
  maintenanceEndsAt: Maybe<Scalars['TzLessDateTime']>;
  autoAccept: Scalars['Boolean'];
  events: Array<ScheduledEvent>;
  equipmentResponsible: Array<User>;
  status: EquipmentAssignmentStatus;
};


export type EquipmentWithAssignmentStatusEventsArgs = {
  endsAt: Scalars['TzLessDateTime'];
  startsAt: Scalars['TzLessDateTime'];
};

export enum EvaluatorOperator {
  EQ = 'eq',
  NEQ = 'neq'
}

export enum Event {
  PROPOSAL_CREATED = 'PROPOSAL_CREATED',
  PROPOSAL_UPDATED = 'PROPOSAL_UPDATED',
  PROPOSAL_SUBMITTED = 'PROPOSAL_SUBMITTED',
  PROPOSAL_FEASIBLE = 'PROPOSAL_FEASIBLE',
  PROPOSAL_UNFEASIBLE = 'PROPOSAL_UNFEASIBLE',
  PROPOSAL_SEP_SELECTED = 'PROPOSAL_SEP_SELECTED',
  PROPOSAL_INSTRUMENT_SELECTED = 'PROPOSAL_INSTRUMENT_SELECTED',
  PROPOSAL_FEASIBILITY_REVIEW_UPDATED = 'PROPOSAL_FEASIBILITY_REVIEW_UPDATED',
  PROPOSAL_FEASIBILITY_REVIEW_SUBMITTED = 'PROPOSAL_FEASIBILITY_REVIEW_SUBMITTED',
  PROPOSAL_SAMPLE_REVIEW_SUBMITTED = 'PROPOSAL_SAMPLE_REVIEW_SUBMITTED',
  PROPOSAL_SAMPLE_SAFE = 'PROPOSAL_SAMPLE_SAFE',
  PROPOSAL_ALL_SEP_REVIEWERS_SELECTED = 'PROPOSAL_ALL_SEP_REVIEWERS_SELECTED',
  PROPOSAL_SEP_REVIEW_UPDATED = 'PROPOSAL_SEP_REVIEW_UPDATED',
  PROPOSAL_SEP_REVIEW_SUBMITTED = 'PROPOSAL_SEP_REVIEW_SUBMITTED',
  PROPOSAL_ALL_SEP_REVIEWS_SUBMITTED = 'PROPOSAL_ALL_SEP_REVIEWS_SUBMITTED',
  PROPOSAL_SEP_MEETING_SAVED = 'PROPOSAL_SEP_MEETING_SAVED',
  PROPOSAL_SEP_MEETING_SUBMITTED = 'PROPOSAL_SEP_MEETING_SUBMITTED',
  PROPOSAL_SEP_MEETING_RANKING_OVERWRITTEN = 'PROPOSAL_SEP_MEETING_RANKING_OVERWRITTEN',
  PROPOSAL_SEP_MEETING_REORDER = 'PROPOSAL_SEP_MEETING_REORDER',
  PROPOSAL_MANAGEMENT_DECISION_UPDATED = 'PROPOSAL_MANAGEMENT_DECISION_UPDATED',
  PROPOSAL_MANAGEMENT_DECISION_SUBMITTED = 'PROPOSAL_MANAGEMENT_DECISION_SUBMITTED',
  PROPOSAL_INSTRUMENT_SUBMITTED = 'PROPOSAL_INSTRUMENT_SUBMITTED',
  PROPOSAL_ACCEPTED = 'PROPOSAL_ACCEPTED',
  PROPOSAL_REJECTED = 'PROPOSAL_REJECTED',
  PROPOSAL_STATUS_UPDATED = 'PROPOSAL_STATUS_UPDATED',
  CALL_ENDED = 'CALL_ENDED',
  CALL_REVIEW_ENDED = 'CALL_REVIEW_ENDED',
  CALL_SEP_REVIEW_ENDED = 'CALL_SEP_REVIEW_ENDED',
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_ROLE_UPDATED = 'USER_ROLE_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_PASSWORD_RESET_EMAIL = 'USER_PASSWORD_RESET_EMAIL',
  EMAIL_INVITE = 'EMAIL_INVITE',
  SEP_CREATED = 'SEP_CREATED',
  SEP_UPDATED = 'SEP_UPDATED',
  SEP_MEMBERS_ASSIGNED = 'SEP_MEMBERS_ASSIGNED',
  SEP_MEMBER_REMOVED = 'SEP_MEMBER_REMOVED',
  SEP_PROPOSAL_REMOVED = 'SEP_PROPOSAL_REMOVED',
  SEP_MEMBER_ASSIGNED_TO_PROPOSAL = 'SEP_MEMBER_ASSIGNED_TO_PROPOSAL',
  SEP_MEMBER_REMOVED_FROM_PROPOSAL = 'SEP_MEMBER_REMOVED_FROM_PROPOSAL',
  PROPOSAL_NOTIFIED = 'PROPOSAL_NOTIFIED',
  PROPOSAL_CLONED = 'PROPOSAL_CLONED',
  PROPOSAL_STATUS_CHANGED_BY_WORKFLOW = 'PROPOSAL_STATUS_CHANGED_BY_WORKFLOW',
  PROPOSAL_STATUS_CHANGED_BY_USER = 'PROPOSAL_STATUS_CHANGED_BY_USER'
}

export type EventLog = {
  __typename?: 'EventLog';
  id: Scalars['Int'];
  eventType: Scalars['String'];
  rowData: Scalars['String'];
  eventTStamp: Scalars['DateTime'];
  changedObjectId: Scalars['String'];
  changedBy: User;
};

export type Feature = {
  __typename?: 'Feature';
  id: FeatureId;
  isEnabled: Scalars['Boolean'];
  description: Scalars['String'];
};

export enum FeatureId {
  SHIPPING = 'SHIPPING',
  SCHEDULER = 'SCHEDULER',
  EXTERNAL_AUTH = 'EXTERNAL_AUTH'
}

export type FieldCondition = {
  __typename?: 'FieldCondition';
  condition: EvaluatorOperator;
  params: Scalars['IntStringDateBoolArray'];
};

export type FieldConditionInput = {
  condition: EvaluatorOperator;
  params: Scalars['String'];
};

export type FieldConfig = BooleanConfig | DateConfig | EmbellishmentConfig | FileUploadConfig | SelectionFromOptionsConfig | TextInputConfig | SampleBasisConfig | SubtemplateConfig | ProposalBasisConfig | IntervalConfig | NumberInputConfig | ShipmentBasisConfig | RichTextInputConfig | VisitBasisConfig;

export type FieldDependency = {
  __typename?: 'FieldDependency';
  questionId: Scalars['String'];
  dependencyId: Scalars['String'];
  dependencyNaturalKey: Scalars['String'];
  condition: FieldCondition;
};

export type FieldDependencyInput = {
  dependencyId: Scalars['String'];
  condition: FieldConditionInput;
};

export type Fields = {
  __typename?: 'Fields';
  nationalities: Array<Entry>;
  countries: Array<Entry>;
};

export type FileMetadata = {
  __typename?: 'FileMetadata';
  originalFileName: Scalars['String'];
  mimeType: Scalars['String'];
  sizeInBytes: Scalars['Int'];
  createdDate: Scalars['DateTime'];
  fileId: Scalars['String'];
};

export type FileUploadConfig = {
  __typename?: 'FileUploadConfig';
  small_label: Scalars['String'];
  required: Scalars['Boolean'];
  tooltip: Scalars['String'];
  file_type: Array<Scalars['String']>;
  max_files: Scalars['Int'];
};

export type HealthStats = {
  __typename?: 'HealthStats';
  message: Scalars['String'];
  dbStats: Array<DbStat>;
};

export type IndexWithGroupId = {
  index: Scalars['Int'];
  droppableId: Scalars['String'];
};

export type Institution = {
  __typename?: 'Institution';
  id: Scalars['Int'];
  name: Scalars['String'];
  verified: Scalars['Boolean'];
};

export type InstitutionResponseWrap = {
  __typename?: 'InstitutionResponseWrap';
  rejection: Maybe<Rejection>;
  institution: Maybe<Institution>;
};

export type InstitutionsFilter = {
  isVerified?: Maybe<Scalars['Boolean']>;
};

export type Instrument = {
  __typename?: 'Instrument';
  id: Scalars['Int'];
  name: Scalars['String'];
  shortCode: Scalars['String'];
  description: Scalars['String'];
  managerUserId: Scalars['Int'];
  scientists: Array<BasicUserDetails>;
};

export type InstrumentResponseWrap = {
  __typename?: 'InstrumentResponseWrap';
  rejection: Maybe<Rejection>;
  instrument: Maybe<Instrument>;
};

export type InstrumentWithAvailabilityTime = {
  __typename?: 'InstrumentWithAvailabilityTime';
  id: Scalars['Int'];
  name: Scalars['String'];
  shortCode: Scalars['String'];
  description: Scalars['String'];
  managerUserId: Scalars['Int'];
  scientists: Array<BasicUserDetails>;
  availabilityTime: Maybe<Scalars['Int']>;
  submitted: Maybe<Scalars['Boolean']>;
};

export type InstrumentsQueryResult = {
  __typename?: 'InstrumentsQueryResult';
  totalCount: Scalars['Int'];
  instruments: Array<Instrument>;
};


export type IntervalConfig = {
  __typename?: 'IntervalConfig';
  small_label: Scalars['String'];
  required: Scalars['Boolean'];
  tooltip: Scalars['String'];
  units: Maybe<Array<Scalars['String']>>;
};

export type LostTime = {
  __typename?: 'LostTime';
  id: Scalars['ID'];
  proposalBookingId: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  startsAt: Scalars['TzLessDateTime'];
  endsAt: Scalars['TzLessDateTime'];
};

export type LostTimesResponseWrap = {
  __typename?: 'LostTimesResponseWrap';
  error: Maybe<Scalars['String']>;
  lostTime: Maybe<Array<LostTime>>;
};

export type MoveProposalWorkflowStatusInput = {
  from: IndexWithGroupId;
  to: IndexWithGroupId;
  proposalWorkflowId: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createApiAccessToken: ApiAccessTokenResponseWrap;
  createInstitution: InstitutionResponseWrap;
  createUnit: UnitResponseWrap;
  deleteApiAccessToken: SuccessResponseWrap;
  updateApiAccessToken: ApiAccessTokenResponseWrap;
  updateInstitution: InstitutionResponseWrap;
  createCall: CallResponseWrap;
  updateCall: CallResponseWrap;
  assignInstrumentsToCall: CallResponseWrap;
  removeAssignedInstrumentFromCall: CallResponseWrap;
  changeProposalsStatus: SuccessResponseWrap;
  assignProposalsToInstrument: SuccessResponseWrap;
  removeProposalsFromInstrument: SuccessResponseWrap;
  assignScientistsToInstrument: SuccessResponseWrap;
  removeScientistFromInstrument: SuccessResponseWrap;
  createInstrument: InstrumentResponseWrap;
  updateInstrument: InstrumentResponseWrap;
  setInstrumentAvailabilityTime: SuccessResponseWrap;
  submitInstrument: SuccessResponseWrap;
  administrationProposal: ProposalResponseWrap;
  cloneProposal: ProposalResponseWrap;
  updateProposal: ProposalResponseWrap;
  addProposalWorkflowStatus: ProposalWorkflowConnectionResponseWrap;
  addStatusChangingEventsToConnection: ProposalStatusChangingEventResponseWrap;
  createProposalStatus: ProposalStatusResponseWrap;
  createProposalWorkflow: ProposalWorkflowResponseWrap;
  deleteProposalWorkflowStatus: SuccessResponseWrap;
  moveProposalWorkflowStatus: ProposalWorkflowConnectionResponseWrap;
  updateProposalStatus: ProposalStatusResponseWrap;
  updateProposalWorkflow: ProposalWorkflowResponseWrap;
  answerTopic: QuestionaryStepResponseWrap;
  createQuestionary: QuestionaryResponseWrap;
  updateAnswer: UpdateAnswerResponseWrap;
  addReview: ReviewWithNextStatusResponseWrap;
  addUserForReview: ReviewResponseWrap;
  submitProposalsReview: SuccessResponseWrap;
  updateTechnicalReviewAssignee: ProposalsResponseWrap;
  createSample: SampleResponseWrap;
  updateSample: SampleResponseWrap;
  assignChairOrSecretary: SepResponseWrap;
  assignReviewersToSEP: SepResponseWrap;
  removeMemberFromSep: SepResponseWrap;
  assignSepReviewersToProposal: SepResponseWrap;
  removeMemberFromSEPProposal: SepResponseWrap;
  assignProposalsToSep: NextProposalStatusResponseWrap;
  removeProposalsFromSep: SepResponseWrap;
  createSEP: SepResponseWrap;
  reorderSepMeetingDecisionProposals: SepMeetingDecisionResponseWrap;
  saveSepMeetingDecision: SepMeetingDecisionResponseWrap;
  updateSEP: SepResponseWrap;
  updateSEPTimeAllocation: SepProposalResponseWrap;
  createShipment: ShipmentResponseWrap;
  updateShipment: ShipmentResponseWrap;
  createQuestion: QuestionResponseWrap;
  createQuestionTemplateRelation: TemplateResponseWrap;
  createTemplate: TemplateResponseWrap;
  createTopic: TemplateResponseWrap;
  deleteQuestionTemplateRelation: TemplateResponseWrap;
  setActiveTemplate: SuccessResponseWrap;
  updateQuestion: QuestionResponseWrap;
  updateQuestionTemplateRelation: TemplateResponseWrap;
  updateQuestionTemplateRelationSettings: TemplateResponseWrap;
  updateTemplate: TemplateResponseWrap;
  updateTopic: TemplateResponseWrap;
  addUserRole: AddUserRoleResponseWrap;
  createUserByEmailInvite: CreateUserByEmailInviteResponseWrap;
  createUser: UserResponseWrap;
  updateUser: UserResponseWrap;
  updateUserRoles: UserResponseWrap;
  setUserEmailVerified: UserResponseWrap;
  setUserNotPlaceholder: UserResponseWrap;
  addClientLog: SuccessResponseWrap;
  addSamplesToShipment: ShipmentResponseWrap;
  addTechnicalReview: TechnicalReviewResponseWrap;
  applyPatches: PrepareDbResponseWrap;
  checkExternalToken: CheckExternalTokenWrap;
  cloneSample: SampleResponseWrap;
  cloneTemplate: TemplateResponseWrap;
  createProposal: ProposalResponseWrap;
  createVisit: VisitResponseWrap;
  deleteCall: CallResponseWrap;
  deleteInstitution: InstitutionResponseWrap;
  deleteInstrument: InstrumentResponseWrap;
  deleteProposal: ProposalResponseWrap;
  deleteQuestion: QuestionResponseWrap;
  deleteSample: SampleResponseWrap;
  deleteSEP: SepResponseWrap;
  deleteShipment: ShipmentResponseWrap;
  deleteTemplate: TemplateResponseWrap;
  deleteTopic: TemplateResponseWrap;
  deleteUnit: UnitResponseWrap;
  deleteUser: UserResponseWrap;
  deleteVisit: VisitResponseWrap;
  emailVerification: EmailVerificationResponseWrap;
  getTokenForUser: TokenResponseWrap;
  login: TokenResponseWrap;
  notifyProposal: ProposalResponseWrap;
  prepareDB: PrepareDbResponseWrap;
  removeUserForReview: ReviewResponseWrap;
  resetPasswordEmail: SuccessResponseWrap;
  resetPassword: BasicUserDetailsResponseWrap;
  setPageContent: PageResponseWrap;
  deleteProposalStatus: ProposalStatusResponseWrap;
  deleteProposalWorkflow: ProposalWorkflowResponseWrap;
  submitProposal: ProposalResponseWrap;
  submitShipment: ShipmentResponseWrap;
  submitTechnicalReview: TechnicalReviewResponseWrap;
  token: TokenResponseWrap;
  selectRole: TokenResponseWrap;
  updatePassword: BasicUserDetailsResponseWrap;
  updateVisit: VisitResponseWrap;
  createEquipment: EquipmentResponseWrap;
  updateEquipment: EquipmentResponseWrap;
  assignToScheduledEvents: Scalars['Boolean'];
  deleteEquipmentAssignment: Scalars['Boolean'];
  confirmEquipmentAssignment: Scalars['Boolean'];
  addEquipmentResponsible: Scalars['Boolean'];
  bulkUpsertLostTimes: LostTimesResponseWrap;
  createScheduledEvent: ScheduledEventResponseWrap;
  bulkUpsertScheduledEvents: ScheduledEventsResponseWrap;
  finalizeProposalBooking: ProposalBookingResponseWrap;
  activateProposalBooking: ProposalBookingResponseWrap;
  resetSchedulerDb: Scalars['String'];
};


export type MutationCreateApiAccessTokenArgs = {
  createApiAccessTokenInput: CreateApiAccessTokenInput;
};


export type MutationCreateInstitutionArgs = {
  name: Scalars['String'];
  verified: Scalars['Boolean'];
};


export type MutationCreateUnitArgs = {
  name: Scalars['String'];
};


export type MutationDeleteApiAccessTokenArgs = {
  deleteApiAccessTokenInput: DeleteApiAccessTokenInput;
};


export type MutationUpdateApiAccessTokenArgs = {
  updateApiAccessTokenInput: UpdateApiAccessTokenInput;
};


export type MutationUpdateInstitutionArgs = {
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  verified?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateCallArgs = {
  createCallInput: CreateCallInput;
};


export type MutationUpdateCallArgs = {
  updateCallInput: UpdateCallInput;
};


export type MutationAssignInstrumentsToCallArgs = {
  assignInstrumentsToCallInput: AssignInstrumentsToCallInput;
};


export type MutationRemoveAssignedInstrumentFromCallArgs = {
  removeAssignedInstrumentFromCallInput: RemoveAssignedInstrumentFromCallInput;
};


export type MutationChangeProposalsStatusArgs = {
  changeProposalsStatusInput: ChangeProposalsStatusInput;
};


export type MutationAssignProposalsToInstrumentArgs = {
  proposals: Array<ProposalPkWithCallId>;
  instrumentId: Scalars['Int'];
};


export type MutationRemoveProposalsFromInstrumentArgs = {
  proposalPks: Array<Scalars['Int']>;
};


export type MutationAssignScientistsToInstrumentArgs = {
  scientistIds: Array<Scalars['Int']>;
  instrumentId: Scalars['Int'];
};


export type MutationRemoveScientistFromInstrumentArgs = {
  scientistId: Scalars['Int'];
  instrumentId: Scalars['Int'];
};


export type MutationCreateInstrumentArgs = {
  name: Scalars['String'];
  shortCode: Scalars['String'];
  description: Scalars['String'];
  managerUserId: Scalars['Int'];
};


export type MutationUpdateInstrumentArgs = {
  id: Scalars['Int'];
  name: Scalars['String'];
  shortCode: Scalars['String'];
  description: Scalars['String'];
  managerUserId: Scalars['Int'];
};


export type MutationSetInstrumentAvailabilityTimeArgs = {
  instrumentId: Scalars['Int'];
  callId: Scalars['Int'];
  availabilityTime: Scalars['Int'];
};


export type MutationSubmitInstrumentArgs = {
  instrumentId: Scalars['Int'];
  callId: Scalars['Int'];
  sepId: Scalars['Int'];
};


export type MutationAdministrationProposalArgs = {
  proposalPk: Scalars['Int'];
  commentForUser?: Maybe<Scalars['String']>;
  commentForManagement?: Maybe<Scalars['String']>;
  finalStatus?: Maybe<ProposalEndStatus>;
  statusId?: Maybe<Scalars['Int']>;
  managementTimeAllocation?: Maybe<Scalars['Int']>;
  managementDecisionSubmitted?: Maybe<Scalars['Boolean']>;
};


export type MutationCloneProposalArgs = {
  cloneProposalInput: CloneProposalInput;
};


export type MutationUpdateProposalArgs = {
  primaryKey: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
  abstract?: Maybe<Scalars['String']>;
  users?: Maybe<Array<Scalars['Int']>>;
  proposerId?: Maybe<Scalars['Int']>;
};


export type MutationAddProposalWorkflowStatusArgs = {
  newProposalWorkflowStatusInput: AddProposalWorkflowStatusInput;
};


export type MutationAddStatusChangingEventsToConnectionArgs = {
  addStatusChangingEventsToConnectionInput: AddStatusChangingEventsToConnectionInput;
};


export type MutationCreateProposalStatusArgs = {
  newProposalStatusInput: CreateProposalStatusInput;
};


export type MutationCreateProposalWorkflowArgs = {
  newProposalWorkflowInput: CreateProposalWorkflowInput;
};


export type MutationDeleteProposalWorkflowStatusArgs = {
  deleteProposalWorkflowStatusInput: DeleteProposalWorkflowStatusInput;
};


export type MutationMoveProposalWorkflowStatusArgs = {
  moveProposalWorkflowStatusInput: MoveProposalWorkflowStatusInput;
};


export type MutationUpdateProposalStatusArgs = {
  updatedProposalStatusInput: UpdateProposalStatusInput;
};


export type MutationUpdateProposalWorkflowArgs = {
  updatedProposalWorkflowInput: UpdateProposalWorkflowInput;
};


export type MutationAnswerTopicArgs = {
  questionaryId: Scalars['Int'];
  topicId: Scalars['Int'];
  answers: Array<AnswerInput>;
  isPartialSave?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateQuestionaryArgs = {
  templateId: Scalars['Int'];
};


export type MutationUpdateAnswerArgs = {
  questionaryId: Scalars['Int'];
  answer: AnswerInput;
};


export type MutationAddReviewArgs = {
  reviewID: Scalars['Int'];
  comment: Scalars['String'];
  grade: Scalars['Int'];
  status: ReviewStatus;
  sepID: Scalars['Int'];
};


export type MutationAddUserForReviewArgs = {
  userID: Scalars['Int'];
  proposalPk: Scalars['Int'];
  sepID: Scalars['Int'];
};


export type MutationSubmitProposalsReviewArgs = {
  submitProposalsReviewInput: SubmitProposalsReviewInput;
};


export type MutationUpdateTechnicalReviewAssigneeArgs = {
  userId: Scalars['Int'];
  proposalPks: Array<Scalars['Int']>;
};


export type MutationCreateSampleArgs = {
  title: Scalars['String'];
  templateId: Scalars['Int'];
  proposalPk: Scalars['Int'];
  questionId: Scalars['String'];
};


export type MutationUpdateSampleArgs = {
  sampleId: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
  safetyComment?: Maybe<Scalars['String']>;
  safetyStatus?: Maybe<SampleStatus>;
};


export type MutationAssignChairOrSecretaryArgs = {
  assignChairOrSecretaryToSEPInput: AssignChairOrSecretaryToSepInput;
};


export type MutationAssignReviewersToSepArgs = {
  memberIds: Array<Scalars['Int']>;
  sepId: Scalars['Int'];
};


export type MutationRemoveMemberFromSepArgs = {
  memberId: Scalars['Int'];
  sepId: Scalars['Int'];
  roleId: UserRole;
};


export type MutationAssignSepReviewersToProposalArgs = {
  memberIds: Array<Scalars['Int']>;
  sepId: Scalars['Int'];
  proposalPk: Scalars['Int'];
};


export type MutationRemoveMemberFromSepProposalArgs = {
  memberId: Scalars['Int'];
  sepId: Scalars['Int'];
  proposalPk: Scalars['Int'];
};


export type MutationAssignProposalsToSepArgs = {
  proposals: Array<ProposalPkWithCallId>;
  sepId: Scalars['Int'];
};


export type MutationRemoveProposalsFromSepArgs = {
  proposalPks: Array<Scalars['Int']>;
  sepId: Scalars['Int'];
};


export type MutationCreateSepArgs = {
  code: Scalars['String'];
  description: Scalars['String'];
  numberRatingsRequired?: Maybe<Scalars['Int']>;
  active: Scalars['Boolean'];
};


export type MutationReorderSepMeetingDecisionProposalsArgs = {
  reorderSepMeetingDecisionProposalsInput: ReorderSepMeetingDecisionProposalsInput;
};


export type MutationSaveSepMeetingDecisionArgs = {
  saveSepMeetingDecisionInput: SaveSepMeetingDecisionInput;
};


export type MutationUpdateSepArgs = {
  id: Scalars['Int'];
  code: Scalars['String'];
  description: Scalars['String'];
  numberRatingsRequired?: Maybe<Scalars['Int']>;
  active: Scalars['Boolean'];
};


export type MutationUpdateSepTimeAllocationArgs = {
  sepId: Scalars['Int'];
  proposalPk: Scalars['Int'];
  sepTimeAllocation?: Maybe<Scalars['Int']>;
};


export type MutationCreateShipmentArgs = {
  title: Scalars['String'];
  proposalPk: Scalars['Int'];
};


export type MutationUpdateShipmentArgs = {
  shipmentId: Scalars['Int'];
  proposalPk?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  status?: Maybe<ShipmentStatus>;
  externalRef?: Maybe<Scalars['String']>;
};


export type MutationCreateQuestionArgs = {
  categoryId: TemplateCategoryId;
  dataType: DataType;
};


export type MutationCreateQuestionTemplateRelationArgs = {
  templateId: Scalars['Int'];
  questionId: Scalars['String'];
  sortOrder: Scalars['Int'];
  topicId: Scalars['Int'];
};


export type MutationCreateTemplateArgs = {
  categoryId: TemplateCategoryId;
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};


export type MutationCreateTopicArgs = {
  templateId: Scalars['Int'];
  sortOrder?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['Int']>;
};


export type MutationDeleteQuestionTemplateRelationArgs = {
  questionId: Scalars['String'];
  templateId: Scalars['Int'];
};


export type MutationSetActiveTemplateArgs = {
  templateCategoryId: TemplateCategoryId;
  templateId: Scalars['Int'];
};


export type MutationUpdateQuestionArgs = {
  id: Scalars['String'];
  naturalKey?: Maybe<Scalars['String']>;
  question?: Maybe<Scalars['String']>;
  config?: Maybe<Scalars['String']>;
};


export type MutationUpdateQuestionTemplateRelationArgs = {
  questionId: Scalars['String'];
  templateId: Scalars['Int'];
  topicId?: Maybe<Scalars['Int']>;
  sortOrder: Scalars['Int'];
  config?: Maybe<Scalars['String']>;
};


export type MutationUpdateQuestionTemplateRelationSettingsArgs = {
  questionId: Scalars['String'];
  templateId: Scalars['Int'];
  config?: Maybe<Scalars['String']>;
  dependencies: Array<FieldDependencyInput>;
  dependenciesOperator?: Maybe<DependenciesLogicOperator>;
};


export type MutationUpdateTemplateArgs = {
  templateId: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  isArchived?: Maybe<Scalars['Boolean']>;
};


export type MutationUpdateTopicArgs = {
  id: Scalars['Int'];
  templateId?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['Int']>;
  isEnabled?: Maybe<Scalars['Boolean']>;
};


export type MutationAddUserRoleArgs = {
  userID: Scalars['Int'];
  roleID: Scalars['Int'];
};


export type MutationCreateUserByEmailInviteArgs = {
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  email: Scalars['String'];
  userRole: UserRole;
};


export type MutationCreateUserArgs = {
  user_title?: Maybe<Scalars['String']>;
  firstname: Scalars['String'];
  middlename?: Maybe<Scalars['String']>;
  lastname: Scalars['String'];
  password: Scalars['String'];
  preferredname?: Maybe<Scalars['String']>;
  orcid: Scalars['String'];
  orcidHash: Scalars['String'];
  refreshToken: Scalars['String'];
  gender: Scalars['String'];
  nationality: Scalars['Int'];
  birthdate: Scalars['String'];
  organisation: Scalars['Int'];
  department: Scalars['String'];
  position: Scalars['String'];
  email: Scalars['String'];
  telephone: Scalars['String'];
  telephone_alt?: Maybe<Scalars['String']>;
  otherOrganisation?: Maybe<Scalars['String']>;
};


export type MutationUpdateUserArgs = {
  id: Scalars['Int'];
  user_title?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  middlename?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  preferredname?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  nationality?: Maybe<Scalars['Int']>;
  birthdate?: Maybe<Scalars['String']>;
  organisation?: Maybe<Scalars['Int']>;
  department?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  telephone?: Maybe<Scalars['String']>;
  telephone_alt?: Maybe<Scalars['String']>;
  placeholder?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Scalars['Int']>>;
  orcid?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
};


export type MutationUpdateUserRolesArgs = {
  id: Scalars['Int'];
  roles?: Maybe<Array<Scalars['Int']>>;
};


export type MutationSetUserEmailVerifiedArgs = {
  id: Scalars['Int'];
};


export type MutationSetUserNotPlaceholderArgs = {
  id: Scalars['Int'];
};


export type MutationAddClientLogArgs = {
  error: Scalars['String'];
};


export type MutationAddSamplesToShipmentArgs = {
  shipmentId: Scalars['Int'];
  sampleIds: Array<Scalars['Int']>;
};


export type MutationAddTechnicalReviewArgs = {
  addTechnicalReviewInput: AddTechnicalReviewInput;
};


export type MutationCheckExternalTokenArgs = {
  externalToken: Scalars['String'];
};


export type MutationCloneSampleArgs = {
  sampleId: Scalars['Int'];
};


export type MutationCloneTemplateArgs = {
  templateId: Scalars['Int'];
};


export type MutationCreateProposalArgs = {
  callId: Scalars['Int'];
};


export type MutationCreateVisitArgs = {
  proposalPk: Scalars['Int'];
  team?: Maybe<Array<Scalars['Int']>>;
};


export type MutationDeleteCallArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteInstitutionArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteInstrumentArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteProposalArgs = {
  proposalPk: Scalars['Int'];
};


export type MutationDeleteQuestionArgs = {
  questionId: Scalars['String'];
};


export type MutationDeleteSampleArgs = {
  sampleId: Scalars['Int'];
};


export type MutationDeleteSepArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteShipmentArgs = {
  shipmentId: Scalars['Int'];
};


export type MutationDeleteTemplateArgs = {
  templateId: Scalars['Int'];
};


export type MutationDeleteTopicArgs = {
  topicId: Scalars['Int'];
};


export type MutationDeleteUnitArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteVisitArgs = {
  visitId: Scalars['Int'];
};


export type MutationEmailVerificationArgs = {
  token: Scalars['String'];
};


export type MutationGetTokenForUserArgs = {
  userId: Scalars['Int'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationNotifyProposalArgs = {
  id: Scalars['Int'];
};


export type MutationPrepareDbArgs = {
  includeSeeds?: Maybe<Scalars['Boolean']>;
};


export type MutationRemoveUserForReviewArgs = {
  sepId: Scalars['Int'];
  reviewId: Scalars['Int'];
};


export type MutationResetPasswordEmailArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  token: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSetPageContentArgs = {
  text: Scalars['String'];
  id: PageName;
};


export type MutationDeleteProposalStatusArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteProposalWorkflowArgs = {
  id: Scalars['Int'];
};


export type MutationSubmitProposalArgs = {
  proposalPk: Scalars['Int'];
};


export type MutationSubmitShipmentArgs = {
  shipmentId: Scalars['Int'];
};


export type MutationSubmitTechnicalReviewArgs = {
  submitTechnicalReviewInput: SubmitTechnicalReviewInput;
};


export type MutationTokenArgs = {
  token: Scalars['String'];
};


export type MutationSelectRoleArgs = {
  token: Scalars['String'];
  selectedRoleId?: Maybe<Scalars['Int']>;
};


export type MutationUpdatePasswordArgs = {
  id: Scalars['Int'];
  password: Scalars['String'];
};


export type MutationUpdateVisitArgs = {
  visitId: Scalars['Int'];
  status?: Maybe<VisitStatus>;
  proposalPk?: Maybe<Scalars['Int']>;
  team?: Maybe<Array<Scalars['Int']>>;
};


export type MutationCreateEquipmentArgs = {
  newEquipmentInput: EquipmentInput;
};


export type MutationUpdateEquipmentArgs = {
  updateEquipmentInput: EquipmentInput;
  id: Scalars['ID'];
};


export type MutationAssignToScheduledEventsArgs = {
  assignEquipmentsToScheduledEventInput: AssignEquipmentsToScheduledEventInput;
};


export type MutationDeleteEquipmentAssignmentArgs = {
  deleteEquipmentAssignmentInput: DeleteEquipmentAssignmentInput;
};


export type MutationConfirmEquipmentAssignmentArgs = {
  confirmEquipmentAssignmentInput: ConfirmEquipmentAssignmentInput;
};


export type MutationAddEquipmentResponsibleArgs = {
  equipmentResponsibleInput: EquipmentResponsibleInput;
};


export type MutationBulkUpsertLostTimesArgs = {
  bulkUpsertLostTimes: BulkUpsertLostTimesInput;
};


export type MutationCreateScheduledEventArgs = {
  newScheduledEvent: NewScheduledEventInput;
};


export type MutationBulkUpsertScheduledEventsArgs = {
  bulkUpsertScheduledEvents: BulkUpsertScheduledEventsInput;
};


export type MutationFinalizeProposalBookingArgs = {
  id: Scalars['ID'];
  action: ProposalBookingFinalizeAction;
};


export type MutationActivateProposalBookingArgs = {
  id: Scalars['ID'];
};


export type MutationResetSchedulerDbArgs = {
  includeSeeds?: Maybe<Scalars['Boolean']>;
};

export type NewScheduledEventInput = {
  bookingType: ScheduledEventBookingType;
  startsAt: Scalars['TzLessDateTime'];
  endsAt: Scalars['TzLessDateTime'];
  description?: Maybe<Scalars['String']>;
  instrumentId: Scalars['ID'];
};

export type NextProposalStatus = {
  __typename?: 'NextProposalStatus';
  id: Maybe<Scalars['Int']>;
  shortCode: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  isDefault: Maybe<Scalars['Boolean']>;
};

export type NextProposalStatusResponseWrap = {
  __typename?: 'NextProposalStatusResponseWrap';
  rejection: Maybe<Rejection>;
  nextProposalStatus: Maybe<NextProposalStatus>;
};

export type NumberInputConfig = {
  __typename?: 'NumberInputConfig';
  small_label: Scalars['String'];
  required: Scalars['Boolean'];
  tooltip: Scalars['String'];
  units: Maybe<Array<Scalars['String']>>;
  numberValueConstraint: Maybe<NumberValueConstraint>;
};

export enum NumberValueConstraint {
  NONE = 'NONE',
  ONLY_POSITIVE = 'ONLY_POSITIVE',
  ONLY_NEGATIVE = 'ONLY_NEGATIVE'
}

export type OrcIdInformation = {
  __typename?: 'OrcIDInformation';
  firstname: Maybe<Scalars['String']>;
  lastname: Maybe<Scalars['String']>;
  orcid: Maybe<Scalars['String']>;
  orcidHash: Maybe<Scalars['String']>;
  refreshToken: Maybe<Scalars['String']>;
  token: Maybe<Scalars['String']>;
};

export type Page = {
  __typename?: 'Page';
  id: Scalars['Int'];
  content: Maybe<Scalars['String']>;
};

export enum PageName {
  HOMEPAGE = 'HOMEPAGE',
  HELPPAGE = 'HELPPAGE',
  PRIVACYPAGE = 'PRIVACYPAGE',
  COOKIEPAGE = 'COOKIEPAGE',
  REVIEWPAGE = 'REVIEWPAGE',
  FOOTERCONTENT = 'FOOTERCONTENT'
}

export type PageResponseWrap = {
  __typename?: 'PageResponseWrap';
  rejection: Maybe<Rejection>;
  page: Maybe<Page>;
};

export type PermissionsWithAccessToken = {
  __typename?: 'PermissionsWithAccessToken';
  id: Scalars['String'];
  name: Scalars['String'];
  accessToken: Scalars['String'];
  accessPermissions: Scalars['String'];
};

export type PrepareDbResponseWrap = {
  __typename?: 'PrepareDBResponseWrap';
  rejection: Maybe<Rejection>;
  log: Maybe<Scalars['String']>;
};

export type Proposal = {
  __typename?: 'Proposal';
  primaryKey: Scalars['Int'];
  title: Scalars['String'];
  abstract: Scalars['String'];
  statusId: Scalars['Int'];
  created: Scalars['DateTime'];
  updated: Scalars['DateTime'];
  shortCode: Scalars['String'];
  finalStatus: Maybe<ProposalEndStatus>;
  callId: Scalars['Int'];
  questionaryId: Scalars['Int'];
  commentForUser: Maybe<Scalars['String']>;
  commentForManagement: Maybe<Scalars['String']>;
  notified: Scalars['Boolean'];
  submitted: Scalars['Boolean'];
  managementTimeAllocation: Maybe<Scalars['Int']>;
  managementDecisionSubmitted: Scalars['Boolean'];
  technicalReviewAssignee: Maybe<Scalars['Int']>;
  users: Array<BasicUserDetails>;
  proposer: Maybe<BasicUserDetails>;
  status: Maybe<ProposalStatus>;
  publicStatus: ProposalPublicStatus;
  reviews: Maybe<Array<Review>>;
  technicalReview: Maybe<TechnicalReview>;
  instrument: Maybe<Instrument>;
  sep: Maybe<Sep>;
  call: Maybe<Call>;
  questionary: Maybe<Questionary>;
  sepMeetingDecision: Maybe<SepMeetingDecision>;
  samples: Maybe<Array<Sample>>;
  visits: Maybe<Array<Visit>>;
  proposalBooking: Maybe<ProposalBooking>;
};


export type ProposalProposalBookingArgs = {
  filter?: Maybe<ProposalProposalBookingFilter>;
};

export type ProposalBasisConfig = {
  __typename?: 'ProposalBasisConfig';
  tooltip: Scalars['String'];
};

export type ProposalBooking = {
  __typename?: 'ProposalBooking';
  id: Scalars['ID'];
  call: Maybe<Call>;
  proposal: Maybe<Proposal>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  status: ProposalBookingStatus;
  allocatedTime: Scalars['Int'];
  instrument: Maybe<Instrument>;
  scheduledEvents: Array<ScheduledEvent>;
};


export type ProposalBookingScheduledEventsArgs = {
  filter: ProposalBookingScheduledEventFilter;
};

export enum ProposalBookingFinalizeAction {
  CLOSE = 'CLOSE',
  RESTART = 'RESTART'
}

export type ProposalBookingResponseWrap = {
  __typename?: 'ProposalBookingResponseWrap';
  error: Maybe<Scalars['String']>;
  proposalBooking: Maybe<ProposalBooking>;
};

export type ProposalBookingScheduledEventFilter = {
  bookingType?: Maybe<ScheduledEventBookingType>;
  endsAfter?: Maybe<Scalars['TzLessDateTime']>;
  endsBefore?: Maybe<Scalars['TzLessDateTime']>;
};

export enum ProposalBookingStatus {
  DRAFT = 'DRAFT',
  BOOKED = 'BOOKED',
  CLOSED = 'CLOSED'
}

export enum ProposalEndStatus {
  UNSET = 'UNSET',
  ACCEPTED = 'ACCEPTED',
  RESERVED = 'RESERVED',
  REJECTED = 'REJECTED'
}

export type ProposalEvent = {
  __typename?: 'ProposalEvent';
  name: Event;
  description: Maybe<Scalars['String']>;
};

export type ProposalPkWithCallId = {
  primaryKey: Scalars['Int'];
  callId: Scalars['Int'];
};

export type ProposalPkWithRankOrder = {
  proposalPk: Scalars['Int'];
  rankOrder: Scalars['Int'];
};

export type ProposalPkWithReviewId = {
  proposalPk: Scalars['Int'];
  reviewId: Scalars['Int'];
};

export type ProposalProposalBookingFilter = {
  status?: Maybe<Array<ProposalBookingStatus>>;
};

export enum ProposalPublicStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  UNKNOWN = 'unknown',
  RESERVED = 'reserved'
}

export type ProposalResponseWrap = {
  __typename?: 'ProposalResponseWrap';
  rejection: Maybe<Rejection>;
  proposal: Maybe<Proposal>;
};

export type ProposalStatus = {
  __typename?: 'ProposalStatus';
  id: Scalars['Int'];
  shortCode: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  isDefault: Scalars['Boolean'];
};

export type ProposalStatusChangingEventResponseWrap = {
  __typename?: 'ProposalStatusChangingEventResponseWrap';
  rejection: Maybe<Rejection>;
  statusChangingEvents: Maybe<Array<StatusChangingEvent>>;
};

export type ProposalStatusResponseWrap = {
  __typename?: 'ProposalStatusResponseWrap';
  rejection: Maybe<Rejection>;
  proposalStatus: Maybe<ProposalStatus>;
};

export type ProposalTemplate = {
  __typename?: 'ProposalTemplate';
  templateId: Scalars['Int'];
  categoryId: TemplateCategoryId;
  name: Scalars['String'];
  description: Maybe<Scalars['String']>;
  isArchived: Scalars['Boolean'];
  steps: Array<TemplateStep>;
  complementaryQuestions: Array<Question>;
  questionaryCount: Scalars['Int'];
  callCount: Scalars['Int'];
};

export type ProposalTemplatesFilter = {
  isArchived?: Maybe<Scalars['Boolean']>;
};

export type ProposalView = {
  __typename?: 'ProposalView';
  primaryKey: Scalars['Int'];
  title: Scalars['String'];
  statusId: Scalars['Int'];
  statusName: Scalars['String'];
  statusDescription: Scalars['String'];
  shortCode: Scalars['String'];
  rankOrder: Maybe<Scalars['Int']>;
  finalStatus: Maybe<ProposalEndStatus>;
  notified: Scalars['Boolean'];
  submitted: Scalars['Boolean'];
  timeAllocation: Maybe<Scalars['Int']>;
  technicalStatus: Maybe<TechnicalReviewStatus>;
  instrumentName: Maybe<Scalars['String']>;
  callShortCode: Maybe<Scalars['String']>;
  sepCode: Maybe<Scalars['String']>;
  sepId: Maybe<Scalars['Int']>;
  reviewAverage: Maybe<Scalars['Float']>;
  reviewDeviation: Maybe<Scalars['Float']>;
  instrumentId: Maybe<Scalars['Int']>;
  callId: Scalars['Int'];
  allocationTimeUnit: AllocationTimeUnits;
};

export type ProposalWorkflow = {
  __typename?: 'ProposalWorkflow';
  id: Scalars['Int'];
  name: Scalars['String'];
  description: Scalars['String'];
  proposalWorkflowConnectionGroups: Array<ProposalWorkflowConnectionGroup>;
};

export type ProposalWorkflowConnection = {
  __typename?: 'ProposalWorkflowConnection';
  id: Scalars['Int'];
  sortOrder: Scalars['Int'];
  proposalWorkflowId: Scalars['Int'];
  proposalStatusId: Scalars['Int'];
  proposalStatus: ProposalStatus;
  nextProposalStatusId: Maybe<Scalars['Int']>;
  prevProposalStatusId: Maybe<Scalars['Int']>;
  droppableGroupId: Scalars['String'];
  statusChangingEvents: Array<StatusChangingEvent>;
};

export type ProposalWorkflowConnectionGroup = {
  __typename?: 'ProposalWorkflowConnectionGroup';
  groupId: Scalars['String'];
  parentGroupId: Maybe<Scalars['String']>;
  connections: Array<ProposalWorkflowConnection>;
};

export type ProposalWorkflowConnectionResponseWrap = {
  __typename?: 'ProposalWorkflowConnectionResponseWrap';
  rejection: Maybe<Rejection>;
  proposalWorkflowConnection: Maybe<ProposalWorkflowConnection>;
};

export type ProposalWorkflowResponseWrap = {
  __typename?: 'ProposalWorkflowResponseWrap';
  rejection: Maybe<Rejection>;
  proposalWorkflow: Maybe<ProposalWorkflow>;
};

export type ProposalsFilter = {
  text?: Maybe<Scalars['String']>;
  questionaryIds?: Maybe<Array<Scalars['Int']>>;
  callId?: Maybe<Scalars['Int']>;
  instrumentId?: Maybe<Scalars['Int']>;
  proposalStatusId?: Maybe<Scalars['Int']>;
  shortCodes?: Maybe<Array<Scalars['String']>>;
  questionFilter?: Maybe<QuestionFilterInput>;
};

export type ProposalsQueryResult = {
  __typename?: 'ProposalsQueryResult';
  totalCount: Scalars['Int'];
  proposals: Array<Proposal>;
};

export type ProposalsResponseWrap = {
  __typename?: 'ProposalsResponseWrap';
  rejection: Maybe<Rejection>;
  proposals: Array<Proposal>;
};

export type QueriesAndMutations = {
  __typename?: 'QueriesAndMutations';
  queries: Array<Scalars['String']>;
  mutations: Array<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  calls: Maybe<Array<Call>>;
  callsByInstrumentScientist: Maybe<Array<Call>>;
  proposals: Maybe<ProposalsQueryResult>;
  instrumentScientistProposals: Maybe<ProposalsQueryResult>;
  shipments: Maybe<Array<Shipment>>;
  questions: Array<QuestionWithUsage>;
  templates: Maybe<Array<Template>>;
  visits: Array<Visit>;
  myVisits: Array<Visit>;
  activeTemplateId: Maybe<Scalars['Int']>;
  basicUserDetails: Maybe<BasicUserDetails>;
  blankQuestionarySteps: Maybe<Array<QuestionaryStep>>;
  call: Maybe<Call>;
  checkEmailExist: Maybe<Scalars['Boolean']>;
  eventLogs: Maybe<Array<EventLog>>;
  features: Array<Feature>;
  fileMetadata: Maybe<Array<FileMetadata>>;
  allAccessTokensAndPermissions: Maybe<Array<PermissionsWithAccessToken>>;
  queriesAndMutations: Maybe<QueriesAndMutations>;
  accessTokenAndPermissions: Maybe<PermissionsWithAccessToken>;
  getFields: Maybe<Fields>;
  getOrcIDInformation: Maybe<OrcIdInformation>;
  getPageContent: Maybe<Scalars['String']>;
  institutions: Maybe<Array<Institution>>;
  instrument: Maybe<Instrument>;
  instruments: Maybe<InstrumentsQueryResult>;
  instrumentsBySep: Maybe<Array<InstrumentWithAvailabilityTime>>;
  userInstruments: Maybe<InstrumentsQueryResult>;
  instrumentScientistHasInstrument: Maybe<Scalars['Boolean']>;
  instrumentScientistHasAccess: Maybe<Scalars['Boolean']>;
  isNaturalKeyPresent: Maybe<Scalars['Boolean']>;
  myShipments: Maybe<Array<Shipment>>;
  proposal: Maybe<Proposal>;
  userHasAccessToProposal: Maybe<Scalars['Boolean']>;
  proposalStatus: Maybe<ProposalStatus>;
  proposalStatuses: Maybe<Array<ProposalStatus>>;
  proposalsView: Maybe<Array<ProposalView>>;
  proposalTemplates: Maybe<Array<ProposalTemplate>>;
  proposalWorkflow: Maybe<ProposalWorkflow>;
  proposalWorkflows: Maybe<Array<ProposalWorkflow>>;
  proposalEvents: Maybe<Array<ProposalEvent>>;
  questionary: Maybe<Questionary>;
  review: Maybe<Review>;
  proposalReviews: Maybe<Array<Review>>;
  roles: Maybe<Array<Role>>;
  sample: Maybe<Sample>;
  samplesByCallId: Maybe<Array<Sample>>;
  samples: Maybe<Array<Sample>>;
  sep: Maybe<Sep>;
  sepMembers: Maybe<Array<SepReviewer>>;
  sepReviewers: Maybe<Array<SepReviewer>>;
  sepProposals: Maybe<Array<SepProposal>>;
  sepProposal: Maybe<SepProposal>;
  sepProposalsByInstrument: Maybe<Array<SepProposal>>;
  seps: Maybe<SePsQueryResult>;
  settings: Array<Settings>;
  shipment: Maybe<Shipment>;
  version: Scalars['String'];
  factoryVersion: Scalars['String'];
  templateCategories: Maybe<Array<TemplateCategory>>;
  template: Maybe<Template>;
  checkToken: TokenResult;
  units: Maybe<Array<Unit>>;
  user: Maybe<User>;
  me: Maybe<User>;
  users: Maybe<UserQueryResult>;
  visit: Maybe<Visit>;
  scheduledEvents: Array<ScheduledEvent>;
  scheduledEvent: Maybe<ScheduledEvent>;
  proposalBookingScheduledEvents: Array<ScheduledEvent>;
  proposalBookingScheduledEvent: Maybe<ScheduledEvent>;
  equipments: Array<Equipment>;
  availableEquipments: Array<Equipment>;
  equipment: Maybe<Equipment>;
  proposalBookingLostTimes: Array<LostTime>;
  instrumentProposalBookings: Array<ProposalBooking>;
  proposalBooking: Maybe<ProposalBooking>;
  healthCheck: HealthStats;
  schedulerConfig: SchedulerConfig;
  schedulerVersion: Scalars['String'];
};


export type QueryCallsArgs = {
  filter?: Maybe<CallsFilter>;
};


export type QueryCallsByInstrumentScientistArgs = {
  scientistId: Scalars['Int'];
};


export type QueryProposalsArgs = {
  filter?: Maybe<ProposalsFilter>;
  first?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryInstrumentScientistProposalsArgs = {
  filter?: Maybe<ProposalsFilter>;
  first?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryShipmentsArgs = {
  filter?: Maybe<ShipmentsFilter>;
};


export type QueryQuestionsArgs = {
  filter?: Maybe<QuestionsFilter>;
};


export type QueryTemplatesArgs = {
  filter?: Maybe<TemplatesFilter>;
};


export type QueryVisitsArgs = {
  filter?: Maybe<VisitsFilter>;
};


export type QueryActiveTemplateIdArgs = {
  templateCategoryId: TemplateCategoryId;
};


export type QueryBasicUserDetailsArgs = {
  id: Scalars['Int'];
};


export type QueryBlankQuestionaryStepsArgs = {
  templateId: Scalars['Int'];
};


export type QueryCallArgs = {
  id: Scalars['Int'];
};


export type QueryCheckEmailExistArgs = {
  email: Scalars['String'];
};


export type QueryEventLogsArgs = {
  changedObjectId: Scalars['String'];
  eventType: Scalars['String'];
};


export type QueryFileMetadataArgs = {
  fileIds: Array<Scalars['String']>;
};


export type QueryAccessTokenAndPermissionsArgs = {
  accessTokenId: Scalars['String'];
};


export type QueryGetOrcIdInformationArgs = {
  authorizationCode: Scalars['String'];
};


export type QueryGetPageContentArgs = {
  id: PageName;
};


export type QueryInstitutionsArgs = {
  filter?: Maybe<InstitutionsFilter>;
};


export type QueryInstrumentArgs = {
  instrumentId: Scalars['Int'];
};


export type QueryInstrumentsArgs = {
  callIds?: Maybe<Array<Scalars['Int']>>;
};


export type QueryInstrumentsBySepArgs = {
  callId: Scalars['Int'];
  sepId: Scalars['Int'];
};


export type QueryInstrumentScientistHasInstrumentArgs = {
  instrumentId: Scalars['Int'];
};


export type QueryInstrumentScientistHasAccessArgs = {
  proposalPk: Scalars['Int'];
  instrumentId: Scalars['Int'];
};


export type QueryIsNaturalKeyPresentArgs = {
  naturalKey: Scalars['String'];
};


export type QueryProposalArgs = {
  id: Scalars['Int'];
};


export type QueryUserHasAccessToProposalArgs = {
  proposalPk: Scalars['Int'];
};


export type QueryProposalStatusArgs = {
  id: Scalars['Int'];
};


export type QueryProposalsViewArgs = {
  filter?: Maybe<ProposalsFilter>;
};


export type QueryProposalTemplatesArgs = {
  filter?: Maybe<ProposalTemplatesFilter>;
};


export type QueryProposalWorkflowArgs = {
  id: Scalars['Int'];
};


export type QueryQuestionaryArgs = {
  questionaryId: Scalars['Int'];
};


export type QueryReviewArgs = {
  sepId?: Maybe<Scalars['Int']>;
  reviewId: Scalars['Int'];
};


export type QueryProposalReviewsArgs = {
  proposalPk: Scalars['Int'];
};


export type QuerySampleArgs = {
  sampleId: Scalars['Int'];
};


export type QuerySamplesByCallIdArgs = {
  callId: Scalars['Int'];
};


export type QuerySamplesArgs = {
  filter?: Maybe<SamplesFilter>;
};


export type QuerySepArgs = {
  id: Scalars['Int'];
};


export type QuerySepMembersArgs = {
  sepId: Scalars['Int'];
};


export type QuerySepReviewersArgs = {
  sepId: Scalars['Int'];
};


export type QuerySepProposalsArgs = {
  callId: Scalars['Int'];
  sepId: Scalars['Int'];
};


export type QuerySepProposalArgs = {
  proposalPk: Scalars['Int'];
  sepId: Scalars['Int'];
};


export type QuerySepProposalsByInstrumentArgs = {
  callId: Scalars['Int'];
  instrumentId: Scalars['Int'];
  sepId: Scalars['Int'];
};


export type QuerySepsArgs = {
  active?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryShipmentArgs = {
  shipmentId: Scalars['Int'];
};


export type QueryTemplateArgs = {
  templateId: Scalars['Int'];
};


export type QueryCheckTokenArgs = {
  token: Scalars['String'];
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};


export type QueryUsersArgs = {
  filter?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  userRole?: Maybe<UserRole>;
  subtractUsers?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


export type QueryVisitArgs = {
  visitId: Scalars['Int'];
};


export type QueryScheduledEventsArgs = {
  filter: ScheduledEventFilter;
};


export type QueryScheduledEventArgs = {
  id: Scalars['ID'];
};


export type QueryProposalBookingScheduledEventsArgs = {
  proposalBookingId: Scalars['ID'];
};


export type QueryProposalBookingScheduledEventArgs = {
  scheduledEventId: Scalars['ID'];
  proposalBookingId: Scalars['ID'];
};


export type QueryEquipmentsArgs = {
  equipmentIds?: Maybe<Array<Scalars['Int']>>;
};


export type QueryAvailableEquipmentsArgs = {
  scheduledEventId: Scalars['ID'];
};


export type QueryEquipmentArgs = {
  id: Scalars['ID'];
};


export type QueryProposalBookingLostTimesArgs = {
  proposalBookingId: Scalars['ID'];
};


export type QueryInstrumentProposalBookingsArgs = {
  instrumentId: Scalars['ID'];
};


export type QueryProposalBookingArgs = {
  id: Scalars['ID'];
};

export type Question = {
  __typename?: 'Question';
  id: Scalars['String'];
  categoryId: TemplateCategoryId;
  naturalKey: Scalars['String'];
  dataType: DataType;
  question: Scalars['String'];
  config: FieldConfig;
};

export enum QuestionFilterCompareOperator {
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  EQUALS = 'EQUALS',
  INCLUDES = 'INCLUDES',
  EXISTS = 'EXISTS'
}

export type QuestionFilterInput = {
  questionId: Scalars['String'];
  value: Scalars['String'];
  compareOperator: QuestionFilterCompareOperator;
  dataType: DataType;
};

export type QuestionResponseWrap = {
  __typename?: 'QuestionResponseWrap';
  rejection: Maybe<Rejection>;
  question: Maybe<Question>;
};

export type QuestionTemplateRelation = {
  __typename?: 'QuestionTemplateRelation';
  question: Question;
  sortOrder: Scalars['Int'];
  topicId: Scalars['Int'];
  config: FieldConfig;
  dependencies: Array<FieldDependency>;
  dependenciesOperator: Maybe<DependenciesLogicOperator>;
};

export type QuestionWithUsage = {
  __typename?: 'QuestionWithUsage';
  id: Scalars['String'];
  categoryId: TemplateCategoryId;
  naturalKey: Scalars['String'];
  dataType: DataType;
  question: Scalars['String'];
  config: FieldConfig;
  answers: Array<AnswerBasic>;
  templates: Array<Template>;
};

export type Questionary = {
  __typename?: 'Questionary';
  questionaryId: Scalars['Int'];
  templateId: Scalars['Int'];
  created: Scalars['DateTime'];
  steps: Array<QuestionaryStep>;
  isCompleted: Scalars['Boolean'];
};

export type QuestionaryResponseWrap = {
  __typename?: 'QuestionaryResponseWrap';
  rejection: Maybe<Rejection>;
  questionary: Maybe<Questionary>;
};

export type QuestionaryStep = {
  __typename?: 'QuestionaryStep';
  topic: Topic;
  isCompleted: Scalars['Boolean'];
  fields: Array<Answer>;
};

export type QuestionaryStepResponseWrap = {
  __typename?: 'QuestionaryStepResponseWrap';
  rejection: Maybe<Rejection>;
  questionaryStep: Maybe<QuestionaryStep>;
};

export type QuestionsFilter = {
  text?: Maybe<Scalars['String']>;
  category?: Maybe<TemplateCategoryId>;
  dataType?: Maybe<Array<DataType>>;
  excludeDataType?: Maybe<Array<DataType>>;
};

export type Rejection = {
  __typename?: 'Rejection';
  reason: Scalars['String'];
  context: Maybe<Scalars['String']>;
  exception: Maybe<Scalars['String']>;
};

export type RemoveAssignedInstrumentFromCallInput = {
  instrumentId: Scalars['Int'];
  callId: Scalars['Int'];
};

export type ReorderSepMeetingDecisionProposalsInput = {
  proposals: Array<ProposalPkWithRankOrder>;
};

export type Review = {
  __typename?: 'Review';
  id: Scalars['Int'];
  userID: Scalars['Int'];
  comment: Maybe<Scalars['String']>;
  grade: Maybe<Scalars['Int']>;
  status: ReviewStatus;
  sepID: Scalars['Int'];
  reviewer: Maybe<BasicUserDetails>;
  proposal: Maybe<Proposal>;
};

export type ReviewResponseWrap = {
  __typename?: 'ReviewResponseWrap';
  rejection: Maybe<Rejection>;
  review: Maybe<Review>;
};

export enum ReviewStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED'
}

export type ReviewWithNextProposalStatus = {
  __typename?: 'ReviewWithNextProposalStatus';
  id: Scalars['Int'];
  userID: Scalars['Int'];
  comment: Maybe<Scalars['String']>;
  grade: Maybe<Scalars['Int']>;
  status: ReviewStatus;
  sepID: Scalars['Int'];
  reviewer: Maybe<BasicUserDetails>;
  proposal: Maybe<Proposal>;
  nextProposalStatus: Maybe<NextProposalStatus>;
};

export type ReviewWithNextStatusResponseWrap = {
  __typename?: 'ReviewWithNextStatusResponseWrap';
  rejection: Maybe<Rejection>;
  review: Maybe<ReviewWithNextProposalStatus>;
};

export enum ReviewerFilter {
  YOU = 'YOU',
  ALL = 'ALL'
}

export type RichTextInputConfig = {
  __typename?: 'RichTextInputConfig';
  small_label: Scalars['String'];
  required: Scalars['Boolean'];
  tooltip: Scalars['String'];
  max: Maybe<Scalars['Int']>;
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['Int'];
  shortCode: Scalars['String'];
  title: Scalars['String'];
};

export type Sep = {
  __typename?: 'SEP';
  id: Scalars['Int'];
  code: Scalars['String'];
  description: Scalars['String'];
  numberRatingsRequired: Scalars['Float'];
  active: Scalars['Boolean'];
  sepChair: Maybe<BasicUserDetails>;
  sepSecretary: Maybe<BasicUserDetails>;
};

export type SepAssignment = {
  __typename?: 'SEPAssignment';
  proposalPk: Scalars['Int'];
  sepMemberUserId: Maybe<Scalars['Int']>;
  sepId: Scalars['Int'];
  dateAssigned: Scalars['DateTime'];
  reassigned: Scalars['Boolean'];
  dateReassigned: Maybe<Scalars['DateTime']>;
  emailSent: Scalars['Boolean'];
  proposal: Proposal;
  role: Maybe<Role>;
  user: Maybe<BasicUserDetails>;
  review: Maybe<Review>;
};

export type SepProposal = {
  __typename?: 'SEPProposal';
  proposalPk: Scalars['Int'];
  sepId: Scalars['Int'];
  dateAssigned: Scalars['DateTime'];
  sepTimeAllocation: Maybe<Scalars['Int']>;
  proposal: Proposal;
  assignments: Maybe<Array<SepAssignment>>;
  instrumentSubmitted: Scalars['Boolean'];
};

export type SepProposalResponseWrap = {
  __typename?: 'SEPProposalResponseWrap';
  rejection: Maybe<Rejection>;
  sepProposal: Maybe<SepProposal>;
};

export type SepResponseWrap = {
  __typename?: 'SEPResponseWrap';
  rejection: Maybe<Rejection>;
  sep: Maybe<Sep>;
};

export type SepReviewer = {
  __typename?: 'SEPReviewer';
  userId: Scalars['Int'];
  sepId: Scalars['Int'];
  role: Maybe<Role>;
  user: BasicUserDetails;
};

export type SePsQueryResult = {
  __typename?: 'SEPsQueryResult';
  totalCount: Scalars['Int'];
  seps: Array<Sep>;
};

export type Sample = {
  __typename?: 'Sample';
  id: Scalars['Int'];
  title: Scalars['String'];
  creatorId: Scalars['Int'];
  questionaryId: Scalars['Int'];
  proposalPk: Scalars['Int'];
  questionId: Scalars['String'];
  safetyStatus: SampleStatus;
  safetyComment: Scalars['String'];
  created: Scalars['DateTime'];
  questionary: Questionary;
  proposal: Proposal;
};

export type SampleBasisConfig = {
  __typename?: 'SampleBasisConfig';
  titlePlaceholder: Scalars['String'];
};

export type SampleResponseWrap = {
  __typename?: 'SampleResponseWrap';
  rejection: Maybe<Rejection>;
  sample: Maybe<Sample>;
};

export enum SampleStatus {
  PENDING_EVALUATION = 'PENDING_EVALUATION',
  LOW_RISK = 'LOW_RISK',
  ELEVATED_RISK = 'ELEVATED_RISK',
  HIGH_RISK = 'HIGH_RISK'
}

export type SamplesFilter = {
  title?: Maybe<Scalars['String']>;
  creatorId?: Maybe<Scalars['Int']>;
  questionaryIds?: Maybe<Array<Scalars['Int']>>;
  sampleIds?: Maybe<Array<Scalars['Int']>>;
  status?: Maybe<SampleStatus>;
  questionId?: Maybe<Scalars['String']>;
  proposalPk?: Maybe<Scalars['Int']>;
};

export type SaveSepMeetingDecisionInput = {
  proposalPk: Scalars['Int'];
  commentForUser?: Maybe<Scalars['String']>;
  commentForManagement?: Maybe<Scalars['String']>;
  recommendation?: Maybe<ProposalEndStatus>;
  rankOrder?: Maybe<Scalars['Int']>;
  submitted?: Maybe<Scalars['Boolean']>;
};

export type ScheduledEvent = {
  __typename?: 'ScheduledEvent';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  bookingType: ScheduledEventBookingType;
  startsAt: Scalars['TzLessDateTime'];
  endsAt: Scalars['TzLessDateTime'];
  proposalBookingId: Maybe<Scalars['Int']>;
  scheduledBy: Maybe<User>;
  description: Maybe<Scalars['String']>;
  instrument: Maybe<Instrument>;
  equipmentId: Maybe<Scalars['Int']>;
  equipments: Array<EquipmentWithAssignmentStatus>;
  equipmentAssignmentStatus: Maybe<EquipmentAssignmentStatus>;
  proposalBooking: Maybe<ProposalBooking>;
};

export enum ScheduledEventBookingType {
  USER_OPERATIONS = 'USER_OPERATIONS',
  MAINTENANCE = 'MAINTENANCE',
  SHUTDOWN = 'SHUTDOWN',
  COMMISSIONING = 'COMMISSIONING',
  EQUIPMENT = 'EQUIPMENT'
}

export type ScheduledEventFilter = {
  startsAt: Scalars['TzLessDateTime'];
  endsAt: Scalars['TzLessDateTime'];
  instrumentId?: Maybe<Scalars['ID']>;
};

export type ScheduledEventResponseWrap = {
  __typename?: 'ScheduledEventResponseWrap';
  error: Maybe<Scalars['String']>;
  scheduledEvent: Maybe<ScheduledEvent>;
};

export type ScheduledEventsResponseWrap = {
  __typename?: 'ScheduledEventsResponseWrap';
  error: Maybe<Scalars['String']>;
  scheduledEvent: Maybe<Array<ScheduledEvent>>;
};

export type SchedulerConfig = {
  __typename?: 'SchedulerConfig';
  authRedirect: Scalars['String'];
};

export type SelectionFromOptionsConfig = {
  __typename?: 'SelectionFromOptionsConfig';
  small_label: Scalars['String'];
  required: Scalars['Boolean'];
  tooltip: Scalars['String'];
  variant: Scalars['String'];
  options: Array<Scalars['String']>;
  isMultipleSelect: Scalars['Boolean'];
};

export type SepMeetingDecision = {
  __typename?: 'SepMeetingDecision';
  proposalPk: Scalars['Int'];
  recommendation: Maybe<ProposalEndStatus>;
  commentForManagement: Maybe<Scalars['String']>;
  commentForUser: Maybe<Scalars['String']>;
  rankOrder: Maybe<Scalars['Int']>;
  submitted: Scalars['Boolean'];
  submittedBy: Maybe<Scalars['Int']>;
};

export type SepMeetingDecisionResponseWrap = {
  __typename?: 'SepMeetingDecisionResponseWrap';
  rejection: Maybe<Rejection>;
  sepMeetingDecision: Maybe<SepMeetingDecision>;
};

export type Settings = {
  __typename?: 'Settings';
  id: SettingsId;
  settingsValue: Scalars['String'];
  description: Scalars['String'];
};

export enum SettingsId {
  EXTERNAL_AUTH_LOGIN_URL = 'EXTERNAL_AUTH_LOGIN_URL'
}

export type Shipment = {
  __typename?: 'Shipment';
  id: Scalars['Int'];
  title: Scalars['String'];
  proposalPk: Scalars['Int'];
  status: ShipmentStatus;
  externalRef: Maybe<Scalars['String']>;
  questionaryId: Scalars['Int'];
  creatorId: Scalars['Int'];
  created: Scalars['DateTime'];
  questionary: Questionary;
  samples: Array<Sample>;
  proposal: Proposal;
};

export type ShipmentBasisConfig = {
  __typename?: 'ShipmentBasisConfig';
  small_label: Scalars['String'];
  required: Scalars['Boolean'];
  tooltip: Scalars['String'];
};

export type ShipmentResponseWrap = {
  __typename?: 'ShipmentResponseWrap';
  rejection: Maybe<Rejection>;
  shipment: Maybe<Shipment>;
};

export enum ShipmentStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED'
}

export type ShipmentsFilter = {
  title?: Maybe<Scalars['String']>;
  creatorId?: Maybe<Scalars['Int']>;
  proposalPk?: Maybe<Scalars['Int']>;
  questionaryIds?: Maybe<Array<Scalars['Int']>>;
  status?: Maybe<ShipmentStatus>;
  externalRef?: Maybe<Scalars['String']>;
  shipmentIds?: Maybe<Array<Scalars['Int']>>;
};

export type SimpleLostTimeInput = {
  id: Scalars['ID'];
  startsAt: Scalars['TzLessDateTime'];
  endsAt: Scalars['TzLessDateTime'];
  newlyCreated?: Maybe<Scalars['Boolean']>;
};

export type SimpleScheduledEventInput = {
  id: Scalars['ID'];
  startsAt: Scalars['TzLessDateTime'];
  endsAt: Scalars['TzLessDateTime'];
  newlyCreated?: Maybe<Scalars['Boolean']>;
};

export type StatusChangingEvent = {
  __typename?: 'StatusChangingEvent';
  statusChangingEventId: Scalars['Int'];
  proposalWorkflowConnectionId: Scalars['Int'];
  statusChangingEvent: Scalars['String'];
};

export type SubmitProposalsReviewInput = {
  proposals: Array<ProposalPkWithReviewId>;
};

export type SubmitTechnicalReviewInput = {
  proposalPk: Scalars['Int'];
  comment?: Maybe<Scalars['String']>;
  publicComment?: Maybe<Scalars['String']>;
  timeAllocation?: Maybe<Scalars['Int']>;
  status?: Maybe<TechnicalReviewStatus>;
  submitted: Scalars['Boolean'];
  reviewerId: Scalars['Int'];
};

export type SubtemplateConfig = {
  __typename?: 'SubtemplateConfig';
  minEntries: Maybe<Scalars['Int']>;
  maxEntries: Maybe<Scalars['Int']>;
  templateId: Maybe<Scalars['Int']>;
  templateCategory: Scalars['String'];
  addEntryButtonLabel: Scalars['String'];
  small_label: Scalars['String'];
  required: Scalars['Boolean'];
};

export type SuccessResponseWrap = {
  __typename?: 'SuccessResponseWrap';
  rejection: Maybe<Rejection>;
  isSuccess: Maybe<Scalars['Boolean']>;
};

export type TechnicalReview = {
  __typename?: 'TechnicalReview';
  id: Scalars['Int'];
  proposalPk: Scalars['Int'];
  comment: Maybe<Scalars['String']>;
  publicComment: Maybe<Scalars['String']>;
  timeAllocation: Maybe<Scalars['Int']>;
  status: Maybe<TechnicalReviewStatus>;
  submitted: Scalars['Boolean'];
  reviewerId: Scalars['Int'];
  proposal: Maybe<Proposal>;
  reviewer: Maybe<BasicUserDetails>;
};

export type TechnicalReviewResponseWrap = {
  __typename?: 'TechnicalReviewResponseWrap';
  rejection: Maybe<Rejection>;
  technicalReview: Maybe<TechnicalReview>;
};

export enum TechnicalReviewStatus {
  FEASIBLE = 'FEASIBLE',
  PARTIALLY_FEASIBLE = 'PARTIALLY_FEASIBLE',
  UNFEASIBLE = 'UNFEASIBLE'
}

export type Template = {
  __typename?: 'Template';
  templateId: Scalars['Int'];
  categoryId: TemplateCategoryId;
  name: Scalars['String'];
  description: Maybe<Scalars['String']>;
  isArchived: Scalars['Boolean'];
  steps: Array<TemplateStep>;
  complementaryQuestions: Array<Question>;
  questionaryCount: Scalars['Int'];
};

export type TemplateCategory = {
  __typename?: 'TemplateCategory';
  categoryId: TemplateCategoryId;
  name: Scalars['String'];
};

export enum TemplateCategoryId {
  PROPOSAL_QUESTIONARY = 'PROPOSAL_QUESTIONARY',
  SAMPLE_DECLARATION = 'SAMPLE_DECLARATION',
  SHIPMENT_DECLARATION = 'SHIPMENT_DECLARATION',
  VISIT = 'VISIT'
}

export type TemplateResponseWrap = {
  __typename?: 'TemplateResponseWrap';
  rejection: Maybe<Rejection>;
  template: Maybe<Template>;
};

export type TemplateStep = {
  __typename?: 'TemplateStep';
  topic: Topic;
  fields: Array<QuestionTemplateRelation>;
};

export type TemplatesFilter = {
  isArchived?: Maybe<Scalars['Boolean']>;
  category?: Maybe<TemplateCategoryId>;
  templateIds?: Maybe<Array<Scalars['Int']>>;
};

export type TextInputConfig = {
  __typename?: 'TextInputConfig';
  small_label: Scalars['String'];
  required: Scalars['Boolean'];
  tooltip: Scalars['String'];
  min: Maybe<Scalars['Int']>;
  max: Maybe<Scalars['Int']>;
  multiline: Scalars['Boolean'];
  placeholder: Scalars['String'];
  htmlQuestion: Maybe<Scalars['String']>;
  isHtmlQuestion: Scalars['Boolean'];
  isCounterHidden: Scalars['Boolean'];
};

export type TokenPayloadUnion = AuthJwtPayload | AuthJwtApiTokenPayload;

export type TokenResponseWrap = {
  __typename?: 'TokenResponseWrap';
  rejection: Maybe<Rejection>;
  token: Maybe<Scalars['String']>;
};

export type TokenResult = {
  __typename?: 'TokenResult';
  isValid: Scalars['Boolean'];
  payload: Maybe<TokenPayloadUnion>;
};

export type Topic = {
  __typename?: 'Topic';
  id: Scalars['Int'];
  title: Scalars['String'];
  templateId: Scalars['Int'];
  sortOrder: Scalars['Int'];
  isEnabled: Scalars['Boolean'];
};


export type Unit = {
  __typename?: 'Unit';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type UnitResponseWrap = {
  __typename?: 'UnitResponseWrap';
  rejection: Maybe<Rejection>;
  unit: Maybe<Unit>;
};

export type UpdateAnswerResponseWrap = {
  __typename?: 'UpdateAnswerResponseWrap';
  rejection: Maybe<Rejection>;
  questionId: Maybe<Scalars['String']>;
};

export type UpdateApiAccessTokenInput = {
  accessTokenId: Scalars['String'];
  name: Scalars['String'];
  accessPermissions: Scalars['String'];
};

export type UpdateCallInput = {
  id: Scalars['Int'];
  shortCode: Scalars['String'];
  startCall: Scalars['DateTime'];
  endCall: Scalars['DateTime'];
  startReview: Scalars['DateTime'];
  endReview: Scalars['DateTime'];
  startSEPReview?: Maybe<Scalars['DateTime']>;
  endSEPReview?: Maybe<Scalars['DateTime']>;
  startNotify: Scalars['DateTime'];
  endNotify: Scalars['DateTime'];
  startCycle: Scalars['DateTime'];
  endCycle: Scalars['DateTime'];
  referenceNumberFormat?: Maybe<Scalars['String']>;
  proposalSequence?: Maybe<Scalars['Int']>;
  cycleComment: Scalars['String'];
  surveyComment: Scalars['String'];
  allocationTimeUnit: AllocationTimeUnits;
  proposalWorkflowId?: Maybe<Scalars['Int']>;
  callEnded?: Maybe<Scalars['Int']>;
  callReviewEnded?: Maybe<Scalars['Int']>;
  callSEPReviewEnded?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
};

export type UpdateProposalStatusInput = {
  id: Scalars['Int'];
  shortCode?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  description: Scalars['String'];
  isDefault?: Maybe<Scalars['Boolean']>;
};

export type UpdateProposalWorkflowInput = {
  id: Scalars['Int'];
  name: Scalars['String'];
  description: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  user_title: Scalars['String'];
  firstname: Scalars['String'];
  middlename: Maybe<Scalars['String']>;
  lastname: Scalars['String'];
  username: Scalars['String'];
  preferredname: Maybe<Scalars['String']>;
  orcid: Scalars['String'];
  refreshToken: Scalars['String'];
  gender: Scalars['String'];
  nationality: Maybe<Scalars['Int']>;
  birthdate: Scalars['String'];
  organisation: Scalars['Int'];
  department: Scalars['String'];
  position: Scalars['String'];
  email: Scalars['String'];
  emailVerified: Scalars['Boolean'];
  telephone: Scalars['String'];
  telephone_alt: Maybe<Scalars['String']>;
  placeholder: Scalars['Boolean'];
  created: Scalars['String'];
  updated: Scalars['String'];
  roles: Array<Role>;
  reviews: Array<Review>;
  proposals: Array<Proposal>;
  seps: Array<Sep>;
  instruments: Array<Instrument>;
};


export type UserReviewsArgs = {
  reviewer?: Maybe<ReviewerFilter>;
  status?: Maybe<ReviewStatus>;
  instrumentId?: Maybe<Scalars['Int']>;
  callId?: Maybe<Scalars['Int']>;
};


export type UserProposalsArgs = {
  filter?: Maybe<UserProposalsFilter>;
};

export type UserProposalsFilter = {
  instrumentId?: Maybe<Scalars['Int']>;
  managementDecisionSubmitted?: Maybe<Scalars['Boolean']>;
  finalStatus?: Maybe<ProposalEndStatus>;
};

export type UserQueryResult = {
  __typename?: 'UserQueryResult';
  users: Array<BasicUserDetails>;
  totalCount: Scalars['Int'];
};

export type UserResponseWrap = {
  __typename?: 'UserResponseWrap';
  rejection: Maybe<Rejection>;
  user: Maybe<User>;
};

export enum UserRole {
  USER = 'USER',
  USER_OFFICER = 'USER_OFFICER',
  SEP_CHAIR = 'SEP_CHAIR',
  SEP_SECRETARY = 'SEP_SECRETARY',
  SEP_REVIEWER = 'SEP_REVIEWER',
  INSTRUMENT_SCIENTIST = 'INSTRUMENT_SCIENTIST',
  SAMPLE_SAFETY_REVIEWER = 'SAMPLE_SAFETY_REVIEWER'
}

export type Visit = {
  __typename?: 'Visit';
  id: Scalars['Int'];
  proposalPk: Scalars['Int'];
  status: VisitStatus;
  questionaryId: Scalars['Int'];
  visitorId: Scalars['Int'];
  proposal: Proposal;
  team: Array<BasicUserDetails>;
  questionary: Questionary;
};

export type VisitBasisConfig = {
  __typename?: 'VisitBasisConfig';
  small_label: Scalars['String'];
  required: Scalars['Boolean'];
  tooltip: Scalars['String'];
};

export type VisitResponseWrap = {
  __typename?: 'VisitResponseWrap';
  rejection: Maybe<Rejection>;
  visit: Maybe<Visit>;
};

export enum VisitStatus {
  DRAFT = 'DRAFT',
  ACCEPTED = 'ACCEPTED',
  SUBMITTED = 'SUBMITTED'
}

export type VisitsFilter = {
  visitorId?: Maybe<Scalars['Int']>;
  questionaryId?: Maybe<Scalars['Int']>;
  proposalPk?: Maybe<Scalars['Int']>;
};

export type AddEquipmentResponsibleMutationVariables = Exact<{
  equipmentResponsibleInput: EquipmentResponsibleInput;
}>;


export type AddEquipmentResponsibleMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addEquipmentResponsible'>
);

export type AssignEquipmentToScheduledEventMutationVariables = Exact<{
  assignEquipmentsToScheduledEventInput: AssignEquipmentsToScheduledEventInput;
}>;


export type AssignEquipmentToScheduledEventMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'assignToScheduledEvents'>
);

export type ConfirmEquipmentAssignmentMutationVariables = Exact<{
  confirmEquipmentAssignmentInput: ConfirmEquipmentAssignmentInput;
}>;


export type ConfirmEquipmentAssignmentMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'confirmEquipmentAssignment'>
);

export type CreateEquipmentMutationVariables = Exact<{
  newEquipmentInput: EquipmentInput;
}>;


export type CreateEquipmentMutation = (
  { __typename?: 'Mutation' }
  & { createEquipment: (
    { __typename?: 'EquipmentResponseWrap' }
    & Pick<EquipmentResponseWrap, 'error'>
    & { equipment: Maybe<(
      { __typename?: 'Equipment' }
      & Pick<Equipment, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'maintenanceStartsAt' | 'maintenanceEndsAt' | 'autoAccept'>
    )> }
  ) }
);

export type DeleteEquipmentAssignmentMutationVariables = Exact<{
  deleteEquipmentAssignmentInput: DeleteEquipmentAssignmentInput;
}>;


export type DeleteEquipmentAssignmentMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteEquipmentAssignment'>
);

export type GetAvailableEquipmentsQueryVariables = Exact<{
  scheduledEventId: Scalars['ID'];
}>;


export type GetAvailableEquipmentsQuery = (
  { __typename?: 'Query' }
  & { availableEquipments: Array<(
    { __typename?: 'Equipment' }
    & Pick<Equipment, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'maintenanceStartsAt' | 'maintenanceEndsAt' | 'autoAccept'>
  )> }
);

export type GetEquipmentQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetEquipmentQuery = (
  { __typename?: 'Query' }
  & { equipment: Maybe<(
    { __typename?: 'Equipment' }
    & Pick<Equipment, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'maintenanceStartsAt' | 'maintenanceEndsAt' | 'autoAccept'>
    & { owner: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'firstname' | 'lastname'>
    )>, equipmentResponsible: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstname' | 'lastname'>
    )> }
  )> }
);

export type GetEquipmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEquipmentsQuery = (
  { __typename?: 'Query' }
  & { equipments: Array<(
    { __typename?: 'Equipment' }
    & Pick<Equipment, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'maintenanceStartsAt' | 'maintenanceEndsAt' | 'autoAccept'>
  )> }
);

export type UpdateEquipmentMutationVariables = Exact<{
  id: Scalars['ID'];
  updateEquipmentInput: EquipmentInput;
}>;


export type UpdateEquipmentMutation = (
  { __typename?: 'Mutation' }
  & { updateEquipment: (
    { __typename?: 'EquipmentResponseWrap' }
    & Pick<EquipmentResponseWrap, 'error'>
    & { equipment: Maybe<(
      { __typename?: 'Equipment' }
      & Pick<Equipment, 'id' | 'name' | 'maintenanceStartsAt' | 'maintenanceEndsAt' | 'autoAccept'>
    )> }
  ) }
);

export type GetUserInstrumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserInstrumentsQuery = (
  { __typename?: 'Query' }
  & { userInstruments: Maybe<(
    { __typename?: 'InstrumentsQueryResult' }
    & Pick<InstrumentsQueryResult, 'totalCount'>
    & { instruments: Array<(
      { __typename?: 'Instrument' }
      & Pick<Instrument, 'id' | 'name'>
    )> }
  )> }
);

export type BulkUpsertLostTimesMutationVariables = Exact<{
  input: BulkUpsertLostTimesInput;
}>;


export type BulkUpsertLostTimesMutation = (
  { __typename?: 'Mutation' }
  & { bulkUpsertLostTimes: (
    { __typename?: 'LostTimesResponseWrap' }
    & Pick<LostTimesResponseWrap, 'error'>
    & { lostTime: Maybe<Array<(
      { __typename?: 'LostTime' }
      & Pick<LostTime, 'id' | 'startsAt' | 'endsAt'>
    )>> }
  ) }
);

export type GetProposalBookingLostTimesQueryVariables = Exact<{
  proposalBookingId: Scalars['ID'];
}>;


export type GetProposalBookingLostTimesQuery = (
  { __typename?: 'Query' }
  & { proposalBookingLostTimes: Array<(
    { __typename?: 'LostTime' }
    & Pick<LostTime, 'id' | 'startsAt' | 'endsAt'>
  )> }
);

export type AddClientLogMutationVariables = Exact<{
  error: Scalars['String'];
}>;


export type AddClientLogMutation = (
  { __typename?: 'Mutation' }
  & { addClientLog: (
    { __typename?: 'SuccessResponseWrap' }
    & Pick<SuccessResponseWrap, 'isSuccess'>
    & { rejection: Maybe<(
      { __typename?: 'Rejection' }
      & Pick<Rejection, 'reason'>
    )> }
  ) }
);

export type GetRefreshedTokenMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type GetRefreshedTokenMutation = (
  { __typename?: 'Mutation' }
  & { token: (
    { __typename?: 'TokenResponseWrap' }
    & Pick<TokenResponseWrap, 'token'>
    & { rejection: Maybe<(
      { __typename?: 'Rejection' }
      & Pick<Rejection, 'reason'>
    )> }
  ) }
);

export type GetSchedulerConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSchedulerConfigQuery = (
  { __typename?: 'Query' }
  & { schedulerConfig: (
    { __typename?: 'SchedulerConfig' }
    & Pick<SchedulerConfig, 'authRedirect'>
  ) }
);

export type ServerHealthCheckQueryVariables = Exact<{ [key: string]: never; }>;


export type ServerHealthCheckQuery = (
  { __typename?: 'Query' }
  & { healthCheck: (
    { __typename?: 'HealthStats' }
    & Pick<HealthStats, 'message'>
    & { dbStats: Array<(
      { __typename?: 'DbStat' }
      & Pick<DbStat, 'total' | 'state'>
    )> }
  ) }
);

export type ActivateProposalBookingMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ActivateProposalBookingMutation = (
  { __typename?: 'Mutation' }
  & { activateProposalBooking: (
    { __typename?: 'ProposalBookingResponseWrap' }
    & Pick<ProposalBookingResponseWrap, 'error'>
  ) }
);

export type FinalizeProposalBookingMutationVariables = Exact<{
  action: ProposalBookingFinalizeAction;
  id: Scalars['ID'];
}>;


export type FinalizeProposalBookingMutation = (
  { __typename?: 'Mutation' }
  & { finalizeProposalBooking: (
    { __typename?: 'ProposalBookingResponseWrap' }
    & Pick<ProposalBookingResponseWrap, 'error'>
  ) }
);

export type GetInstrumentProposalBookingsQueryVariables = Exact<{
  instrumentId: Scalars['ID'];
  filter: ProposalBookingScheduledEventFilter;
}>;


export type GetInstrumentProposalBookingsQuery = (
  { __typename?: 'Query' }
  & { instrumentProposalBookings: Array<(
    { __typename?: 'ProposalBooking' }
    & Pick<ProposalBooking, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'allocatedTime'>
    & { call: Maybe<(
      { __typename?: 'Call' }
      & Pick<Call, 'id' | 'shortCode' | 'startCycle' | 'endCycle' | 'cycleComment'>
    )>, proposal: Maybe<(
      { __typename?: 'Proposal' }
      & Pick<Proposal, 'primaryKey' | 'title' | 'shortCode'>
    )>, scheduledEvents: Array<(
      { __typename?: 'ScheduledEvent' }
      & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt'>
    )> }
  )> }
);

export type GetProposalBookingQueryVariables = Exact<{
  id: Scalars['ID'];
  filter: ProposalBookingScheduledEventFilter;
}>;


export type GetProposalBookingQuery = (
  { __typename?: 'Query' }
  & { proposalBooking: Maybe<(
    { __typename?: 'ProposalBooking' }
    & Pick<ProposalBooking, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'allocatedTime'>
    & { call: Maybe<(
      { __typename?: 'Call' }
      & Pick<Call, 'id' | 'shortCode' | 'startCycle' | 'endCycle' | 'cycleComment'>
    )>, proposal: Maybe<(
      { __typename?: 'Proposal' }
      & Pick<Proposal, 'primaryKey' | 'title' | 'shortCode'>
    )>, scheduledEvents: Array<(
      { __typename?: 'ScheduledEvent' }
      & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt'>
    )> }
  )> }
);

export type BulkUpsertScheduledEventsMutationVariables = Exact<{
  input: BulkUpsertScheduledEventsInput;
}>;


export type BulkUpsertScheduledEventsMutation = (
  { __typename?: 'Mutation' }
  & { bulkUpsertScheduledEvents: (
    { __typename?: 'ScheduledEventsResponseWrap' }
    & Pick<ScheduledEventsResponseWrap, 'error'>
    & { scheduledEvent: Maybe<Array<(
      { __typename?: 'ScheduledEvent' }
      & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt'>
    )>> }
  ) }
);

export type CreateScheduledEventMutationVariables = Exact<{
  input: NewScheduledEventInput;
}>;


export type CreateScheduledEventMutation = (
  { __typename?: 'Mutation' }
  & { createScheduledEvent: (
    { __typename?: 'ScheduledEventResponseWrap' }
    & Pick<ScheduledEventResponseWrap, 'error'>
    & { scheduledEvent: Maybe<(
      { __typename?: 'ScheduledEvent' }
      & Pick<ScheduledEvent, 'id' | 'bookingType' | 'startsAt' | 'endsAt' | 'description'>
    )> }
  ) }
);

export type GetEquipmentScheduledEventsQueryVariables = Exact<{
  equipmentIds: Array<Scalars['Int']> | Scalars['Int'];
  endsAt: Scalars['TzLessDateTime'];
  startsAt: Scalars['TzLessDateTime'];
}>;


export type GetEquipmentScheduledEventsQuery = (
  { __typename?: 'Query' }
  & { equipments: Array<(
    { __typename?: 'Equipment' }
    & Pick<Equipment, 'id' | 'name'>
    & { events: Array<(
      { __typename?: 'ScheduledEvent' }
      & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt' | 'equipmentAssignmentStatus' | 'equipmentId'>
      & { proposalBooking: Maybe<(
        { __typename?: 'ProposalBooking' }
        & Pick<ProposalBooking, 'status'>
        & { proposal: Maybe<(
          { __typename?: 'Proposal' }
          & Pick<Proposal, 'primaryKey' | 'title' | 'shortCode'>
          & { proposer: Maybe<(
            { __typename?: 'BasicUserDetails' }
            & Pick<BasicUserDetails, 'firstname' | 'lastname'>
          )> }
        )> }
      )>, instrument: Maybe<(
        { __typename?: 'Instrument' }
        & Pick<Instrument, 'id' | 'name'>
      )>, scheduledBy: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'firstname' | 'lastname'>
      )> }
    )> }
  )> }
);

export type GetProposalBookingScheduledEventsQueryVariables = Exact<{
  proposalBookingId: Scalars['ID'];
}>;


export type GetProposalBookingScheduledEventsQuery = (
  { __typename?: 'Query' }
  & { proposalBookingScheduledEvents: Array<(
    { __typename?: 'ScheduledEvent' }
    & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt'>
  )> }
);

export type GetScheduledEventWithEquipmentsQueryVariables = Exact<{
  proposalBookingId: Scalars['ID'];
  scheduledEventId: Scalars['ID'];
}>;


export type GetScheduledEventWithEquipmentsQuery = (
  { __typename?: 'Query' }
  & { proposalBookingScheduledEvent: Maybe<(
    { __typename?: 'ScheduledEvent' }
    & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt'>
    & { equipments: Array<(
      { __typename?: 'EquipmentWithAssignmentStatus' }
      & Pick<EquipmentWithAssignmentStatus, 'id' | 'name' | 'maintenanceStartsAt' | 'maintenanceEndsAt' | 'status'>
    )> }
  )> }
);

export type GetScheduledEventsQueryVariables = Exact<{
  filter: ScheduledEventFilter;
  scheduledEventFilter: ProposalBookingScheduledEventFilter;
}>;


export type GetScheduledEventsQuery = (
  { __typename?: 'Query' }
  & { scheduledEvents: Array<(
    { __typename?: 'ScheduledEvent' }
    & Pick<ScheduledEvent, 'id' | 'bookingType' | 'equipmentId' | 'startsAt' | 'endsAt' | 'description'>
    & { instrument: Maybe<(
      { __typename?: 'Instrument' }
      & Pick<Instrument, 'name'>
    )>, scheduledBy: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'firstname' | 'lastname'>
    )>, proposalBooking: Maybe<(
      { __typename?: 'ProposalBooking' }
      & Pick<ProposalBooking, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'allocatedTime'>
      & { proposal: Maybe<(
        { __typename?: 'Proposal' }
        & Pick<Proposal, 'primaryKey' | 'title' | 'shortCode'>
        & { proposer: Maybe<(
          { __typename?: 'BasicUserDetails' }
          & Pick<BasicUserDetails, 'firstname' | 'lastname'>
        )> }
      )>, call: Maybe<(
        { __typename?: 'Call' }
        & Pick<Call, 'id' | 'shortCode' | 'startCycle' | 'endCycle' | 'cycleComment'>
      )>, scheduledEvents: Array<(
        { __typename?: 'ScheduledEvent' }
        & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt'>
      )> }
    )> }
  )> }
);

export type GetScheduledEventsWithEquipmentsQueryVariables = Exact<{
  proposalBookingId: Scalars['ID'];
}>;


export type GetScheduledEventsWithEquipmentsQuery = (
  { __typename?: 'Query' }
  & { proposalBookingScheduledEvents: Array<(
    { __typename?: 'ScheduledEvent' }
    & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt'>
    & { equipments: Array<(
      { __typename?: 'EquipmentWithAssignmentStatus' }
      & Pick<EquipmentWithAssignmentStatus, 'id' | 'name' | 'maintenanceStartsAt' | 'maintenanceEndsAt' | 'status'>
    )> }
  )> }
);

export type BasicUserDetailsFragment = (
  { __typename?: 'BasicUserDetails' }
  & Pick<BasicUserDetails, 'id' | 'firstname' | 'lastname' | 'organisation' | 'position' | 'created' | 'placeholder'>
);

export type GetUsersQueryVariables = Exact<{
  filter?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  userRole?: Maybe<UserRole>;
  subtractUsers?: Maybe<Array<Scalars['Int']> | Scalars['Int']>;
}>;


export type GetUsersQuery = (
  { __typename?: 'Query' }
  & { users: Maybe<(
    { __typename?: 'UserQueryResult' }
    & Pick<UserQueryResult, 'totalCount'>
    & { users: Array<(
      { __typename?: 'BasicUserDetails' }
      & BasicUserDetailsFragment
    )> }
  )> }
);

export const BasicUserDetailsFragmentDoc = gql`
    fragment basicUserDetails on BasicUserDetails {
  id
  firstname
  lastname
  organisation
  position
  created
  placeholder
}
    `;
export const AddEquipmentResponsibleDocument = gql`
    mutation addEquipmentResponsible($equipmentResponsibleInput: EquipmentResponsibleInput!) {
  addEquipmentResponsible(equipmentResponsibleInput: $equipmentResponsibleInput)
}
    `;
export const AssignEquipmentToScheduledEventDocument = gql`
    mutation assignEquipmentToScheduledEvent($assignEquipmentsToScheduledEventInput: AssignEquipmentsToScheduledEventInput!) {
  assignToScheduledEvents(
    assignEquipmentsToScheduledEventInput: $assignEquipmentsToScheduledEventInput
  )
}
    `;
export const ConfirmEquipmentAssignmentDocument = gql`
    mutation confirmEquipmentAssignment($confirmEquipmentAssignmentInput: ConfirmEquipmentAssignmentInput!) {
  confirmEquipmentAssignment(
    confirmEquipmentAssignmentInput: $confirmEquipmentAssignmentInput
  )
}
    `;
export const CreateEquipmentDocument = gql`
    mutation createEquipment($newEquipmentInput: EquipmentInput!) {
  createEquipment(newEquipmentInput: $newEquipmentInput) {
    error
    equipment {
      id
      createdAt
      updatedAt
      name
      maintenanceStartsAt
      maintenanceEndsAt
      autoAccept
    }
  }
}
    `;
export const DeleteEquipmentAssignmentDocument = gql`
    mutation deleteEquipmentAssignment($deleteEquipmentAssignmentInput: DeleteEquipmentAssignmentInput!) {
  deleteEquipmentAssignment(
    deleteEquipmentAssignmentInput: $deleteEquipmentAssignmentInput
  )
}
    `;
export const GetAvailableEquipmentsDocument = gql`
    query getAvailableEquipments($scheduledEventId: ID!) {
  availableEquipments(scheduledEventId: $scheduledEventId) {
    id
    createdAt
    updatedAt
    name
    maintenanceStartsAt
    maintenanceEndsAt
    autoAccept
  }
}
    `;
export const GetEquipmentDocument = gql`
    query getEquipment($id: ID!) {
  equipment(id: $id) {
    id
    createdAt
    updatedAt
    name
    maintenanceStartsAt
    maintenanceEndsAt
    autoAccept
    owner {
      firstname
      lastname
    }
    equipmentResponsible {
      id
      firstname
      lastname
    }
  }
}
    `;
export const GetEquipmentsDocument = gql`
    query getEquipments {
  equipments {
    id
    createdAt
    updatedAt
    name
    maintenanceStartsAt
    maintenanceEndsAt
    autoAccept
  }
}
    `;
export const UpdateEquipmentDocument = gql`
    mutation updateEquipment($id: ID!, $updateEquipmentInput: EquipmentInput!) {
  updateEquipment(id: $id, updateEquipmentInput: $updateEquipmentInput) {
    error
    equipment {
      id
      name
      maintenanceStartsAt
      maintenanceEndsAt
      autoAccept
    }
  }
}
    `;
export const GetUserInstrumentsDocument = gql`
    query getUserInstruments {
  userInstruments {
    totalCount
    instruments {
      id
      name
    }
  }
}
    `;
export const BulkUpsertLostTimesDocument = gql`
    mutation bulkUpsertLostTimes($input: BulkUpsertLostTimesInput!) {
  bulkUpsertLostTimes(bulkUpsertLostTimes: $input) {
    error
    lostTime {
      id
      startsAt
      endsAt
    }
  }
}
    `;
export const GetProposalBookingLostTimesDocument = gql`
    query getProposalBookingLostTimes($proposalBookingId: ID!) {
  proposalBookingLostTimes(proposalBookingId: $proposalBookingId) {
    id
    startsAt
    endsAt
  }
}
    `;
export const AddClientLogDocument = gql`
    mutation addClientLog($error: String!) {
  addClientLog(error: $error) {
    isSuccess
    rejection {
      reason
    }
  }
}
    `;
export const GetRefreshedTokenDocument = gql`
    mutation getRefreshedToken($token: String!) {
  token(token: $token) {
    token
    rejection {
      reason
    }
  }
}
    `;
export const GetSchedulerConfigDocument = gql`
    query getSchedulerConfig {
  schedulerConfig {
    authRedirect
  }
}
    `;
export const ServerHealthCheckDocument = gql`
    query serverHealthCheck {
  healthCheck {
    message
    dbStats {
      total
      state
    }
  }
}
    `;
export const ActivateProposalBookingDocument = gql`
    mutation activateProposalBooking($id: ID!) {
  activateProposalBooking(id: $id) {
    error
  }
}
    `;
export const FinalizeProposalBookingDocument = gql`
    mutation finalizeProposalBooking($action: ProposalBookingFinalizeAction!, $id: ID!) {
  finalizeProposalBooking(action: $action, id: $id) {
    error
  }
}
    `;
export const GetInstrumentProposalBookingsDocument = gql`
    query getInstrumentProposalBookings($instrumentId: ID!, $filter: ProposalBookingScheduledEventFilter!) {
  instrumentProposalBookings(instrumentId: $instrumentId) {
    id
    call {
      id
      shortCode
      startCycle
      endCycle
      cycleComment
    }
    proposal {
      primaryKey
      title
      shortCode
    }
    createdAt
    updatedAt
    status
    allocatedTime
    scheduledEvents(filter: $filter) {
      id
      startsAt
      endsAt
    }
  }
}
    `;
export const GetProposalBookingDocument = gql`
    query getProposalBooking($id: ID!, $filter: ProposalBookingScheduledEventFilter!) {
  proposalBooking(id: $id) {
    id
    call {
      id
      shortCode
      startCycle
      endCycle
      cycleComment
    }
    proposal {
      primaryKey
      title
      shortCode
    }
    scheduledEvents(filter: $filter) {
      id
      startsAt
      endsAt
    }
    createdAt
    updatedAt
    status
    allocatedTime
  }
}
    `;
export const BulkUpsertScheduledEventsDocument = gql`
    mutation bulkUpsertScheduledEvents($input: BulkUpsertScheduledEventsInput!) {
  bulkUpsertScheduledEvents(bulkUpsertScheduledEvents: $input) {
    error
    scheduledEvent {
      id
      startsAt
      endsAt
    }
  }
}
    `;
export const CreateScheduledEventDocument = gql`
    mutation createScheduledEvent($input: NewScheduledEventInput!) {
  createScheduledEvent(newScheduledEvent: $input) {
    error
    scheduledEvent {
      id
      bookingType
      startsAt
      endsAt
      description
    }
  }
}
    `;
export const GetEquipmentScheduledEventsDocument = gql`
    query getEquipmentScheduledEvents($equipmentIds: [Int!]!, $endsAt: TzLessDateTime!, $startsAt: TzLessDateTime!) {
  equipments(equipmentIds: $equipmentIds) {
    id
    name
    events(startsAt: $startsAt, endsAt: $endsAt) {
      id
      startsAt
      endsAt
      equipmentAssignmentStatus
      equipmentId
      proposalBooking {
        status
        proposal {
          primaryKey
          title
          shortCode
          proposer {
            firstname
            lastname
          }
        }
      }
      instrument {
        id
        name
      }
      scheduledBy {
        id
        firstname
        lastname
      }
    }
  }
}
    `;
export const GetProposalBookingScheduledEventsDocument = gql`
    query getProposalBookingScheduledEvents($proposalBookingId: ID!) {
  proposalBookingScheduledEvents(proposalBookingId: $proposalBookingId) {
    id
    startsAt
    endsAt
  }
}
    `;
export const GetScheduledEventWithEquipmentsDocument = gql`
    query getScheduledEventWithEquipments($proposalBookingId: ID!, $scheduledEventId: ID!) {
  proposalBookingScheduledEvent(
    proposalBookingId: $proposalBookingId
    scheduledEventId: $scheduledEventId
  ) {
    id
    startsAt
    endsAt
    equipments {
      id
      name
      maintenanceStartsAt
      maintenanceEndsAt
      status
    }
  }
}
    `;
export const GetScheduledEventsDocument = gql`
    query getScheduledEvents($filter: ScheduledEventFilter!, $scheduledEventFilter: ProposalBookingScheduledEventFilter!) {
  scheduledEvents(filter: $filter) {
    id
    bookingType
    equipmentId
    startsAt
    endsAt
    description
    instrument {
      name
    }
    scheduledBy {
      firstname
      lastname
    }
    proposalBooking {
      id
      createdAt
      updatedAt
      status
      allocatedTime
      proposal {
        primaryKey
        title
        shortCode
        proposer {
          firstname
          lastname
        }
      }
      call {
        id
        shortCode
        startCycle
        endCycle
        cycleComment
      }
      scheduledEvents(filter: $scheduledEventFilter) {
        id
        startsAt
        endsAt
      }
    }
  }
}
    `;
export const GetScheduledEventsWithEquipmentsDocument = gql`
    query getScheduledEventsWithEquipments($proposalBookingId: ID!) {
  proposalBookingScheduledEvents(proposalBookingId: $proposalBookingId) {
    id
    startsAt
    endsAt
    equipments {
      id
      name
      maintenanceStartsAt
      maintenanceEndsAt
      status
    }
  }
}
    `;
export const GetUsersDocument = gql`
    query getUsers($filter: String, $first: Int, $offset: Int, $userRole: UserRole, $subtractUsers: [Int!]) {
  users(
    filter: $filter
    first: $first
    offset: $offset
    userRole: $userRole
    subtractUsers: $subtractUsers
  ) {
    users {
      ...basicUserDetails
    }
    totalCount
  }
}
    ${BasicUserDetailsFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    addEquipmentResponsible(variables: AddEquipmentResponsibleMutationVariables): Promise<AddEquipmentResponsibleMutation> {
      return withWrapper(() => client.request<AddEquipmentResponsibleMutation>(print(AddEquipmentResponsibleDocument), variables));
    },
    assignEquipmentToScheduledEvent(variables: AssignEquipmentToScheduledEventMutationVariables): Promise<AssignEquipmentToScheduledEventMutation> {
      return withWrapper(() => client.request<AssignEquipmentToScheduledEventMutation>(print(AssignEquipmentToScheduledEventDocument), variables));
    },
    confirmEquipmentAssignment(variables: ConfirmEquipmentAssignmentMutationVariables): Promise<ConfirmEquipmentAssignmentMutation> {
      return withWrapper(() => client.request<ConfirmEquipmentAssignmentMutation>(print(ConfirmEquipmentAssignmentDocument), variables));
    },
    createEquipment(variables: CreateEquipmentMutationVariables): Promise<CreateEquipmentMutation> {
      return withWrapper(() => client.request<CreateEquipmentMutation>(print(CreateEquipmentDocument), variables));
    },
    deleteEquipmentAssignment(variables: DeleteEquipmentAssignmentMutationVariables): Promise<DeleteEquipmentAssignmentMutation> {
      return withWrapper(() => client.request<DeleteEquipmentAssignmentMutation>(print(DeleteEquipmentAssignmentDocument), variables));
    },
    getAvailableEquipments(variables: GetAvailableEquipmentsQueryVariables): Promise<GetAvailableEquipmentsQuery> {
      return withWrapper(() => client.request<GetAvailableEquipmentsQuery>(print(GetAvailableEquipmentsDocument), variables));
    },
    getEquipment(variables: GetEquipmentQueryVariables): Promise<GetEquipmentQuery> {
      return withWrapper(() => client.request<GetEquipmentQuery>(print(GetEquipmentDocument), variables));
    },
    getEquipments(variables?: GetEquipmentsQueryVariables): Promise<GetEquipmentsQuery> {
      return withWrapper(() => client.request<GetEquipmentsQuery>(print(GetEquipmentsDocument), variables));
    },
    updateEquipment(variables: UpdateEquipmentMutationVariables): Promise<UpdateEquipmentMutation> {
      return withWrapper(() => client.request<UpdateEquipmentMutation>(print(UpdateEquipmentDocument), variables));
    },
    getUserInstruments(variables?: GetUserInstrumentsQueryVariables): Promise<GetUserInstrumentsQuery> {
      return withWrapper(() => client.request<GetUserInstrumentsQuery>(print(GetUserInstrumentsDocument), variables));
    },
    bulkUpsertLostTimes(variables: BulkUpsertLostTimesMutationVariables): Promise<BulkUpsertLostTimesMutation> {
      return withWrapper(() => client.request<BulkUpsertLostTimesMutation>(print(BulkUpsertLostTimesDocument), variables));
    },
    getProposalBookingLostTimes(variables: GetProposalBookingLostTimesQueryVariables): Promise<GetProposalBookingLostTimesQuery> {
      return withWrapper(() => client.request<GetProposalBookingLostTimesQuery>(print(GetProposalBookingLostTimesDocument), variables));
    },
    addClientLog(variables: AddClientLogMutationVariables): Promise<AddClientLogMutation> {
      return withWrapper(() => client.request<AddClientLogMutation>(print(AddClientLogDocument), variables));
    },
    getRefreshedToken(variables: GetRefreshedTokenMutationVariables): Promise<GetRefreshedTokenMutation> {
      return withWrapper(() => client.request<GetRefreshedTokenMutation>(print(GetRefreshedTokenDocument), variables));
    },
    getSchedulerConfig(variables?: GetSchedulerConfigQueryVariables): Promise<GetSchedulerConfigQuery> {
      return withWrapper(() => client.request<GetSchedulerConfigQuery>(print(GetSchedulerConfigDocument), variables));
    },
    serverHealthCheck(variables?: ServerHealthCheckQueryVariables): Promise<ServerHealthCheckQuery> {
      return withWrapper(() => client.request<ServerHealthCheckQuery>(print(ServerHealthCheckDocument), variables));
    },
    activateProposalBooking(variables: ActivateProposalBookingMutationVariables): Promise<ActivateProposalBookingMutation> {
      return withWrapper(() => client.request<ActivateProposalBookingMutation>(print(ActivateProposalBookingDocument), variables));
    },
    finalizeProposalBooking(variables: FinalizeProposalBookingMutationVariables): Promise<FinalizeProposalBookingMutation> {
      return withWrapper(() => client.request<FinalizeProposalBookingMutation>(print(FinalizeProposalBookingDocument), variables));
    },
    getInstrumentProposalBookings(variables: GetInstrumentProposalBookingsQueryVariables): Promise<GetInstrumentProposalBookingsQuery> {
      return withWrapper(() => client.request<GetInstrumentProposalBookingsQuery>(print(GetInstrumentProposalBookingsDocument), variables));
    },
    getProposalBooking(variables: GetProposalBookingQueryVariables): Promise<GetProposalBookingQuery> {
      return withWrapper(() => client.request<GetProposalBookingQuery>(print(GetProposalBookingDocument), variables));
    },
    bulkUpsertScheduledEvents(variables: BulkUpsertScheduledEventsMutationVariables): Promise<BulkUpsertScheduledEventsMutation> {
      return withWrapper(() => client.request<BulkUpsertScheduledEventsMutation>(print(BulkUpsertScheduledEventsDocument), variables));
    },
    createScheduledEvent(variables: CreateScheduledEventMutationVariables): Promise<CreateScheduledEventMutation> {
      return withWrapper(() => client.request<CreateScheduledEventMutation>(print(CreateScheduledEventDocument), variables));
    },
    getEquipmentScheduledEvents(variables: GetEquipmentScheduledEventsQueryVariables): Promise<GetEquipmentScheduledEventsQuery> {
      return withWrapper(() => client.request<GetEquipmentScheduledEventsQuery>(print(GetEquipmentScheduledEventsDocument), variables));
    },
    getProposalBookingScheduledEvents(variables: GetProposalBookingScheduledEventsQueryVariables): Promise<GetProposalBookingScheduledEventsQuery> {
      return withWrapper(() => client.request<GetProposalBookingScheduledEventsQuery>(print(GetProposalBookingScheduledEventsDocument), variables));
    },
    getScheduledEventWithEquipments(variables: GetScheduledEventWithEquipmentsQueryVariables): Promise<GetScheduledEventWithEquipmentsQuery> {
      return withWrapper(() => client.request<GetScheduledEventWithEquipmentsQuery>(print(GetScheduledEventWithEquipmentsDocument), variables));
    },
    getScheduledEvents(variables: GetScheduledEventsQueryVariables): Promise<GetScheduledEventsQuery> {
      return withWrapper(() => client.request<GetScheduledEventsQuery>(print(GetScheduledEventsDocument), variables));
    },
    getScheduledEventsWithEquipments(variables: GetScheduledEventsWithEquipmentsQueryVariables): Promise<GetScheduledEventsWithEquipmentsQuery> {
      return withWrapper(() => client.request<GetScheduledEventsWithEquipmentsQuery>(print(GetScheduledEventsWithEquipmentsDocument), variables));
    },
    getUsers(variables?: GetUsersQueryVariables): Promise<GetUsersQuery> {
      return withWrapper(() => client.request<GetUsersQuery>(print(GetUsersDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;