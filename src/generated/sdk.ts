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

export type ActivateScheduledEventInput = {
  id: Scalars['Int'];
};

export type AddLostTimeInput = {
  lostTime: SimpleLostTimeInput;
  proposalBookingId: Scalars['Int'];
};

export type AddProposalWorkflowStatusInput = {
  droppableGroupId: Scalars['String'];
  nextProposalStatusId?: Maybe<Scalars['Int']>;
  parentDroppableGroupId?: Maybe<Scalars['String']>;
  prevProposalStatusId?: Maybe<Scalars['Int']>;
  proposalStatusId: Scalars['Int'];
  proposalWorkflowId: Scalars['Int'];
  sortOrder: Scalars['Int'];
};

export type AddStatusChangingEventsToConnectionInput = {
  proposalWorkflowConnectionId: Scalars['Int'];
  statusChangingEvents: Array<Scalars['String']>;
};

export type AddTechnicalReviewInput = {
  comment?: Maybe<Scalars['String']>;
  proposalPk: Scalars['Int'];
  publicComment?: Maybe<Scalars['String']>;
  reviewerId?: Maybe<Scalars['Int']>;
  status?: Maybe<TechnicalReviewStatus>;
  submitted?: Maybe<Scalars['Boolean']>;
  timeAllocation?: Maybe<Scalars['Int']>;
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
  answerId: Maybe<Scalars['Int']>;
  config: FieldConfig;
  dependencies: Array<FieldDependency>;
  dependenciesOperator: Maybe<DependenciesLogicOperator>;
  question: Question;
  sortOrder: Scalars['Int'];
  topicId: Scalars['Int'];
  value: Maybe<Scalars['IntStringDateBoolArray']>;
};

export type AnswerBasic = {
  __typename?: 'AnswerBasic';
  answer: Scalars['IntStringDateBoolArray'];
  answerId: Maybe<Scalars['Int']>;
  createdAt: Scalars['DateTime'];
  questionId: Scalars['String'];
  questionaryId: Scalars['Int'];
};

export type AnswerInput = {
  questionId: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type ApiAccessTokenResponseWrap = {
  __typename?: 'ApiAccessTokenResponseWrap';
  apiAccessToken: Maybe<PermissionsWithAccessToken>;
  rejection: Maybe<Rejection>;
};

export type AssignChairOrSecretaryToSepInput = {
  roleId: UserRole;
  sepId: Scalars['Int'];
  userId: Scalars['Int'];
};

export type AssignEquipmentsToScheduledEventInput = {
  equipmentIds: Array<Scalars['Int']>;
  proposalBookingId: Scalars['Int'];
  scheduledEventId: Scalars['Int'];
};

export type AssignInstrumentsToCallInput = {
  callId: Scalars['Int'];
  instrumentIds: Array<Scalars['Int']>;
};

export type AuthJwtApiTokenPayload = {
  __typename?: 'AuthJwtApiTokenPayload';
  accessTokenId: Scalars['String'];
};

export type AuthJwtPayload = {
  __typename?: 'AuthJwtPayload';
  currentRole: Role;
  roles: Array<Role>;
  user: User;
};

export type BasicUserDetails = {
  __typename?: 'BasicUserDetails';
  created: Maybe<Scalars['DateTime']>;
  firstname: Scalars['String'];
  id: Scalars['Int'];
  lastname: Scalars['String'];
  organisation: Scalars['String'];
  placeholder: Maybe<Scalars['Boolean']>;
  position: Scalars['String'];
};

export type BasicUserDetailsResponseWrap = {
  __typename?: 'BasicUserDetailsResponseWrap';
  rejection: Maybe<Rejection>;
  user: Maybe<BasicUserDetails>;
};

export type BooleanConfig = {
  __typename?: 'BooleanConfig';
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
};

export type Call = {
  __typename?: 'Call';
  allocationTimeUnit: AllocationTimeUnits;
  cycleComment: Scalars['String'];
  description: Maybe<Scalars['String']>;
  endCall: Scalars['DateTime'];
  endCycle: Scalars['DateTime'];
  endNotify: Scalars['DateTime'];
  endReview: Scalars['DateTime'];
  endSEPReview: Maybe<Scalars['DateTime']>;
  esiTemplateId: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  instruments: Array<InstrumentWithAvailabilityTime>;
  isActive: Scalars['Boolean'];
  proposalCount: Scalars['Int'];
  proposalSequence: Maybe<Scalars['Int']>;
  proposalWorkflow: Maybe<ProposalWorkflow>;
  proposalWorkflowId: Maybe<Scalars['Int']>;
  referenceNumberFormat: Maybe<Scalars['String']>;
  shortCode: Scalars['String'];
  startCall: Scalars['DateTime'];
  startCycle: Scalars['DateTime'];
  startNotify: Scalars['DateTime'];
  startReview: Scalars['DateTime'];
  startSEPReview: Maybe<Scalars['DateTime']>;
  surveyComment: Scalars['String'];
  template: Template;
  templateId: Scalars['Int'];
  title: Maybe<Scalars['String']>;
};

export type CallResponseWrap = {
  __typename?: 'CallResponseWrap';
  call: Maybe<Call>;
  rejection: Maybe<Rejection>;
};

export type CallsFilter = {
  isActive?: Maybe<Scalars['Boolean']>;
  isEnded?: Maybe<Scalars['Boolean']>;
  isReviewEnded?: Maybe<Scalars['Boolean']>;
  isSEPReviewEnded?: Maybe<Scalars['Boolean']>;
  templateIds?: Maybe<Array<Scalars['Int']>>;
};

export type ChangeProposalsStatusInput = {
  proposals: Array<ProposalPkWithCallId>;
  statusId: Scalars['Int'];
};

export type CheckExternalTokenWrap = {
  __typename?: 'CheckExternalTokenWrap';
  rejection: Maybe<Rejection>;
  token: Maybe<Scalars['String']>;
};

export type CloneProposalsInput = {
  callId: Scalars['Int'];
  proposalsToClonePk: Array<Scalars['Int']>;
};

export type ConfirmEquipmentAssignmentInput = {
  equipmentId: Scalars['Int'];
  newStatus: EquipmentAssignmentStatus;
  scheduledEventId: Scalars['Int'];
};

export type CreateApiAccessTokenInput = {
  accessPermissions: Scalars['String'];
  name: Scalars['String'];
};

export type CreateCallInput = {
  allocationTimeUnit: AllocationTimeUnits;
  cycleComment: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  endCall: Scalars['DateTime'];
  endCycle: Scalars['DateTime'];
  endNotify: Scalars['DateTime'];
  endReview: Scalars['DateTime'];
  endSEPReview?: Maybe<Scalars['DateTime']>;
  esiTemplateId?: Maybe<Scalars['Int']>;
  proposalSequence?: Maybe<Scalars['Int']>;
  proposalWorkflowId: Scalars['Int'];
  referenceNumberFormat?: Maybe<Scalars['String']>;
  shortCode: Scalars['String'];
  startCall: Scalars['DateTime'];
  startCycle: Scalars['DateTime'];
  startNotify: Scalars['DateTime'];
  startReview: Scalars['DateTime'];
  startSEPReview?: Maybe<Scalars['DateTime']>;
  surveyComment: Scalars['String'];
  templateId: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
};

export type CreateProposalStatusInput = {
  description: Scalars['String'];
  name: Scalars['String'];
  shortCode: Scalars['String'];
};

export type CreateProposalWorkflowInput = {
  description: Scalars['String'];
  name: Scalars['String'];
};

export type CreateUserByEmailInviteResponseWrap = {
  __typename?: 'CreateUserByEmailInviteResponseWrap';
  id: Maybe<Scalars['Int']>;
  rejection: Maybe<Rejection>;
};

export enum DataType {
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  EMBELLISHMENT = 'EMBELLISHMENT',
  FILE_UPLOAD = 'FILE_UPLOAD',
  GENERIC_TEMPLATE = 'GENERIC_TEMPLATE',
  GENERIC_TEMPLATE_BASIS = 'GENERIC_TEMPLATE_BASIS',
  INTERVAL = 'INTERVAL',
  NUMBER_INPUT = 'NUMBER_INPUT',
  PROPOSAL_BASIS = 'PROPOSAL_BASIS',
  PROPOSAL_ESI_BASIS = 'PROPOSAL_ESI_BASIS',
  RICH_TEXT_INPUT = 'RICH_TEXT_INPUT',
  SAMPLE_BASIS = 'SAMPLE_BASIS',
  SAMPLE_DECLARATION = 'SAMPLE_DECLARATION',
  SAMPLE_ESI_BASIS = 'SAMPLE_ESI_BASIS',
  SELECTION_FROM_OPTIONS = 'SELECTION_FROM_OPTIONS',
  SHIPMENT_BASIS = 'SHIPMENT_BASIS',
  TEXT_INPUT = 'TEXT_INPUT',
  VISIT_BASIS = 'VISIT_BASIS'
}

export type DateConfig = {
  __typename?: 'DateConfig';
  defaultDate: Maybe<Scalars['String']>;
  includeTime: Scalars['Boolean'];
  maxDate: Maybe<Scalars['String']>;
  minDate: Maybe<Scalars['String']>;
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
};


export type DbStat = {
  __typename?: 'DbStat';
  state: Maybe<Scalars['String']>;
  total: Scalars['Float'];
};

export type DeleteApiAccessTokenInput = {
  accessTokenId: Scalars['String'];
};

export type DeleteEquipmentAssignmentInput = {
  equipmentId: Scalars['Int'];
  proposalBookingId: Scalars['Int'];
  scheduledEventId: Scalars['Int'];
};

export type DeleteLostTimeInput = {
  id: Scalars['Int'];
};

export type DeleteProposalWorkflowStatusInput = {
  proposalStatusId: Scalars['Int'];
  proposalWorkflowId: Scalars['Int'];
  sortOrder: Scalars['Int'];
};

export type DeleteScheduledEventsInput = {
  ids: Array<Scalars['Int']>;
  instrumentId: Scalars['Int'];
  proposalBookingId: Scalars['Int'];
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
  html: Scalars['String'];
  omitFromPdf: Scalars['Boolean'];
  plain: Scalars['String'];
};

export type Entry = {
  __typename?: 'Entry';
  id: Scalars['Int'];
  value: Scalars['String'];
};

export type Equipment = {
  __typename?: 'Equipment';
  autoAccept: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  description: Maybe<Scalars['String']>;
  equipmentResponsible: Array<User>;
  events: Array<ScheduledEvent>;
  id: Scalars['Int'];
  maintenanceEndsAt: Maybe<Scalars['TzLessDateTime']>;
  maintenanceStartsAt: Maybe<Scalars['TzLessDateTime']>;
  name: Scalars['String'];
  owner: Maybe<User>;
  updatedAt: Scalars['DateTime'];
};


export type EquipmentEventsArgs = {
  endsAt: Scalars['TzLessDateTime'];
  startsAt: Scalars['TzLessDateTime'];
};

export enum EquipmentAssignmentStatus {
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED'
}

export type EquipmentInput = {
  autoAccept: Scalars['Boolean'];
  description: Scalars['String'];
  maintenanceEndsAt?: Maybe<Scalars['TzLessDateTime']>;
  maintenanceStartsAt?: Maybe<Scalars['TzLessDateTime']>;
  name: Scalars['String'];
};

export type EquipmentResponseWrap = {
  __typename?: 'EquipmentResponseWrap';
  equipment: Maybe<Equipment>;
  error: Maybe<Scalars['String']>;
};

export type EquipmentResponsibleInput = {
  equipmentId: Scalars['Int'];
  userIds: Array<Scalars['Int']>;
};

export type EquipmentWithAssignmentStatus = {
  __typename?: 'EquipmentWithAssignmentStatus';
  autoAccept: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  description: Maybe<Scalars['String']>;
  equipmentResponsible: Array<User>;
  events: Array<ScheduledEvent>;
  id: Scalars['Int'];
  maintenanceEndsAt: Maybe<Scalars['TzLessDateTime']>;
  maintenanceStartsAt: Maybe<Scalars['TzLessDateTime']>;
  name: Scalars['String'];
  owner: Maybe<User>;
  status: EquipmentAssignmentStatus;
  updatedAt: Scalars['DateTime'];
};


export type EquipmentWithAssignmentStatusEventsArgs = {
  endsAt: Scalars['TzLessDateTime'];
  startsAt: Scalars['TzLessDateTime'];
};

export type EsiResponseWrap = {
  __typename?: 'EsiResponseWrap';
  esi: Maybe<ExperimentSafetyInput>;
  rejection: Maybe<Rejection>;
};

export enum EvaluatorOperator {
  EQ = 'eq',
  NEQ = 'neq'
}

export enum Event {
  CALL_ENDED = 'CALL_ENDED',
  CALL_REVIEW_ENDED = 'CALL_REVIEW_ENDED',
  CALL_SEP_REVIEW_ENDED = 'CALL_SEP_REVIEW_ENDED',
  EMAIL_INVITE = 'EMAIL_INVITE',
  PROPOSAL_ACCEPTED = 'PROPOSAL_ACCEPTED',
  PROPOSAL_ALL_SEP_REVIEWERS_SELECTED = 'PROPOSAL_ALL_SEP_REVIEWERS_SELECTED',
  PROPOSAL_ALL_SEP_REVIEWS_SUBMITTED = 'PROPOSAL_ALL_SEP_REVIEWS_SUBMITTED',
  PROPOSAL_BOOKING_TIME_ACTIVATED = 'PROPOSAL_BOOKING_TIME_ACTIVATED',
  PROPOSAL_BOOKING_TIME_COMPLETED = 'PROPOSAL_BOOKING_TIME_COMPLETED',
  PROPOSAL_BOOKING_TIME_SLOTS_REMOVED = 'PROPOSAL_BOOKING_TIME_SLOTS_REMOVED',
  PROPOSAL_BOOKING_TIME_SLOT_ADDED = 'PROPOSAL_BOOKING_TIME_SLOT_ADDED',
  PROPOSAL_BOOKING_TIME_UPDATED = 'PROPOSAL_BOOKING_TIME_UPDATED',
  PROPOSAL_CLONED = 'PROPOSAL_CLONED',
  PROPOSAL_CREATED = 'PROPOSAL_CREATED',
  PROPOSAL_FEASIBILITY_REVIEW_SUBMITTED = 'PROPOSAL_FEASIBILITY_REVIEW_SUBMITTED',
  PROPOSAL_FEASIBILITY_REVIEW_UPDATED = 'PROPOSAL_FEASIBILITY_REVIEW_UPDATED',
  PROPOSAL_FEASIBLE = 'PROPOSAL_FEASIBLE',
  PROPOSAL_INSTRUMENT_SELECTED = 'PROPOSAL_INSTRUMENT_SELECTED',
  PROPOSAL_INSTRUMENT_SUBMITTED = 'PROPOSAL_INSTRUMENT_SUBMITTED',
  PROPOSAL_MANAGEMENT_DECISION_SUBMITTED = 'PROPOSAL_MANAGEMENT_DECISION_SUBMITTED',
  PROPOSAL_MANAGEMENT_DECISION_UPDATED = 'PROPOSAL_MANAGEMENT_DECISION_UPDATED',
  PROPOSAL_NOTIFIED = 'PROPOSAL_NOTIFIED',
  PROPOSAL_REJECTED = 'PROPOSAL_REJECTED',
  PROPOSAL_RESERVED = 'PROPOSAL_RESERVED',
  PROPOSAL_SAMPLE_REVIEW_SUBMITTED = 'PROPOSAL_SAMPLE_REVIEW_SUBMITTED',
  PROPOSAL_SAMPLE_SAFE = 'PROPOSAL_SAMPLE_SAFE',
  PROPOSAL_SEP_MEETING_RANKING_OVERWRITTEN = 'PROPOSAL_SEP_MEETING_RANKING_OVERWRITTEN',
  PROPOSAL_SEP_MEETING_REORDER = 'PROPOSAL_SEP_MEETING_REORDER',
  PROPOSAL_SEP_MEETING_SAVED = 'PROPOSAL_SEP_MEETING_SAVED',
  PROPOSAL_SEP_MEETING_SUBMITTED = 'PROPOSAL_SEP_MEETING_SUBMITTED',
  PROPOSAL_SEP_REVIEW_SUBMITTED = 'PROPOSAL_SEP_REVIEW_SUBMITTED',
  PROPOSAL_SEP_REVIEW_UPDATED = 'PROPOSAL_SEP_REVIEW_UPDATED',
  PROPOSAL_SEP_SELECTED = 'PROPOSAL_SEP_SELECTED',
  PROPOSAL_STATUS_CHANGED_BY_USER = 'PROPOSAL_STATUS_CHANGED_BY_USER',
  PROPOSAL_STATUS_CHANGED_BY_WORKFLOW = 'PROPOSAL_STATUS_CHANGED_BY_WORKFLOW',
  PROPOSAL_STATUS_UPDATED = 'PROPOSAL_STATUS_UPDATED',
  PROPOSAL_SUBMITTED = 'PROPOSAL_SUBMITTED',
  PROPOSAL_UNFEASIBLE = 'PROPOSAL_UNFEASIBLE',
  PROPOSAL_UPDATED = 'PROPOSAL_UPDATED',
  SEP_CREATED = 'SEP_CREATED',
  SEP_MEMBERS_ASSIGNED = 'SEP_MEMBERS_ASSIGNED',
  SEP_MEMBER_ASSIGNED_TO_PROPOSAL = 'SEP_MEMBER_ASSIGNED_TO_PROPOSAL',
  SEP_MEMBER_REMOVED = 'SEP_MEMBER_REMOVED',
  SEP_MEMBER_REMOVED_FROM_PROPOSAL = 'SEP_MEMBER_REMOVED_FROM_PROPOSAL',
  SEP_PROPOSAL_REMOVED = 'SEP_PROPOSAL_REMOVED',
  SEP_UPDATED = 'SEP_UPDATED',
  TOPIC_ANSWERED = 'TOPIC_ANSWERED',
  USER_CREATED = 'USER_CREATED',
  USER_DELETED = 'USER_DELETED',
  USER_PASSWORD_RESET_EMAIL = 'USER_PASSWORD_RESET_EMAIL',
  USER_ROLE_UPDATED = 'USER_ROLE_UPDATED',
  USER_UPDATED = 'USER_UPDATED'
}

export type EventLog = {
  __typename?: 'EventLog';
  changedBy: User;
  changedObjectId: Scalars['String'];
  eventTStamp: Scalars['DateTime'];
  eventType: Scalars['String'];
  id: Scalars['Int'];
  rowData: Scalars['String'];
};

export type ExperimentSafetyInput = {
  __typename?: 'ExperimentSafetyInput';
  created: Scalars['DateTime'];
  creatorId: Scalars['Int'];
  id: Scalars['Int'];
  isSubmitted: Scalars['Boolean'];
  proposal: Proposal;
  questionary: Questionary;
  questionaryId: Scalars['Int'];
  sampleEsis: Array<SampleExperimentSafetyInput>;
  scheduledEventId: Scalars['Int'];
};

export type Feature = {
  __typename?: 'Feature';
  description: Scalars['String'];
  id: FeatureId;
  isEnabled: Scalars['Boolean'];
};

export enum FeatureId {
  EXTERNAL_AUTH = 'EXTERNAL_AUTH',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  SCHEDULER = 'SCHEDULER',
  SHIPPING = 'SHIPPING'
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

export type FieldConfig = BooleanConfig | DateConfig | EmbellishmentConfig | FileUploadConfig | GenericTemplateBasisConfig | IntervalConfig | NumberInputConfig | ProposalBasisConfig | ProposalEsiBasisConfig | RichTextInputConfig | SampleBasisConfig | SampleDeclarationConfig | SampleEsiBasisConfig | SelectionFromOptionsConfig | ShipmentBasisConfig | SubTemplateConfig | TextInputConfig | VisitBasisConfig;

export type FieldDependency = {
  __typename?: 'FieldDependency';
  condition: FieldCondition;
  dependencyId: Scalars['String'];
  dependencyNaturalKey: Scalars['String'];
  questionId: Scalars['String'];
};

export type FieldDependencyInput = {
  condition: FieldConditionInput;
  dependencyId: Scalars['String'];
};

export type Fields = {
  __typename?: 'Fields';
  countries: Array<Entry>;
  nationalities: Array<Entry>;
};

export type FileMetadata = {
  __typename?: 'FileMetadata';
  createdDate: Scalars['DateTime'];
  fileId: Scalars['String'];
  mimeType: Scalars['String'];
  originalFileName: Scalars['String'];
  sizeInBytes: Scalars['Int'];
};

export type FileUploadConfig = {
  __typename?: 'FileUploadConfig';
  file_type: Array<Scalars['String']>;
  max_files: Scalars['Int'];
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
};

export type FinalizeScheduledEventInput = {
  action: ProposalBookingFinalizeAction;
  id: Scalars['Int'];
};

export type GenericTemplate = {
  __typename?: 'GenericTemplate';
  created: Scalars['DateTime'];
  creatorId: Scalars['Int'];
  id: Scalars['Int'];
  proposal: Proposal;
  proposalPk: Scalars['Int'];
  questionId: Scalars['String'];
  questionary: Questionary;
  questionaryId: Scalars['Int'];
  title: Scalars['String'];
};

export type GenericTemplateBasisConfig = {
  __typename?: 'GenericTemplateBasisConfig';
  questionLabel: Scalars['String'];
  titlePlaceholder: Scalars['String'];
};

export type GenericTemplateResponseWrap = {
  __typename?: 'GenericTemplateResponseWrap';
  genericTemplate: Maybe<GenericTemplate>;
  rejection: Maybe<Rejection>;
};

export type GenericTemplatesFilter = {
  creatorId?: Maybe<Scalars['Int']>;
  genericTemplateIds?: Maybe<Array<Scalars['Int']>>;
  proposalPk?: Maybe<Scalars['Int']>;
  questionId?: Maybe<Scalars['String']>;
  questionaryIds?: Maybe<Array<Scalars['Int']>>;
  title?: Maybe<Scalars['String']>;
};

export type HealthStats = {
  __typename?: 'HealthStats';
  dbStats: Array<DbStat>;
  message: Scalars['String'];
};

export type IndexWithGroupId = {
  droppableId: Scalars['String'];
  index: Scalars['Int'];
};

export type Institution = {
  __typename?: 'Institution';
  id: Scalars['Int'];
  name: Scalars['String'];
  verified: Scalars['Boolean'];
};

export type InstitutionResponseWrap = {
  __typename?: 'InstitutionResponseWrap';
  institution: Maybe<Institution>;
  rejection: Maybe<Rejection>;
};

export type InstitutionsFilter = {
  isVerified?: Maybe<Scalars['Boolean']>;
};

export type Instrument = {
  __typename?: 'Instrument';
  description: Scalars['String'];
  id: Scalars['Int'];
  managerUserId: Scalars['Int'];
  name: Scalars['String'];
  scientists: Array<BasicUserDetails>;
  shortCode: Scalars['String'];
};

export type InstrumentResponseWrap = {
  __typename?: 'InstrumentResponseWrap';
  instrument: Maybe<Instrument>;
  rejection: Maybe<Rejection>;
};

export type InstrumentWithAvailabilityTime = {
  __typename?: 'InstrumentWithAvailabilityTime';
  availabilityTime: Maybe<Scalars['Int']>;
  description: Scalars['String'];
  id: Scalars['Int'];
  managerUserId: Scalars['Int'];
  name: Scalars['String'];
  scientists: Array<BasicUserDetails>;
  shortCode: Scalars['String'];
  submitted: Maybe<Scalars['Boolean']>;
};

export type InstrumentsQueryResult = {
  __typename?: 'InstrumentsQueryResult';
  instruments: Array<Instrument>;
  totalCount: Scalars['Int'];
};


export type IntervalConfig = {
  __typename?: 'IntervalConfig';
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
  units: Maybe<Array<Scalars['String']>>;
};

export type LostTime = {
  __typename?: 'LostTime';
  createdAt: Scalars['DateTime'];
  endsAt: Scalars['TzLessDateTime'];
  id: Scalars['Int'];
  proposalBookingId: Scalars['Int'];
  scheduledEventId: Scalars['Int'];
  startsAt: Scalars['TzLessDateTime'];
  updatedAt: Scalars['DateTime'];
};

export type LostTimeResponseWrap = {
  __typename?: 'LostTimeResponseWrap';
  error: Maybe<Scalars['String']>;
  lostTime: Maybe<LostTime>;
};

export type MoveProposalWorkflowStatusInput = {
  from: IndexWithGroupId;
  proposalWorkflowId: Scalars['Int'];
  to: IndexWithGroupId;
};

export type Mutation = {
  __typename?: 'Mutation';
  activateProposalBooking: ProposalBookingResponseWrap;
  activateScheduledEvent: ScheduledEventResponseWrap;
  addClientLog: SuccessResponseWrap;
  addEquipmentResponsible: Scalars['Boolean'];
  addLostTime: LostTimeResponseWrap;
  addProposalWorkflowStatus: ProposalWorkflowConnectionResponseWrap;
  addReview: ReviewWithNextStatusResponseWrap;
  addSamplesToShipment: ShipmentResponseWrap;
  addStatusChangingEventsToConnection: ProposalStatusChangingEventResponseWrap;
  addTechnicalReview: TechnicalReviewResponseWrap;
  addUserForReview: ReviewResponseWrap;
  addUserRole: AddUserRoleResponseWrap;
  administrationProposal: ProposalResponseWrap;
  answerTopic: QuestionaryStepResponseWrap;
  applyPatches: PrepareDbResponseWrap;
  assignChairOrSecretary: SepResponseWrap;
  assignInstrumentsToCall: CallResponseWrap;
  assignProposalsToInstrument: SuccessResponseWrap;
  assignProposalsToSep: NextProposalStatusResponseWrap;
  assignReviewersToSEP: SepResponseWrap;
  assignScientistsToInstrument: SuccessResponseWrap;
  assignSepReviewersToProposal: SepResponseWrap;
  assignToScheduledEvents: Scalars['Boolean'];
  changeProposalsStatus: SuccessResponseWrap;
  checkExternalToken: CheckExternalTokenWrap;
  cloneGenericTemplate: GenericTemplateResponseWrap;
  cloneProposals: ProposalsResponseWrap;
  cloneSample: SampleResponseWrap;
  cloneTemplate: TemplateResponseWrap;
  confirmEquipmentAssignment: Scalars['Boolean'];
  createApiAccessToken: ApiAccessTokenResponseWrap;
  createCall: CallResponseWrap;
  createEquipment: EquipmentResponseWrap;
  createEsi: EsiResponseWrap;
  createGenericTemplate: GenericTemplateResponseWrap;
  createInstitution: InstitutionResponseWrap;
  createInstrument: InstrumentResponseWrap;
  createProposal: ProposalResponseWrap;
  createProposalStatus: ProposalStatusResponseWrap;
  createProposalWorkflow: ProposalWorkflowResponseWrap;
  createQuestion: QuestionResponseWrap;
  createQuestionTemplateRelation: TemplateResponseWrap;
  createQuestionary: QuestionaryResponseWrap;
  createSEP: SepResponseWrap;
  createSample: SampleResponseWrap;
  createSampleEsi: SampleEsiResponseWrap;
  createScheduledEvent: ScheduledEventResponseWrap;
  createShipment: ShipmentResponseWrap;
  createTemplate: TemplateResponseWrap;
  createTopic: TemplateResponseWrap;
  createUnit: UnitResponseWrap;
  createUser: UserResponseWrap;
  createUserByEmailInvite: CreateUserByEmailInviteResponseWrap;
  createVisit: VisitResponseWrap;
  createVisitRegistrationQuestionary: VisitRegistrationResponseWrap;
  deleteApiAccessToken: SuccessResponseWrap;
  deleteCall: CallResponseWrap;
  deleteEquipmentAssignment: Scalars['Boolean'];
  deleteGenericTemplate: GenericTemplateResponseWrap;
  deleteInstitution: InstitutionResponseWrap;
  deleteInstrument: InstrumentResponseWrap;
  deleteLostTime: LostTimeResponseWrap;
  deleteProposal: ProposalResponseWrap;
  deleteProposalStatus: ProposalStatusResponseWrap;
  deleteProposalWorkflow: ProposalWorkflowResponseWrap;
  deleteProposalWorkflowStatus: SuccessResponseWrap;
  deleteQuestion: QuestionResponseWrap;
  deleteQuestionTemplateRelation: TemplateResponseWrap;
  deleteSEP: SepResponseWrap;
  deleteSample: SampleResponseWrap;
  deleteSampleEsi: SampleEsiResponseWrap;
  deleteScheduledEvents: ScheduledEventsResponseWrap;
  deleteShipment: ShipmentResponseWrap;
  deleteTemplate: TemplateResponseWrap;
  deleteTopic: TemplateResponseWrap;
  deleteUnit: UnitResponseWrap;
  deleteUser: UserResponseWrap;
  deleteVisit: VisitResponseWrap;
  emailVerification: EmailVerificationResponseWrap;
  finalizeProposalBooking: ProposalBookingResponseWrap;
  finalizeScheduledEvent: ScheduledEventResponseWrap;
  getTokenForUser: TokenResponseWrap;
  login: TokenResponseWrap;
  moveProposalWorkflowStatus: ProposalWorkflowConnectionResponseWrap;
  notifyProposal: ProposalResponseWrap;
  prepareDB: PrepareDbResponseWrap;
  removeAssignedInstrumentFromCall: CallResponseWrap;
  removeMemberFromSEPProposal: SepResponseWrap;
  removeMemberFromSep: SepResponseWrap;
  removeProposalsFromInstrument: SuccessResponseWrap;
  removeProposalsFromSep: SepResponseWrap;
  removeScientistFromInstrument: SuccessResponseWrap;
  removeUserForReview: ReviewResponseWrap;
  reorderSepMeetingDecisionProposals: SepMeetingDecisionResponseWrap;
  resetPassword: BasicUserDetailsResponseWrap;
  resetPasswordEmail: SuccessResponseWrap;
  resetSchedulerDb: Scalars['String'];
  saveSepMeetingDecision: SepMeetingDecisionResponseWrap;
  selectRole: TokenResponseWrap;
  setActiveTemplate: SuccessResponseWrap;
  setInstrumentAvailabilityTime: SuccessResponseWrap;
  setPageContent: PageResponseWrap;
  setUserEmailVerified: UserResponseWrap;
  setUserNotPlaceholder: UserResponseWrap;
  submitInstrument: SuccessResponseWrap;
  submitProposal: ProposalResponseWrap;
  submitProposalsReview: SuccessResponseWrap;
  submitShipment: ShipmentResponseWrap;
  submitTechnicalReview: TechnicalReviewResponseWrap;
  token: TokenResponseWrap;
  updateAnswer: UpdateAnswerResponseWrap;
  updateApiAccessToken: ApiAccessTokenResponseWrap;
  updateCall: CallResponseWrap;
  updateEquipment: EquipmentResponseWrap;
  updateEsi: EsiResponseWrap;
  updateGenericTemplate: GenericTemplateResponseWrap;
  updateInstitution: InstitutionResponseWrap;
  updateInstrument: InstrumentResponseWrap;
  updateLostTime: LostTimeResponseWrap;
  updatePassword: BasicUserDetailsResponseWrap;
  updateProposal: ProposalResponseWrap;
  updateProposalStatus: ProposalStatusResponseWrap;
  updateProposalWorkflow: ProposalWorkflowResponseWrap;
  updateQuestion: QuestionResponseWrap;
  updateQuestionTemplateRelation: TemplateResponseWrap;
  updateQuestionTemplateRelationSettings: TemplateResponseWrap;
  updateSEP: SepResponseWrap;
  updateSEPTimeAllocation: SepProposalResponseWrap;
  updateSample: SampleResponseWrap;
  updateSampleEsi: SampleEsiResponseWrap;
  updateScheduledEvent: ScheduledEventResponseWrap;
  updateShipment: ShipmentResponseWrap;
  updateTechnicalReviewAssignee: ProposalsResponseWrap;
  updateTemplate: TemplateResponseWrap;
  updateTopic: TemplateResponseWrap;
  updateUser: UserResponseWrap;
  updateUserRoles: UserResponseWrap;
  updateVisit: VisitResponseWrap;
  updateVisitRegistration: VisitRegistrationResponseWrap;
};


export type MutationActivateProposalBookingArgs = {
  id: Scalars['Int'];
};


export type MutationActivateScheduledEventArgs = {
  activateScheduledEvent: ActivateScheduledEventInput;
};


export type MutationAddClientLogArgs = {
  error: Scalars['String'];
};


export type MutationAddEquipmentResponsibleArgs = {
  equipmentResponsibleInput: EquipmentResponsibleInput;
};


export type MutationAddLostTimeArgs = {
  addLostTimeInput: AddLostTimeInput;
};


export type MutationAddProposalWorkflowStatusArgs = {
  newProposalWorkflowStatusInput: AddProposalWorkflowStatusInput;
};


export type MutationAddReviewArgs = {
  comment: Scalars['String'];
  grade: Scalars['Int'];
  reviewID: Scalars['Int'];
  sepID: Scalars['Int'];
  status: ReviewStatus;
};


export type MutationAddSamplesToShipmentArgs = {
  sampleIds: Array<Scalars['Int']>;
  shipmentId: Scalars['Int'];
};


export type MutationAddStatusChangingEventsToConnectionArgs = {
  addStatusChangingEventsToConnectionInput: AddStatusChangingEventsToConnectionInput;
};


export type MutationAddTechnicalReviewArgs = {
  addTechnicalReviewInput: AddTechnicalReviewInput;
};


export type MutationAddUserForReviewArgs = {
  proposalPk: Scalars['Int'];
  sepID: Scalars['Int'];
  userID: Scalars['Int'];
};


export type MutationAddUserRoleArgs = {
  roleID: Scalars['Int'];
  userID: Scalars['Int'];
};


export type MutationAdministrationProposalArgs = {
  commentForManagement?: Maybe<Scalars['String']>;
  commentForUser?: Maybe<Scalars['String']>;
  finalStatus?: Maybe<ProposalEndStatus>;
  managementDecisionSubmitted?: Maybe<Scalars['Boolean']>;
  managementTimeAllocation?: Maybe<Scalars['Int']>;
  proposalPk: Scalars['Int'];
  statusId?: Maybe<Scalars['Int']>;
};


export type MutationAnswerTopicArgs = {
  answers: Array<AnswerInput>;
  isPartialSave?: Maybe<Scalars['Boolean']>;
  questionaryId: Scalars['Int'];
  topicId: Scalars['Int'];
};


export type MutationAssignChairOrSecretaryArgs = {
  assignChairOrSecretaryToSEPInput: AssignChairOrSecretaryToSepInput;
};


export type MutationAssignInstrumentsToCallArgs = {
  assignInstrumentsToCallInput: AssignInstrumentsToCallInput;
};


export type MutationAssignProposalsToInstrumentArgs = {
  instrumentId: Scalars['Int'];
  proposals: Array<ProposalPkWithCallId>;
};


export type MutationAssignProposalsToSepArgs = {
  proposals: Array<ProposalPkWithCallId>;
  sepId: Scalars['Int'];
};


export type MutationAssignReviewersToSepArgs = {
  memberIds: Array<Scalars['Int']>;
  sepId: Scalars['Int'];
};


export type MutationAssignScientistsToInstrumentArgs = {
  instrumentId: Scalars['Int'];
  scientistIds: Array<Scalars['Int']>;
};


export type MutationAssignSepReviewersToProposalArgs = {
  memberIds: Array<Scalars['Int']>;
  proposalPk: Scalars['Int'];
  sepId: Scalars['Int'];
};


export type MutationAssignToScheduledEventsArgs = {
  assignEquipmentsToScheduledEventInput: AssignEquipmentsToScheduledEventInput;
};


export type MutationChangeProposalsStatusArgs = {
  changeProposalsStatusInput: ChangeProposalsStatusInput;
};


export type MutationCheckExternalTokenArgs = {
  externalToken: Scalars['String'];
};


export type MutationCloneGenericTemplateArgs = {
  genericTemplateId: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
};


export type MutationCloneProposalsArgs = {
  cloneProposalsInput: CloneProposalsInput;
};


export type MutationCloneSampleArgs = {
  sampleId: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
};


export type MutationCloneTemplateArgs = {
  templateId: Scalars['Int'];
};


export type MutationConfirmEquipmentAssignmentArgs = {
  confirmEquipmentAssignmentInput: ConfirmEquipmentAssignmentInput;
};


export type MutationCreateApiAccessTokenArgs = {
  createApiAccessTokenInput: CreateApiAccessTokenInput;
};


export type MutationCreateCallArgs = {
  createCallInput: CreateCallInput;
};


export type MutationCreateEquipmentArgs = {
  newEquipmentInput: EquipmentInput;
};


export type MutationCreateEsiArgs = {
  scheduledEventId: Scalars['Int'];
};


export type MutationCreateGenericTemplateArgs = {
  proposalPk: Scalars['Int'];
  questionId: Scalars['String'];
  templateId: Scalars['Int'];
  title: Scalars['String'];
};


export type MutationCreateInstitutionArgs = {
  name: Scalars['String'];
  verified: Scalars['Boolean'];
};


export type MutationCreateInstrumentArgs = {
  description: Scalars['String'];
  managerUserId: Scalars['Int'];
  name: Scalars['String'];
  shortCode: Scalars['String'];
};


export type MutationCreateProposalArgs = {
  callId: Scalars['Int'];
};


export type MutationCreateProposalStatusArgs = {
  newProposalStatusInput: CreateProposalStatusInput;
};


export type MutationCreateProposalWorkflowArgs = {
  newProposalWorkflowInput: CreateProposalWorkflowInput;
};


export type MutationCreateQuestionArgs = {
  categoryId: TemplateCategoryId;
  dataType: DataType;
};


export type MutationCreateQuestionTemplateRelationArgs = {
  questionId: Scalars['String'];
  sortOrder: Scalars['Int'];
  templateId: Scalars['Int'];
  topicId: Scalars['Int'];
};


export type MutationCreateQuestionaryArgs = {
  templateId: Scalars['Int'];
};


export type MutationCreateSepArgs = {
  active: Scalars['Boolean'];
  code: Scalars['String'];
  description: Scalars['String'];
  numberRatingsRequired?: Maybe<Scalars['Int']>;
};


export type MutationCreateSampleArgs = {
  isPostProposalSubmission?: Maybe<Scalars['Boolean']>;
  proposalPk: Scalars['Int'];
  questionId: Scalars['String'];
  templateId: Scalars['Int'];
  title: Scalars['String'];
};


export type MutationCreateSampleEsiArgs = {
  esiId: Scalars['Int'];
  sampleId: Scalars['Int'];
};


export type MutationCreateScheduledEventArgs = {
  newScheduledEvent: NewScheduledEventInput;
};


export type MutationCreateShipmentArgs = {
  proposalPk: Scalars['Int'];
  title: Scalars['String'];
  visitId: Scalars['Int'];
};


export type MutationCreateTemplateArgs = {
  description?: Maybe<Scalars['String']>;
  groupId: TemplateGroupId;
  name: Scalars['String'];
};


export type MutationCreateTopicArgs = {
  sortOrder?: Maybe<Scalars['Int']>;
  templateId: Scalars['Int'];
  title?: Maybe<Scalars['Int']>;
};


export type MutationCreateUnitArgs = {
  name: Scalars['String'];
};


export type MutationCreateUserArgs = {
  birthdate: Scalars['String'];
  department: Scalars['String'];
  email: Scalars['String'];
  firstname: Scalars['String'];
  gender: Scalars['String'];
  lastname: Scalars['String'];
  middlename?: Maybe<Scalars['String']>;
  nationality: Scalars['Int'];
  orcid: Scalars['String'];
  orcidHash: Scalars['String'];
  organisation: Scalars['Int'];
  otherOrganisation?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  position: Scalars['String'];
  preferredname?: Maybe<Scalars['String']>;
  refreshToken: Scalars['String'];
  telephone: Scalars['String'];
  telephone_alt?: Maybe<Scalars['String']>;
  user_title?: Maybe<Scalars['String']>;
};


export type MutationCreateUserByEmailInviteArgs = {
  email: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  userRole: UserRole;
};


export type MutationCreateVisitArgs = {
  scheduledEventId: Scalars['Int'];
  team: Array<Scalars['Int']>;
  teamLeadUserId: Scalars['Int'];
};


export type MutationCreateVisitRegistrationQuestionaryArgs = {
  visitId: Scalars['Int'];
};


export type MutationDeleteApiAccessTokenArgs = {
  deleteApiAccessTokenInput: DeleteApiAccessTokenInput;
};


export type MutationDeleteCallArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteEquipmentAssignmentArgs = {
  deleteEquipmentAssignmentInput: DeleteEquipmentAssignmentInput;
};


export type MutationDeleteGenericTemplateArgs = {
  genericTemplateId: Scalars['Int'];
};


export type MutationDeleteInstitutionArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteInstrumentArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteLostTimeArgs = {
  deleteLostTimeInput: DeleteLostTimeInput;
};


export type MutationDeleteProposalArgs = {
  proposalPk: Scalars['Int'];
};


export type MutationDeleteProposalStatusArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteProposalWorkflowArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteProposalWorkflowStatusArgs = {
  deleteProposalWorkflowStatusInput: DeleteProposalWorkflowStatusInput;
};


export type MutationDeleteQuestionArgs = {
  questionId: Scalars['String'];
};


export type MutationDeleteQuestionTemplateRelationArgs = {
  questionId: Scalars['String'];
  templateId: Scalars['Int'];
};


export type MutationDeleteSepArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteSampleArgs = {
  sampleId: Scalars['Int'];
};


export type MutationDeleteSampleEsiArgs = {
  esiId: Scalars['Int'];
  sampleId: Scalars['Int'];
};


export type MutationDeleteScheduledEventsArgs = {
  deleteScheduledEventsInput: DeleteScheduledEventsInput;
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


export type MutationFinalizeProposalBookingArgs = {
  action: ProposalBookingFinalizeAction;
  id: Scalars['Int'];
};


export type MutationFinalizeScheduledEventArgs = {
  finalizeScheduledEvent: FinalizeScheduledEventInput;
};


export type MutationGetTokenForUserArgs = {
  userId: Scalars['Int'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationMoveProposalWorkflowStatusArgs = {
  moveProposalWorkflowStatusInput: MoveProposalWorkflowStatusInput;
};


export type MutationNotifyProposalArgs = {
  proposalPk: Scalars['Int'];
};


export type MutationPrepareDbArgs = {
  includeSeeds?: Maybe<Scalars['Boolean']>;
};


export type MutationRemoveAssignedInstrumentFromCallArgs = {
  removeAssignedInstrumentFromCallInput: RemoveAssignedInstrumentFromCallInput;
};


export type MutationRemoveMemberFromSepProposalArgs = {
  memberId: Scalars['Int'];
  proposalPk: Scalars['Int'];
  sepId: Scalars['Int'];
};


export type MutationRemoveMemberFromSepArgs = {
  memberId: Scalars['Int'];
  roleId: UserRole;
  sepId: Scalars['Int'];
};


export type MutationRemoveProposalsFromInstrumentArgs = {
  proposalPks: Array<Scalars['Int']>;
};


export type MutationRemoveProposalsFromSepArgs = {
  proposalPks: Array<Scalars['Int']>;
  sepId: Scalars['Int'];
};


export type MutationRemoveScientistFromInstrumentArgs = {
  instrumentId: Scalars['Int'];
  scientistId: Scalars['Int'];
};


export type MutationRemoveUserForReviewArgs = {
  reviewId: Scalars['Int'];
  sepId: Scalars['Int'];
};


export type MutationReorderSepMeetingDecisionProposalsArgs = {
  reorderSepMeetingDecisionProposalsInput: ReorderSepMeetingDecisionProposalsInput;
};


export type MutationResetPasswordArgs = {
  password: Scalars['String'];
  token: Scalars['String'];
};


export type MutationResetPasswordEmailArgs = {
  email: Scalars['String'];
};


export type MutationResetSchedulerDbArgs = {
  includeSeeds?: Maybe<Scalars['Boolean']>;
};


export type MutationSaveSepMeetingDecisionArgs = {
  saveSepMeetingDecisionInput: SaveSepMeetingDecisionInput;
};


export type MutationSelectRoleArgs = {
  selectedRoleId?: Maybe<Scalars['Int']>;
  token: Scalars['String'];
};


export type MutationSetActiveTemplateArgs = {
  templateGroupId: TemplateGroupId;
  templateId: Scalars['Int'];
};


export type MutationSetInstrumentAvailabilityTimeArgs = {
  availabilityTime: Scalars['Int'];
  callId: Scalars['Int'];
  instrumentId: Scalars['Int'];
};


export type MutationSetPageContentArgs = {
  id: PageName;
  text: Scalars['String'];
};


export type MutationSetUserEmailVerifiedArgs = {
  id: Scalars['Int'];
};


export type MutationSetUserNotPlaceholderArgs = {
  id: Scalars['Int'];
};


export type MutationSubmitInstrumentArgs = {
  callId: Scalars['Int'];
  instrumentId: Scalars['Int'];
  sepId: Scalars['Int'];
};


export type MutationSubmitProposalArgs = {
  proposalPk: Scalars['Int'];
};


export type MutationSubmitProposalsReviewArgs = {
  submitProposalsReviewInput: SubmitProposalsReviewInput;
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


export type MutationUpdateAnswerArgs = {
  answer: AnswerInput;
  questionaryId: Scalars['Int'];
};


export type MutationUpdateApiAccessTokenArgs = {
  updateApiAccessTokenInput: UpdateApiAccessTokenInput;
};


export type MutationUpdateCallArgs = {
  updateCallInput: UpdateCallInput;
};


export type MutationUpdateEquipmentArgs = {
  id: Scalars['Int'];
  updateEquipmentInput: EquipmentInput;
};


export type MutationUpdateEsiArgs = {
  esiId: Scalars['Int'];
  isSubmitted?: Maybe<Scalars['Boolean']>;
};


export type MutationUpdateGenericTemplateArgs = {
  genericTemplateId: Scalars['Int'];
  safetyComment?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};


export type MutationUpdateInstitutionArgs = {
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  verified?: Maybe<Scalars['Boolean']>;
};


export type MutationUpdateInstrumentArgs = {
  description: Scalars['String'];
  id: Scalars['Int'];
  managerUserId: Scalars['Int'];
  name: Scalars['String'];
  shortCode: Scalars['String'];
};


export type MutationUpdateLostTimeArgs = {
  updateLostTimeInput: UpdateLostTimeInput;
};


export type MutationUpdatePasswordArgs = {
  id: Scalars['Int'];
  password: Scalars['String'];
};


export type MutationUpdateProposalArgs = {
  abstract?: Maybe<Scalars['String']>;
  proposalPk: Scalars['Int'];
  proposerId?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  users?: Maybe<Array<Scalars['Int']>>;
};


export type MutationUpdateProposalStatusArgs = {
  updatedProposalStatusInput: UpdateProposalStatusInput;
};


export type MutationUpdateProposalWorkflowArgs = {
  updatedProposalWorkflowInput: UpdateProposalWorkflowInput;
};


export type MutationUpdateQuestionArgs = {
  config?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  naturalKey?: Maybe<Scalars['String']>;
  question?: Maybe<Scalars['String']>;
};


export type MutationUpdateQuestionTemplateRelationArgs = {
  config?: Maybe<Scalars['String']>;
  questionId: Scalars['String'];
  sortOrder: Scalars['Int'];
  templateId: Scalars['Int'];
  topicId?: Maybe<Scalars['Int']>;
};


export type MutationUpdateQuestionTemplateRelationSettingsArgs = {
  config?: Maybe<Scalars['String']>;
  dependencies: Array<FieldDependencyInput>;
  dependenciesOperator?: Maybe<DependenciesLogicOperator>;
  questionId: Scalars['String'];
  templateId: Scalars['Int'];
};


export type MutationUpdateSepArgs = {
  active: Scalars['Boolean'];
  code: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['Int'];
  numberRatingsRequired?: Maybe<Scalars['Int']>;
};


export type MutationUpdateSepTimeAllocationArgs = {
  proposalPk: Scalars['Int'];
  sepId: Scalars['Int'];
  sepTimeAllocation?: Maybe<Scalars['Int']>;
};


export type MutationUpdateSampleArgs = {
  safetyComment?: Maybe<Scalars['String']>;
  safetyStatus?: Maybe<SampleStatus>;
  sampleId: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
};


export type MutationUpdateSampleEsiArgs = {
  esiId: Scalars['Int'];
  isSubmitted?: Maybe<Scalars['Boolean']>;
  sampleId: Scalars['Int'];
};


export type MutationUpdateScheduledEventArgs = {
  updateScheduledEvent: UpdateScheduledEventInput;
};


export type MutationUpdateShipmentArgs = {
  externalRef?: Maybe<Scalars['String']>;
  proposalPk?: Maybe<Scalars['Int']>;
  shipmentId: Scalars['Int'];
  status?: Maybe<ShipmentStatus>;
  title?: Maybe<Scalars['String']>;
};


export type MutationUpdateTechnicalReviewAssigneeArgs = {
  proposalPks: Array<Scalars['Int']>;
  userId: Scalars['Int'];
};


export type MutationUpdateTemplateArgs = {
  description?: Maybe<Scalars['String']>;
  isArchived?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  templateId: Scalars['Int'];
};


export type MutationUpdateTopicArgs = {
  id: Scalars['Int'];
  isEnabled?: Maybe<Scalars['Boolean']>;
  sortOrder?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
};


export type MutationUpdateUserArgs = {
  birthdate?: Maybe<Scalars['String']>;
  department?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  lastname?: Maybe<Scalars['String']>;
  middlename?: Maybe<Scalars['String']>;
  nationality?: Maybe<Scalars['Int']>;
  orcid?: Maybe<Scalars['String']>;
  organisation?: Maybe<Scalars['Int']>;
  placeholder?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['String']>;
  preferredname?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Scalars['Int']>>;
  telephone?: Maybe<Scalars['String']>;
  telephone_alt?: Maybe<Scalars['String']>;
  user_title?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};


export type MutationUpdateUserRolesArgs = {
  id: Scalars['Int'];
  roles?: Maybe<Array<Scalars['Int']>>;
};


export type MutationUpdateVisitArgs = {
  status?: Maybe<VisitStatus>;
  team?: Maybe<Array<Scalars['Int']>>;
  teamLeadUserId?: Maybe<Scalars['Int']>;
  visitId: Scalars['Int'];
};


export type MutationUpdateVisitRegistrationArgs = {
  isRegistrationSubmitted?: Maybe<Scalars['Boolean']>;
  trainingExpiryDate?: Maybe<Scalars['DateTime']>;
  visitId: Scalars['Int'];
};

export type NewScheduledEventInput = {
  bookingType: ScheduledEventBookingType;
  description?: Maybe<Scalars['String']>;
  endsAt: Scalars['TzLessDateTime'];
  instrumentId: Scalars['Int'];
  proposalBookingId?: Maybe<Scalars['Int']>;
  startsAt: Scalars['TzLessDateTime'];
};

export type NextProposalStatus = {
  __typename?: 'NextProposalStatus';
  description: Maybe<Scalars['String']>;
  id: Maybe<Scalars['Int']>;
  isDefault: Maybe<Scalars['Boolean']>;
  name: Maybe<Scalars['String']>;
  shortCode: Maybe<Scalars['String']>;
};

export type NextProposalStatusResponseWrap = {
  __typename?: 'NextProposalStatusResponseWrap';
  nextProposalStatus: Maybe<NextProposalStatus>;
  rejection: Maybe<Rejection>;
};

export type NumberInputConfig = {
  __typename?: 'NumberInputConfig';
  numberValueConstraint: Maybe<NumberValueConstraint>;
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
  units: Maybe<Array<Scalars['String']>>;
};

export enum NumberValueConstraint {
  NONE = 'NONE',
  ONLY_NEGATIVE = 'ONLY_NEGATIVE',
  ONLY_POSITIVE = 'ONLY_POSITIVE'
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
  content: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

export enum PageName {
  COOKIEPAGE = 'COOKIEPAGE',
  FOOTERCONTENT = 'FOOTERCONTENT',
  HELPPAGE = 'HELPPAGE',
  HOMEPAGE = 'HOMEPAGE',
  PRIVACYPAGE = 'PRIVACYPAGE',
  REVIEWPAGE = 'REVIEWPAGE'
}

export type PageResponseWrap = {
  __typename?: 'PageResponseWrap';
  page: Maybe<Page>;
  rejection: Maybe<Rejection>;
};

export type PermissionsWithAccessToken = {
  __typename?: 'PermissionsWithAccessToken';
  accessPermissions: Scalars['String'];
  accessToken: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};

export type PrepareDbResponseWrap = {
  __typename?: 'PrepareDBResponseWrap';
  log: Maybe<Scalars['String']>;
  rejection: Maybe<Rejection>;
};

export type Proposal = {
  __typename?: 'Proposal';
  abstract: Scalars['String'];
  call: Maybe<Call>;
  callId: Scalars['Int'];
  commentForManagement: Maybe<Scalars['String']>;
  commentForUser: Maybe<Scalars['String']>;
  created: Scalars['DateTime'];
  finalStatus: Maybe<ProposalEndStatus>;
  genericTemplates: Maybe<Array<GenericTemplate>>;
  instrument: Maybe<Instrument>;
  managementDecisionSubmitted: Scalars['Boolean'];
  managementTimeAllocation: Maybe<Scalars['Int']>;
  notified: Scalars['Boolean'];
  primaryKey: Scalars['Int'];
  proposalBooking: Maybe<ProposalBooking>;
  proposalBookingCore: Maybe<ProposalBookingCore>;
  proposalId: Scalars['String'];
  proposer: Maybe<BasicUserDetails>;
  publicStatus: ProposalPublicStatus;
  questionary: Questionary;
  questionaryId: Scalars['Int'];
  reviews: Maybe<Array<Review>>;
  samples: Maybe<Array<Sample>>;
  sep: Maybe<Sep>;
  sepMeetingDecision: Maybe<SepMeetingDecision>;
  status: Maybe<ProposalStatus>;
  statusId: Scalars['Int'];
  submitted: Scalars['Boolean'];
  technicalReview: Maybe<TechnicalReview>;
  technicalReviewAssignee: Maybe<Scalars['Int']>;
  title: Scalars['String'];
  updated: Scalars['DateTime'];
  users: Array<BasicUserDetails>;
  visits: Maybe<Array<Visit>>;
};


export type ProposalProposalBookingArgs = {
  filter?: Maybe<ProposalProposalBookingFilter>;
};


export type ProposalProposalBookingCoreArgs = {
  filter?: Maybe<ProposalBookingFilter>;
};

export type ProposalBasisConfig = {
  __typename?: 'ProposalBasisConfig';
  tooltip: Scalars['String'];
};

export type ProposalBooking = {
  __typename?: 'ProposalBooking';
  allocatedTime: Scalars['Int'];
  call: Maybe<Call>;
  createdAt: Scalars['DateTime'];
  id: Scalars['Int'];
  instrument: Maybe<Instrument>;
  proposal: Maybe<Proposal>;
  scheduledEvents: Array<ScheduledEvent>;
  status: ProposalBookingStatusCore;
  updatedAt: Scalars['DateTime'];
};


export type ProposalBookingScheduledEventsArgs = {
  filter: ProposalBookingScheduledEventFilter;
};

export type ProposalBookingCore = {
  __typename?: 'ProposalBookingCore';
  id: Scalars['Int'];
  scheduledEvents: Array<ScheduledEventCore>;
};


export type ProposalBookingCoreScheduledEventsArgs = {
  filter: ProposalBookingScheduledEventFilterCore;
};

export type ProposalBookingFilter = {
  status?: Maybe<Array<ProposalBookingStatusCore>>;
};

export enum ProposalBookingFinalizeAction {
  COMPLETE = 'COMPLETE',
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

export type ProposalBookingScheduledEventFilterCore = {
  bookingType?: Maybe<ScheduledEventBookingType>;
  endsAfter?: Maybe<Scalars['TzLessDateTime']>;
  endsBefore?: Maybe<Scalars['TzLessDateTime']>;
  status?: Maybe<Array<ProposalBookingStatusCore>>;
};

export enum ProposalBookingStatusCore {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DRAFT = 'DRAFT'
}

export enum ProposalEndStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  RESERVED = 'RESERVED',
  UNSET = 'UNSET'
}

export type ProposalEsiBasisConfig = {
  __typename?: 'ProposalEsiBasisConfig';
  tooltip: Scalars['String'];
};

export type ProposalEvent = {
  __typename?: 'ProposalEvent';
  description: Maybe<Scalars['String']>;
  name: Event;
};

export type ProposalPkWithCallId = {
  callId: Scalars['Int'];
  primaryKey: Scalars['Int'];
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
  status?: Maybe<Array<ProposalBookingStatusCore>>;
};

export enum ProposalPublicStatus {
  ACCEPTED = 'accepted',
  DRAFT = 'draft',
  REJECTED = 'rejected',
  RESERVED = 'reserved',
  SUBMITTED = 'submitted',
  UNKNOWN = 'unknown'
}

export type ProposalResponseWrap = {
  __typename?: 'ProposalResponseWrap';
  proposal: Maybe<Proposal>;
  rejection: Maybe<Rejection>;
};

export type ProposalStatus = {
  __typename?: 'ProposalStatus';
  description: Scalars['String'];
  id: Scalars['Int'];
  isDefault: Scalars['Boolean'];
  name: Scalars['String'];
  shortCode: Scalars['String'];
};

export type ProposalStatusChangingEventResponseWrap = {
  __typename?: 'ProposalStatusChangingEventResponseWrap';
  rejection: Maybe<Rejection>;
  statusChangingEvents: Maybe<Array<StatusChangingEvent>>;
};

export type ProposalStatusResponseWrap = {
  __typename?: 'ProposalStatusResponseWrap';
  proposalStatus: Maybe<ProposalStatus>;
  rejection: Maybe<Rejection>;
};

export type ProposalTemplate = {
  __typename?: 'ProposalTemplate';
  callCount: Scalars['Int'];
  complementaryQuestions: Array<Question>;
  description: Maybe<Scalars['String']>;
  group: TemplateGroup;
  groupId: TemplateGroupId;
  isArchived: Scalars['Boolean'];
  name: Scalars['String'];
  questionaryCount: Scalars['Int'];
  steps: Array<TemplateStep>;
  templateId: Scalars['Int'];
};

export type ProposalTemplatesFilter = {
  isArchived?: Maybe<Scalars['Boolean']>;
  templateIds?: Maybe<Array<Scalars['Int']>>;
};

export type ProposalView = {
  __typename?: 'ProposalView';
  allocationTimeUnit: AllocationTimeUnits;
  callId: Scalars['Int'];
  callShortCode: Maybe<Scalars['String']>;
  finalStatus: Maybe<ProposalEndStatus>;
  instrumentId: Maybe<Scalars['Int']>;
  instrumentName: Maybe<Scalars['String']>;
  notified: Scalars['Boolean'];
  primaryKey: Scalars['Int'];
  proposalId: Scalars['String'];
  rankOrder: Maybe<Scalars['Int']>;
  reviewAverage: Maybe<Scalars['Float']>;
  reviewDeviation: Maybe<Scalars['Float']>;
  sepCode: Maybe<Scalars['String']>;
  sepId: Maybe<Scalars['Int']>;
  statusDescription: Scalars['String'];
  statusId: Scalars['Int'];
  statusName: Scalars['String'];
  submitted: Scalars['Boolean'];
  technicalStatus: Maybe<TechnicalReviewStatus>;
  timeAllocation: Maybe<Scalars['Int']>;
  title: Scalars['String'];
};

export type ProposalWorkflow = {
  __typename?: 'ProposalWorkflow';
  description: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  proposalWorkflowConnectionGroups: Array<ProposalWorkflowConnectionGroup>;
};

export type ProposalWorkflowConnection = {
  __typename?: 'ProposalWorkflowConnection';
  droppableGroupId: Scalars['String'];
  id: Scalars['Int'];
  nextProposalStatusId: Maybe<Scalars['Int']>;
  prevProposalStatusId: Maybe<Scalars['Int']>;
  proposalStatus: ProposalStatus;
  proposalStatusId: Scalars['Int'];
  proposalWorkflowId: Scalars['Int'];
  sortOrder: Scalars['Int'];
  statusChangingEvents: Maybe<Array<StatusChangingEvent>>;
};

export type ProposalWorkflowConnectionGroup = {
  __typename?: 'ProposalWorkflowConnectionGroup';
  connections: Array<ProposalWorkflowConnection>;
  groupId: Scalars['String'];
  parentGroupId: Maybe<Scalars['String']>;
};

export type ProposalWorkflowConnectionResponseWrap = {
  __typename?: 'ProposalWorkflowConnectionResponseWrap';
  proposalWorkflowConnection: Maybe<ProposalWorkflowConnection>;
  rejection: Maybe<Rejection>;
};

export type ProposalWorkflowResponseWrap = {
  __typename?: 'ProposalWorkflowResponseWrap';
  proposalWorkflow: Maybe<ProposalWorkflow>;
  rejection: Maybe<Rejection>;
};

export type ProposalsFilter = {
  callId?: Maybe<Scalars['Int']>;
  instrumentId?: Maybe<Scalars['Int']>;
  proposalStatusId?: Maybe<Scalars['Int']>;
  questionFilter?: Maybe<QuestionFilterInput>;
  questionaryIds?: Maybe<Array<Scalars['Int']>>;
  shortCodes?: Maybe<Array<Scalars['String']>>;
  text?: Maybe<Scalars['String']>;
};

export type ProposalsQueryResult = {
  __typename?: 'ProposalsQueryResult';
  proposals: Array<Proposal>;
  totalCount: Scalars['Int'];
};

export type ProposalsResponseWrap = {
  __typename?: 'ProposalsResponseWrap';
  proposals: Array<Proposal>;
  rejection: Maybe<Rejection>;
};

export type QueriesAndMutations = {
  __typename?: 'QueriesAndMutations';
  mutations: Array<Scalars['String']>;
  queries: Array<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  accessTokenAndPermissions: Maybe<PermissionsWithAccessToken>;
  activeTemplateId: Maybe<Scalars['Int']>;
  allAccessTokensAndPermissions: Maybe<Array<PermissionsWithAccessToken>>;
  availableEquipments: Array<Equipment>;
  basicUserDetails: Maybe<BasicUserDetails>;
  basicUserDetailsByEmail: Maybe<BasicUserDetails>;
  blankQuestionary: Questionary;
  blankQuestionarySteps: Maybe<Array<QuestionaryStep>>;
  call: Maybe<Call>;
  calls: Maybe<Array<Call>>;
  callsByInstrumentScientist: Maybe<Array<Call>>;
  checkEmailExist: Maybe<Scalars['Boolean']>;
  checkToken: TokenResult;
  equipment: Maybe<Equipment>;
  equipments: Array<Equipment>;
  esi: Maybe<ExperimentSafetyInput>;
  eventLogs: Maybe<Array<EventLog>>;
  factoryVersion: Scalars['String'];
  features: Array<Feature>;
  fileMetadata: Maybe<Array<FileMetadata>>;
  genericTemplate: Maybe<GenericTemplate>;
  genericTemplates: Maybe<Array<GenericTemplate>>;
  getFields: Maybe<Fields>;
  getOrcIDInformation: Maybe<OrcIdInformation>;
  getPageContent: Maybe<Scalars['String']>;
  healthCheck: HealthStats;
  institutions: Maybe<Array<Institution>>;
  instrument: Maybe<Instrument>;
  instrumentProposalBookings: Array<ProposalBooking>;
  instrumentScientistHasAccess: Maybe<Scalars['Boolean']>;
  instrumentScientistHasInstrument: Maybe<Scalars['Boolean']>;
  instrumentScientistProposals: Maybe<ProposalsQueryResult>;
  instruments: Maybe<InstrumentsQueryResult>;
  instrumentsBySep: Maybe<Array<InstrumentWithAvailabilityTime>>;
  isNaturalKeyPresent: Maybe<Scalars['Boolean']>;
  me: Maybe<User>;
  myShipments: Maybe<Array<Shipment>>;
  myVisits: Array<Visit>;
  previousCollaborators: Maybe<UserQueryResult>;
  proposal: Maybe<Proposal>;
  proposalBooking: Maybe<ProposalBooking>;
  proposalBookingLostTimes: Array<LostTime>;
  proposalBookingScheduledEvent: Maybe<ScheduledEvent>;
  proposalBookingScheduledEvents: Array<ScheduledEvent>;
  proposalEvents: Maybe<Array<ProposalEvent>>;
  proposalReviews: Maybe<Array<Review>>;
  proposalStatus: Maybe<ProposalStatus>;
  proposalStatuses: Maybe<Array<ProposalStatus>>;
  proposalTemplates: Maybe<Array<ProposalTemplate>>;
  proposalWorkflow: Maybe<ProposalWorkflow>;
  proposalWorkflows: Maybe<Array<ProposalWorkflow>>;
  proposals: Maybe<ProposalsQueryResult>;
  proposalsView: Maybe<Array<ProposalView>>;
  queriesAndMutations: Maybe<QueriesAndMutations>;
  questionary: Maybe<Questionary>;
  questions: Array<QuestionWithUsage>;
  review: Maybe<Review>;
  roles: Maybe<Array<Role>>;
  sample: Maybe<Sample>;
  sampleEsi: Maybe<SampleExperimentSafetyInput>;
  samples: Maybe<Array<Sample>>;
  samplesByCallId: Maybe<Array<Sample>>;
  scheduledEvent: Maybe<ScheduledEvent>;
  scheduledEvents: Array<ScheduledEvent>;
  schedulerConfig: SchedulerConfig;
  schedulerVersion: Scalars['String'];
  sep: Maybe<Sep>;
  sepMembers: Maybe<Array<SepReviewer>>;
  sepProposal: Maybe<SepProposal>;
  sepProposals: Maybe<Array<SepProposal>>;
  sepProposalsByInstrument: Maybe<Array<SepProposal>>;
  sepReviewers: Maybe<Array<SepReviewer>>;
  seps: Maybe<SePsQueryResult>;
  settings: Array<Settings>;
  shipment: Maybe<Shipment>;
  shipments: Maybe<Array<Shipment>>;
  template: Maybe<Template>;
  templateCategories: Maybe<Array<TemplateCategory>>;
  templates: Maybe<Array<Template>>;
  units: Maybe<Array<Unit>>;
  user: Maybe<User>;
  userHasAccessToProposal: Maybe<Scalars['Boolean']>;
  userInstruments: Maybe<InstrumentsQueryResult>;
  users: Maybe<UserQueryResult>;
  version: Scalars['String'];
  visit: Maybe<Visit>;
  visitRegistration: Maybe<VisitRegistration>;
  visits: Array<Visit>;
};


export type QueryAccessTokenAndPermissionsArgs = {
  accessTokenId: Scalars['String'];
};


export type QueryActiveTemplateIdArgs = {
  templateGroupId: TemplateGroupId;
};


export type QueryAvailableEquipmentsArgs = {
  scheduledEventId: Scalars['Int'];
};


export type QueryBasicUserDetailsArgs = {
  id: Scalars['Int'];
};


export type QueryBasicUserDetailsByEmailArgs = {
  email: Scalars['String'];
  role?: Maybe<UserRole>;
};


export type QueryBlankQuestionaryArgs = {
  templateId: Scalars['Int'];
};


export type QueryBlankQuestionaryStepsArgs = {
  templateId: Scalars['Int'];
};


export type QueryCallArgs = {
  id: Scalars['Int'];
};


export type QueryCallsArgs = {
  filter?: Maybe<CallsFilter>;
};


export type QueryCallsByInstrumentScientistArgs = {
  scientistId: Scalars['Int'];
};


export type QueryCheckEmailExistArgs = {
  email: Scalars['String'];
};


export type QueryCheckTokenArgs = {
  token: Scalars['String'];
};


export type QueryEquipmentArgs = {
  id: Scalars['Int'];
};


export type QueryEquipmentsArgs = {
  equipmentIds?: Maybe<Array<Scalars['Int']>>;
};


export type QueryEsiArgs = {
  esiId: Scalars['Int'];
};


export type QueryEventLogsArgs = {
  changedObjectId: Scalars['String'];
  eventType: Scalars['String'];
};


export type QueryFileMetadataArgs = {
  fileIds: Array<Scalars['String']>;
};


export type QueryGenericTemplateArgs = {
  genericTemplateId: Scalars['Int'];
};


export type QueryGenericTemplatesArgs = {
  filter?: Maybe<GenericTemplatesFilter>;
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


export type QueryInstrumentProposalBookingsArgs = {
  instrumentIds: Array<Scalars['Int']>;
};


export type QueryInstrumentScientistHasAccessArgs = {
  instrumentId: Scalars['Int'];
  proposalPk: Scalars['Int'];
};


export type QueryInstrumentScientistHasInstrumentArgs = {
  instrumentId: Scalars['Int'];
};


export type QueryInstrumentScientistProposalsArgs = {
  filter?: Maybe<ProposalsFilter>;
  first?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryInstrumentsArgs = {
  callIds?: Maybe<Array<Scalars['Int']>>;
};


export type QueryInstrumentsBySepArgs = {
  callId: Scalars['Int'];
  sepId: Scalars['Int'];
};


export type QueryIsNaturalKeyPresentArgs = {
  naturalKey: Scalars['String'];
};


export type QueryPreviousCollaboratorsArgs = {
  filter?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  subtractUsers?: Maybe<Array<Maybe<Scalars['Int']>>>;
  userId: Scalars['Int'];
  userRole?: Maybe<UserRole>;
};


export type QueryProposalArgs = {
  primaryKey: Scalars['Int'];
};


export type QueryProposalBookingArgs = {
  id: Scalars['Int'];
};


export type QueryProposalBookingLostTimesArgs = {
  proposalBookingId: Scalars['Int'];
  scheduledEventId?: Maybe<Scalars['Int']>;
};


export type QueryProposalBookingScheduledEventArgs = {
  proposalBookingId: Scalars['Int'];
  scheduledEventId: Scalars['Int'];
};


export type QueryProposalBookingScheduledEventsArgs = {
  proposalBookingId: Scalars['Int'];
};


export type QueryProposalReviewsArgs = {
  proposalPk: Scalars['Int'];
};


export type QueryProposalStatusArgs = {
  id: Scalars['Int'];
};


export type QueryProposalTemplatesArgs = {
  filter?: Maybe<ProposalTemplatesFilter>;
};


export type QueryProposalWorkflowArgs = {
  id: Scalars['Int'];
};


export type QueryProposalsArgs = {
  filter?: Maybe<ProposalsFilter>;
  first?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryProposalsViewArgs = {
  filter?: Maybe<ProposalsFilter>;
};


export type QueryQuestionaryArgs = {
  questionaryId: Scalars['Int'];
};


export type QueryQuestionsArgs = {
  filter?: Maybe<QuestionsFilter>;
};


export type QueryReviewArgs = {
  reviewId: Scalars['Int'];
  sepId?: Maybe<Scalars['Int']>;
};


export type QuerySampleArgs = {
  sampleId: Scalars['Int'];
};


export type QuerySampleEsiArgs = {
  esiId: Scalars['Int'];
  sampleId: Scalars['Int'];
};


export type QuerySamplesArgs = {
  filter?: Maybe<SamplesFilter>;
};


export type QuerySamplesByCallIdArgs = {
  callId: Scalars['Int'];
};


export type QueryScheduledEventArgs = {
  id: Scalars['Int'];
};


export type QueryScheduledEventsArgs = {
  filter: ScheduledEventFilter;
};


export type QuerySepArgs = {
  id: Scalars['Int'];
};


export type QuerySepMembersArgs = {
  sepId: Scalars['Int'];
};


export type QuerySepProposalArgs = {
  proposalPk: Scalars['Int'];
  sepId: Scalars['Int'];
};


export type QuerySepProposalsArgs = {
  callId: Scalars['Int'];
  sepId: Scalars['Int'];
};


export type QuerySepProposalsByInstrumentArgs = {
  callId: Scalars['Int'];
  instrumentId: Scalars['Int'];
  sepId: Scalars['Int'];
};


export type QuerySepReviewersArgs = {
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


export type QueryShipmentsArgs = {
  filter?: Maybe<ShipmentsFilter>;
};


export type QueryTemplateArgs = {
  templateId: Scalars['Int'];
};


export type QueryTemplatesArgs = {
  filter?: Maybe<TemplatesFilter>;
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};


export type QueryUserHasAccessToProposalArgs = {
  proposalPk: Scalars['Int'];
};


export type QueryUsersArgs = {
  filter?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  subtractUsers?: Maybe<Array<Maybe<Scalars['Int']>>>;
  userRole?: Maybe<UserRole>;
};


export type QueryVisitArgs = {
  visitId: Scalars['Int'];
};


export type QueryVisitRegistrationArgs = {
  visitId: Scalars['Int'];
};


export type QueryVisitsArgs = {
  filter?: Maybe<VisitsFilter>;
};

export type Question = {
  __typename?: 'Question';
  categoryId: TemplateCategoryId;
  config: FieldConfig;
  dataType: DataType;
  id: Scalars['String'];
  naturalKey: Scalars['String'];
  question: Scalars['String'];
};

export enum QuestionFilterCompareOperator {
  EQUALS = 'EQUALS',
  EXISTS = 'EXISTS',
  GREATER_THAN = 'GREATER_THAN',
  INCLUDES = 'INCLUDES',
  LESS_THAN = 'LESS_THAN'
}

export type QuestionFilterInput = {
  compareOperator: QuestionFilterCompareOperator;
  dataType: DataType;
  questionId: Scalars['String'];
  value: Scalars['String'];
};

export type QuestionResponseWrap = {
  __typename?: 'QuestionResponseWrap';
  question: Maybe<Question>;
  rejection: Maybe<Rejection>;
};

export type QuestionTemplateRelation = {
  __typename?: 'QuestionTemplateRelation';
  config: FieldConfig;
  dependencies: Array<FieldDependency>;
  dependenciesOperator: Maybe<DependenciesLogicOperator>;
  question: Question;
  sortOrder: Scalars['Int'];
  topicId: Scalars['Int'];
};

export type QuestionWithUsage = {
  __typename?: 'QuestionWithUsage';
  answers: Array<AnswerBasic>;
  categoryId: TemplateCategoryId;
  config: FieldConfig;
  dataType: DataType;
  id: Scalars['String'];
  naturalKey: Scalars['String'];
  question: Scalars['String'];
  templates: Array<Template>;
};

export type Questionary = {
  __typename?: 'Questionary';
  created: Scalars['DateTime'];
  isCompleted: Scalars['Boolean'];
  questionaryId: Scalars['Int'];
  steps: Array<QuestionaryStep>;
  templateId: Scalars['Int'];
};

export type QuestionaryResponseWrap = {
  __typename?: 'QuestionaryResponseWrap';
  questionary: Maybe<Questionary>;
  rejection: Maybe<Rejection>;
};

export type QuestionaryStep = {
  __typename?: 'QuestionaryStep';
  fields: Array<Answer>;
  isCompleted: Scalars['Boolean'];
  topic: Topic;
};

export type QuestionaryStepResponseWrap = {
  __typename?: 'QuestionaryStepResponseWrap';
  questionaryStep: Maybe<QuestionaryStep>;
  rejection: Maybe<Rejection>;
};

export type QuestionsFilter = {
  category?: Maybe<TemplateCategoryId>;
  dataType?: Maybe<Array<DataType>>;
  excludeDataType?: Maybe<Array<DataType>>;
  text?: Maybe<Scalars['String']>;
};

export type Rejection = {
  __typename?: 'Rejection';
  context: Maybe<Scalars['String']>;
  exception: Maybe<Scalars['String']>;
  reason: Scalars['String'];
};

export type RemoveAssignedInstrumentFromCallInput = {
  callId: Scalars['Int'];
  instrumentId: Scalars['Int'];
};

export type ReorderSepMeetingDecisionProposalsInput = {
  proposals: Array<ProposalPkWithRankOrder>;
};

export type Review = {
  __typename?: 'Review';
  comment: Maybe<Scalars['String']>;
  grade: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  proposal: Maybe<Proposal>;
  reviewer: Maybe<BasicUserDetails>;
  sepID: Scalars['Int'];
  status: ReviewStatus;
  userID: Scalars['Int'];
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
  comment: Maybe<Scalars['String']>;
  grade: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  nextProposalStatus: Maybe<NextProposalStatus>;
  proposal: Maybe<Proposal>;
  reviewer: Maybe<BasicUserDetails>;
  sepID: Scalars['Int'];
  status: ReviewStatus;
  userID: Scalars['Int'];
};

export type ReviewWithNextStatusResponseWrap = {
  __typename?: 'ReviewWithNextStatusResponseWrap';
  rejection: Maybe<Rejection>;
  review: Maybe<ReviewWithNextProposalStatus>;
};

export enum ReviewerFilter {
  ALL = 'ALL',
  YOU = 'YOU'
}

export type RichTextInputConfig = {
  __typename?: 'RichTextInputConfig';
  max: Maybe<Scalars['Int']>;
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['Int'];
  shortCode: Scalars['String'];
  title: Scalars['String'];
};

export type Sep = {
  __typename?: 'SEP';
  active: Scalars['Boolean'];
  code: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['Int'];
  numberRatingsRequired: Scalars['Float'];
  sepChair: Maybe<BasicUserDetails>;
  sepSecretary: Maybe<BasicUserDetails>;
};

export type SepAssignment = {
  __typename?: 'SEPAssignment';
  dateAssigned: Scalars['DateTime'];
  dateReassigned: Maybe<Scalars['DateTime']>;
  emailSent: Scalars['Boolean'];
  proposal: Proposal;
  proposalPk: Scalars['Int'];
  reassigned: Scalars['Boolean'];
  review: Maybe<Review>;
  role: Maybe<Role>;
  sepId: Scalars['Int'];
  sepMemberUserId: Maybe<Scalars['Int']>;
  user: Maybe<BasicUserDetails>;
};

export type SepProposal = {
  __typename?: 'SEPProposal';
  assignments: Maybe<Array<SepAssignment>>;
  dateAssigned: Scalars['DateTime'];
  instrumentSubmitted: Scalars['Boolean'];
  proposal: Proposal;
  proposalPk: Scalars['Int'];
  sepId: Scalars['Int'];
  sepTimeAllocation: Maybe<Scalars['Int']>;
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
  role: Maybe<Role>;
  sepId: Scalars['Int'];
  user: BasicUserDetails;
  userId: Scalars['Int'];
};

export type SePsQueryResult = {
  __typename?: 'SEPsQueryResult';
  seps: Array<Sep>;
  totalCount: Scalars['Int'];
};

export type Sample = {
  __typename?: 'Sample';
  created: Scalars['DateTime'];
  creatorId: Scalars['Int'];
  id: Scalars['Int'];
  isPostProposalSubmission: Scalars['Boolean'];
  proposal: Proposal;
  proposalPk: Scalars['Int'];
  questionId: Scalars['String'];
  questionary: Questionary;
  questionaryId: Scalars['Int'];
  safetyComment: Scalars['String'];
  safetyStatus: SampleStatus;
  title: Scalars['String'];
};

export type SampleBasisConfig = {
  __typename?: 'SampleBasisConfig';
  titlePlaceholder: Scalars['String'];
};

export type SampleDeclarationConfig = {
  __typename?: 'SampleDeclarationConfig';
  addEntryButtonLabel: Scalars['String'];
  esiTemplateId: Maybe<Scalars['Int']>;
  maxEntries: Maybe<Scalars['Int']>;
  minEntries: Maybe<Scalars['Int']>;
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  templateCategory: Scalars['String'];
  templateId: Maybe<Scalars['Int']>;
};

export type SampleEsiBasisConfig = {
  __typename?: 'SampleEsiBasisConfig';
  tooltip: Scalars['String'];
};

export type SampleEsiResponseWrap = {
  __typename?: 'SampleEsiResponseWrap';
  esi: Maybe<SampleExperimentSafetyInput>;
  rejection: Maybe<Rejection>;
};

export type SampleExperimentSafetyInput = {
  __typename?: 'SampleExperimentSafetyInput';
  esiId: Scalars['Int'];
  isSubmitted: Scalars['Boolean'];
  questionary: Questionary;
  questionaryId: Scalars['Int'];
  sample: Sample;
  sampleId: Scalars['Int'];
};

export type SampleResponseWrap = {
  __typename?: 'SampleResponseWrap';
  rejection: Maybe<Rejection>;
  sample: Maybe<Sample>;
};

export enum SampleStatus {
  ELEVATED_RISK = 'ELEVATED_RISK',
  HIGH_RISK = 'HIGH_RISK',
  LOW_RISK = 'LOW_RISK',
  PENDING_EVALUATION = 'PENDING_EVALUATION'
}

export type SamplesFilter = {
  creatorId?: Maybe<Scalars['Int']>;
  proposalPk?: Maybe<Scalars['Int']>;
  questionId?: Maybe<Scalars['String']>;
  questionaryIds?: Maybe<Array<Scalars['Int']>>;
  sampleIds?: Maybe<Array<Scalars['Int']>>;
  status?: Maybe<SampleStatus>;
  title?: Maybe<Scalars['String']>;
  visitId?: Maybe<Scalars['Int']>;
};

export type SaveSepMeetingDecisionInput = {
  commentForManagement?: Maybe<Scalars['String']>;
  commentForUser?: Maybe<Scalars['String']>;
  proposalPk: Scalars['Int'];
  rankOrder?: Maybe<Scalars['Int']>;
  recommendation?: Maybe<ProposalEndStatus>;
  submitted?: Maybe<Scalars['Boolean']>;
};

export type ScheduledEvent = {
  __typename?: 'ScheduledEvent';
  bookingType: ScheduledEventBookingType;
  createdAt: Scalars['DateTime'];
  description: Maybe<Scalars['String']>;
  endsAt: Scalars['TzLessDateTime'];
  equipmentAssignmentStatus: Maybe<EquipmentAssignmentStatus>;
  equipmentId: Maybe<Scalars['Int']>;
  equipments: Array<EquipmentWithAssignmentStatus>;
  id: Scalars['Int'];
  instrument: Maybe<Instrument>;
  proposalBooking: Maybe<ProposalBooking>;
  proposalBookingId: Maybe<Scalars['Int']>;
  scheduledBy: Maybe<User>;
  startsAt: Scalars['TzLessDateTime'];
  status: ProposalBookingStatusCore;
  updatedAt: Scalars['DateTime'];
};

export enum ScheduledEventBookingType {
  COMMISSIONING = 'COMMISSIONING',
  EQUIPMENT = 'EQUIPMENT',
  MAINTENANCE = 'MAINTENANCE',
  SHUTDOWN = 'SHUTDOWN',
  USER_OPERATIONS = 'USER_OPERATIONS'
}

export type ScheduledEventCore = {
  __typename?: 'ScheduledEventCore';
  bookingType: ScheduledEventBookingType;
  endsAt: Scalars['TzLessDateTime'];
  esi: Maybe<ExperimentSafetyInput>;
  id: Scalars['Int'];
  startsAt: Scalars['TzLessDateTime'];
  visit: Maybe<Visit>;
};

export type ScheduledEventFilter = {
  endsAt: Scalars['TzLessDateTime'];
  instrumentIds?: Maybe<Array<Scalars['Int']>>;
  startsAt: Scalars['TzLessDateTime'];
};

export type ScheduledEventResponseWrap = {
  __typename?: 'ScheduledEventResponseWrap';
  error: Maybe<Scalars['String']>;
  scheduledEvent: Maybe<ScheduledEvent>;
};

export type ScheduledEventsResponseWrap = {
  __typename?: 'ScheduledEventsResponseWrap';
  error: Maybe<Scalars['String']>;
  scheduledEvents: Maybe<Array<ScheduledEvent>>;
};

export type SchedulerConfig = {
  __typename?: 'SchedulerConfig';
  authRedirect: Scalars['String'];
};

export type SelectionFromOptionsConfig = {
  __typename?: 'SelectionFromOptionsConfig';
  isMultipleSelect: Scalars['Boolean'];
  options: Array<Scalars['String']>;
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
  variant: Scalars['String'];
};

export type SepMeetingDecision = {
  __typename?: 'SepMeetingDecision';
  commentForManagement: Maybe<Scalars['String']>;
  commentForUser: Maybe<Scalars['String']>;
  proposalPk: Scalars['Int'];
  rankOrder: Maybe<Scalars['Int']>;
  recommendation: Maybe<ProposalEndStatus>;
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
  description: Maybe<Scalars['String']>;
  id: SettingsId;
  settingsValue: Maybe<Scalars['String']>;
};

export enum SettingsId {
  EXTERNAL_AUTH_LOGIN_URL = 'EXTERNAL_AUTH_LOGIN_URL',
  HEADER_LOGO_FILENAME = 'HEADER_LOGO_FILENAME',
  PALETTE_ERROR_MAIN = 'PALETTE_ERROR_MAIN',
  PALETTE_INFO_MAIN = 'PALETTE_INFO_MAIN',
  PALETTE_PRIMARY_ACCENT = 'PALETTE_PRIMARY_ACCENT',
  PALETTE_PRIMARY_CONTRAST = 'PALETTE_PRIMARY_CONTRAST',
  PALETTE_PRIMARY_DARK = 'PALETTE_PRIMARY_DARK',
  PALETTE_PRIMARY_LIGHT = 'PALETTE_PRIMARY_LIGHT',
  PALETTE_PRIMARY_MAIN = 'PALETTE_PRIMARY_MAIN',
  PALETTE_SECONDARY_CONTRAST = 'PALETTE_SECONDARY_CONTRAST',
  PALETTE_SECONDARY_DARK = 'PALETTE_SECONDARY_DARK',
  PALETTE_SECONDARY_LIGHT = 'PALETTE_SECONDARY_LIGHT',
  PALETTE_SECONDARY_MAIN = 'PALETTE_SECONDARY_MAIN',
  PALETTE_SUCCESS_MAIN = 'PALETTE_SUCCESS_MAIN',
  PALETTE_WARNING_MAIN = 'PALETTE_WARNING_MAIN',
  PROFILE_PAGE_LINK = 'PROFILE_PAGE_LINK'
}

export type Shipment = {
  __typename?: 'Shipment';
  created: Scalars['DateTime'];
  creatorId: Scalars['Int'];
  externalRef: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  proposal: Proposal;
  proposalPk: Scalars['Int'];
  questionary: Questionary;
  questionaryId: Scalars['Int'];
  samples: Array<Sample>;
  status: ShipmentStatus;
  title: Scalars['String'];
  visitId: Scalars['Int'];
};

export type ShipmentBasisConfig = {
  __typename?: 'ShipmentBasisConfig';
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
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
  creatorId?: Maybe<Scalars['Int']>;
  externalRef?: Maybe<Scalars['String']>;
  proposalPk?: Maybe<Scalars['Int']>;
  questionaryIds?: Maybe<Array<Scalars['Int']>>;
  shipmentIds?: Maybe<Array<Scalars['Int']>>;
  status?: Maybe<ShipmentStatus>;
  title?: Maybe<Scalars['String']>;
  visitId?: Maybe<Scalars['Int']>;
};

export type SimpleLostTimeInput = {
  endsAt: Scalars['TzLessDateTime'];
  newlyCreated?: Maybe<Scalars['Boolean']>;
  scheduledEventId?: Maybe<Scalars['Int']>;
  startsAt: Scalars['TzLessDateTime'];
};

export type StatusChangingEvent = {
  __typename?: 'StatusChangingEvent';
  proposalWorkflowConnectionId: Scalars['Int'];
  statusChangingEvent: Scalars['String'];
  statusChangingEventId: Scalars['Int'];
};

export type SubTemplateConfig = {
  __typename?: 'SubTemplateConfig';
  addEntryButtonLabel: Scalars['String'];
  maxEntries: Maybe<Scalars['Int']>;
  minEntries: Maybe<Scalars['Int']>;
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  templateCategory: Scalars['String'];
  templateId: Maybe<Scalars['Int']>;
};

export type SubmitProposalsReviewInput = {
  proposals: Array<ProposalPkWithReviewId>;
};

export type SubmitTechnicalReviewInput = {
  comment?: Maybe<Scalars['String']>;
  proposalPk: Scalars['Int'];
  publicComment?: Maybe<Scalars['String']>;
  reviewerId: Scalars['Int'];
  status?: Maybe<TechnicalReviewStatus>;
  submitted: Scalars['Boolean'];
  timeAllocation?: Maybe<Scalars['Int']>;
};

export type SuccessResponseWrap = {
  __typename?: 'SuccessResponseWrap';
  isSuccess: Maybe<Scalars['Boolean']>;
  rejection: Maybe<Rejection>;
};

export type TechnicalReview = {
  __typename?: 'TechnicalReview';
  comment: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  proposal: Maybe<Proposal>;
  proposalPk: Scalars['Int'];
  publicComment: Maybe<Scalars['String']>;
  reviewer: Maybe<BasicUserDetails>;
  reviewerId: Scalars['Int'];
  status: Maybe<TechnicalReviewStatus>;
  submitted: Scalars['Boolean'];
  timeAllocation: Maybe<Scalars['Int']>;
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
  complementaryQuestions: Array<Question>;
  description: Maybe<Scalars['String']>;
  group: TemplateGroup;
  groupId: TemplateGroupId;
  isArchived: Scalars['Boolean'];
  name: Scalars['String'];
  questionaryCount: Scalars['Int'];
  steps: Array<TemplateStep>;
  templateId: Scalars['Int'];
};

export type TemplateCategory = {
  __typename?: 'TemplateCategory';
  categoryId: TemplateCategoryId;
  name: Scalars['String'];
};

export enum TemplateCategoryId {
  GENERIC_TEMPLATE = 'GENERIC_TEMPLATE',
  PROPOSAL_QUESTIONARY = 'PROPOSAL_QUESTIONARY',
  SAMPLE_DECLARATION = 'SAMPLE_DECLARATION',
  SHIPMENT_DECLARATION = 'SHIPMENT_DECLARATION',
  VISIT_REGISTRATION = 'VISIT_REGISTRATION'
}

export type TemplateGroup = {
  __typename?: 'TemplateGroup';
  categoryId: TemplateCategoryId;
  groupId: TemplateGroupId;
};

export enum TemplateGroupId {
  GENERIC_TEMPLATE = 'GENERIC_TEMPLATE',
  PROPOSAL = 'PROPOSAL',
  PROPOSAL_ESI = 'PROPOSAL_ESI',
  SAMPLE = 'SAMPLE',
  SAMPLE_ESI = 'SAMPLE_ESI',
  SHIPMENT = 'SHIPMENT',
  VISIT_REGISTRATION = 'VISIT_REGISTRATION'
}

export type TemplateResponseWrap = {
  __typename?: 'TemplateResponseWrap';
  rejection: Maybe<Rejection>;
  template: Maybe<Template>;
};

export type TemplateStep = {
  __typename?: 'TemplateStep';
  fields: Array<QuestionTemplateRelation>;
  topic: Topic;
};

export type TemplatesFilter = {
  group?: Maybe<TemplateGroupId>;
  isArchived?: Maybe<Scalars['Boolean']>;
  templateIds?: Maybe<Array<Scalars['Int']>>;
};

export type TextInputConfig = {
  __typename?: 'TextInputConfig';
  htmlQuestion: Maybe<Scalars['String']>;
  isCounterHidden: Scalars['Boolean'];
  isHtmlQuestion: Scalars['Boolean'];
  max: Maybe<Scalars['Int']>;
  min: Maybe<Scalars['Int']>;
  multiline: Scalars['Boolean'];
  placeholder: Scalars['String'];
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
};

export type TokenPayloadUnion = AuthJwtApiTokenPayload | AuthJwtPayload;

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
  isEnabled: Scalars['Boolean'];
  sortOrder: Scalars['Int'];
  templateId: Scalars['Int'];
  title: Scalars['String'];
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
  questionId: Maybe<Scalars['String']>;
  rejection: Maybe<Rejection>;
};

export type UpdateApiAccessTokenInput = {
  accessPermissions: Scalars['String'];
  accessTokenId: Scalars['String'];
  name: Scalars['String'];
};

export type UpdateCallInput = {
  allocationTimeUnit: AllocationTimeUnits;
  callEnded?: Maybe<Scalars['Int']>;
  callReviewEnded?: Maybe<Scalars['Int']>;
  callSEPReviewEnded?: Maybe<Scalars['Int']>;
  cycleComment: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  endCall: Scalars['DateTime'];
  endCycle: Scalars['DateTime'];
  endNotify: Scalars['DateTime'];
  endReview: Scalars['DateTime'];
  endSEPReview?: Maybe<Scalars['DateTime']>;
  esiTemplateId?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  proposalSequence?: Maybe<Scalars['Int']>;
  proposalWorkflowId: Scalars['Int'];
  referenceNumberFormat?: Maybe<Scalars['String']>;
  shortCode: Scalars['String'];
  startCall: Scalars['DateTime'];
  startCycle: Scalars['DateTime'];
  startNotify: Scalars['DateTime'];
  startReview: Scalars['DateTime'];
  startSEPReview?: Maybe<Scalars['DateTime']>;
  surveyComment: Scalars['String'];
  templateId: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
};

export type UpdateLostTimeInput = {
  endsAt: Scalars['TzLessDateTime'];
  id: Scalars['Int'];
  startsAt: Scalars['TzLessDateTime'];
};

export type UpdateProposalStatusInput = {
  description: Scalars['String'];
  id: Scalars['Int'];
  isDefault?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  shortCode?: Maybe<Scalars['String']>;
};

export type UpdateProposalWorkflowInput = {
  description: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type UpdateScheduledEventInput = {
  endsAt: Scalars['TzLessDateTime'];
  scheduledEventId: Scalars['Int'];
  startsAt: Scalars['TzLessDateTime'];
};

export type User = {
  __typename?: 'User';
  birthdate: Scalars['String'];
  created: Scalars['String'];
  department: Scalars['String'];
  email: Scalars['String'];
  emailVerified: Scalars['Boolean'];
  firstname: Scalars['String'];
  gender: Scalars['String'];
  id: Scalars['Int'];
  instruments: Array<Instrument>;
  lastname: Scalars['String'];
  middlename: Maybe<Scalars['String']>;
  nationality: Maybe<Scalars['Int']>;
  orcid: Scalars['String'];
  organisation: Scalars['Int'];
  placeholder: Scalars['Boolean'];
  position: Scalars['String'];
  preferredname: Maybe<Scalars['String']>;
  proposals: Array<Proposal>;
  refreshToken: Scalars['String'];
  reviews: Array<Review>;
  roles: Array<Role>;
  seps: Array<Sep>;
  telephone: Scalars['String'];
  telephone_alt: Maybe<Scalars['String']>;
  updated: Scalars['String'];
  user_title: Scalars['String'];
  username: Scalars['String'];
};


export type UserProposalsArgs = {
  filter?: Maybe<UserProposalsFilter>;
};


export type UserReviewsArgs = {
  callId?: Maybe<Scalars['Int']>;
  instrumentId?: Maybe<Scalars['Int']>;
  reviewer?: Maybe<ReviewerFilter>;
  status?: Maybe<ReviewStatus>;
};

export type UserProposalsFilter = {
  finalStatus?: Maybe<ProposalEndStatus>;
  instrumentId?: Maybe<Scalars['Int']>;
  managementDecisionSubmitted?: Maybe<Scalars['Boolean']>;
};

export type UserQueryResult = {
  __typename?: 'UserQueryResult';
  totalCount: Scalars['Int'];
  users: Array<BasicUserDetails>;
};

export type UserResponseWrap = {
  __typename?: 'UserResponseWrap';
  rejection: Maybe<Rejection>;
  user: Maybe<User>;
};

export enum UserRole {
  INSTRUMENT_SCIENTIST = 'INSTRUMENT_SCIENTIST',
  SAMPLE_SAFETY_REVIEWER = 'SAMPLE_SAFETY_REVIEWER',
  SEP_CHAIR = 'SEP_CHAIR',
  SEP_REVIEWER = 'SEP_REVIEWER',
  SEP_SECRETARY = 'SEP_SECRETARY',
  USER = 'USER',
  USER_OFFICER = 'USER_OFFICER'
}

export type Visit = {
  __typename?: 'Visit';
  creatorId: Scalars['Int'];
  id: Scalars['Int'];
  proposal: Proposal;
  proposalPk: Scalars['Int'];
  registrations: Array<VisitRegistration>;
  samples: Array<Sample>;
  scheduledEventId: Scalars['Int'];
  shipments: Array<Shipment>;
  status: VisitStatus;
  teamLead: BasicUserDetails;
  teamLeadUserId: Scalars['Int'];
};

export type VisitBasisConfig = {
  __typename?: 'VisitBasisConfig';
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
};

export type VisitRegistration = {
  __typename?: 'VisitRegistration';
  isRegistrationSubmitted: Scalars['Boolean'];
  questionary: Questionary;
  registrationQuestionaryId: Maybe<Scalars['Int']>;
  trainingExpiryDate: Maybe<Scalars['DateTime']>;
  user: BasicUserDetails;
  userId: Scalars['Int'];
  visitId: Scalars['Int'];
};

export type VisitRegistrationResponseWrap = {
  __typename?: 'VisitRegistrationResponseWrap';
  registration: Maybe<VisitRegistration>;
  rejection: Maybe<Rejection>;
};

export type VisitResponseWrap = {
  __typename?: 'VisitResponseWrap';
  rejection: Maybe<Rejection>;
  visit: Maybe<Visit>;
};

export enum VisitStatus {
  ACCEPTED = 'ACCEPTED',
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED'
}

export type VisitsFilter = {
  creatorId?: Maybe<Scalars['Int']>;
  proposalPk?: Maybe<Scalars['Int']>;
  scheduledEventId?: Maybe<Scalars['Int']>;
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
      & Pick<Equipment, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'description' | 'maintenanceStartsAt' | 'maintenanceEndsAt' | 'autoAccept'>
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
  scheduledEventId: Scalars['Int'];
}>;


export type GetAvailableEquipmentsQuery = (
  { __typename?: 'Query' }
  & { availableEquipments: Array<(
    { __typename?: 'Equipment' }
    & Pick<Equipment, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'description' | 'maintenanceStartsAt' | 'maintenanceEndsAt' | 'autoAccept'>
  )> }
);

export type GetEquipmentQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetEquipmentQuery = (
  { __typename?: 'Query' }
  & { equipment: Maybe<(
    { __typename?: 'Equipment' }
    & Pick<Equipment, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'description' | 'maintenanceStartsAt' | 'maintenanceEndsAt' | 'autoAccept'>
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
    & Pick<Equipment, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'description' | 'maintenanceStartsAt' | 'maintenanceEndsAt' | 'autoAccept'>
  )> }
);

export type UpdateEquipmentMutationVariables = Exact<{
  id: Scalars['Int'];
  updateEquipmentInput: EquipmentInput;
}>;


export type UpdateEquipmentMutation = (
  { __typename?: 'Mutation' }
  & { updateEquipment: (
    { __typename?: 'EquipmentResponseWrap' }
    & Pick<EquipmentResponseWrap, 'error'>
    & { equipment: Maybe<(
      { __typename?: 'Equipment' }
      & Pick<Equipment, 'id' | 'name' | 'description' | 'maintenanceStartsAt' | 'maintenanceEndsAt' | 'autoAccept'>
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

export type AddLostTimeMutationVariables = Exact<{
  input: AddLostTimeInput;
}>;


export type AddLostTimeMutation = (
  { __typename?: 'Mutation' }
  & { addLostTime: (
    { __typename?: 'LostTimeResponseWrap' }
    & Pick<LostTimeResponseWrap, 'error'>
    & { lostTime: Maybe<(
      { __typename?: 'LostTime' }
      & Pick<LostTime, 'id' | 'startsAt' | 'endsAt' | 'scheduledEventId'>
    )> }
  ) }
);

export type DeleteLostTimeMutationVariables = Exact<{
  input: DeleteLostTimeInput;
}>;


export type DeleteLostTimeMutation = (
  { __typename?: 'Mutation' }
  & { deleteLostTime: (
    { __typename?: 'LostTimeResponseWrap' }
    & Pick<LostTimeResponseWrap, 'error'>
    & { lostTime: Maybe<(
      { __typename?: 'LostTime' }
      & Pick<LostTime, 'id' | 'startsAt' | 'endsAt' | 'scheduledEventId'>
    )> }
  ) }
);

export type GetProposalBookingLostTimesQueryVariables = Exact<{
  proposalBookingId: Scalars['Int'];
  scheduledEventId?: Maybe<Scalars['Int']>;
}>;


export type GetProposalBookingLostTimesQuery = (
  { __typename?: 'Query' }
  & { proposalBookingLostTimes: Array<(
    { __typename?: 'LostTime' }
    & Pick<LostTime, 'id' | 'startsAt' | 'scheduledEventId' | 'endsAt'>
  )> }
);

export type UpdateLostTimeMutationVariables = Exact<{
  input: UpdateLostTimeInput;
}>;


export type UpdateLostTimeMutation = (
  { __typename?: 'Mutation' }
  & { updateLostTime: (
    { __typename?: 'LostTimeResponseWrap' }
    & Pick<LostTimeResponseWrap, 'error'>
    & { lostTime: Maybe<(
      { __typename?: 'LostTime' }
      & Pick<LostTime, 'id' | 'startsAt' | 'endsAt' | 'scheduledEventId'>
    )> }
  ) }
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
  id: Scalars['Int'];
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
  id: Scalars['Int'];
}>;


export type FinalizeProposalBookingMutation = (
  { __typename?: 'Mutation' }
  & { finalizeProposalBooking: (
    { __typename?: 'ProposalBookingResponseWrap' }
    & Pick<ProposalBookingResponseWrap, 'error'>
  ) }
);

export type GetInstrumentProposalBookingsQueryVariables = Exact<{
  instrumentIds: Array<Scalars['Int']> | Scalars['Int'];
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
      & Pick<Proposal, 'primaryKey' | 'title' | 'proposalId'>
    )>, scheduledEvents: Array<(
      { __typename?: 'ScheduledEvent' }
      & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt'>
    )> }
  )> }
);

export type GetProposalBookingQueryVariables = Exact<{
  id: Scalars['Int'];
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
      & Pick<Proposal, 'primaryKey' | 'title' | 'proposalId'>
    )>, scheduledEvents: Array<(
      { __typename?: 'ScheduledEvent' }
      & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt' | 'bookingType' | 'status' | 'description'>
      & { scheduledBy: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'firstname' | 'lastname'>
      )> }
    )>, instrument: Maybe<(
      { __typename?: 'Instrument' }
      & Pick<Instrument, 'id' | 'name'>
    )> }
  )> }
);

export type ActivateScheduledEventMutationVariables = Exact<{
  input: ActivateScheduledEventInput;
}>;


export type ActivateScheduledEventMutation = (
  { __typename?: 'Mutation' }
  & { activateScheduledEvent: (
    { __typename?: 'ScheduledEventResponseWrap' }
    & Pick<ScheduledEventResponseWrap, 'error'>
    & { scheduledEvent: Maybe<(
      { __typename?: 'ScheduledEvent' }
      & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt'>
    )> }
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
      & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt' | 'bookingType' | 'status' | 'description'>
      & { scheduledBy: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'firstname' | 'lastname'>
      )> }
    )> }
  ) }
);

export type DeleteScheduledEventsMutationVariables = Exact<{
  input: DeleteScheduledEventsInput;
}>;


export type DeleteScheduledEventsMutation = (
  { __typename?: 'Mutation' }
  & { deleteScheduledEvents: (
    { __typename?: 'ScheduledEventsResponseWrap' }
    & Pick<ScheduledEventsResponseWrap, 'error'>
    & { scheduledEvents: Maybe<Array<(
      { __typename?: 'ScheduledEvent' }
      & Pick<ScheduledEvent, 'id' | 'bookingType' | 'startsAt' | 'endsAt' | 'description' | 'status'>
    )>> }
  ) }
);

export type FinalizeScheduledEventMutationVariables = Exact<{
  input: FinalizeScheduledEventInput;
}>;


export type FinalizeScheduledEventMutation = (
  { __typename?: 'Mutation' }
  & { finalizeScheduledEvent: (
    { __typename?: 'ScheduledEventResponseWrap' }
    & Pick<ScheduledEventResponseWrap, 'error'>
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
      & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt' | 'status' | 'equipmentAssignmentStatus' | 'equipmentId'>
      & { proposalBooking: Maybe<(
        { __typename?: 'ProposalBooking' }
        & Pick<ProposalBooking, 'status'>
        & { proposal: Maybe<(
          { __typename?: 'Proposal' }
          & Pick<Proposal, 'primaryKey' | 'title' | 'proposalId'>
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
  proposalBookingId: Scalars['Int'];
}>;


export type GetProposalBookingScheduledEventsQuery = (
  { __typename?: 'Query' }
  & { proposalBookingScheduledEvents: Array<(
    { __typename?: 'ScheduledEvent' }
    & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt' | 'bookingType' | 'status' | 'description'>
    & { scheduledBy: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstname' | 'lastname'>
    )> }
  )> }
);

export type GetScheduledEventEquipmentsQueryVariables = Exact<{
  proposalBookingId: Scalars['Int'];
  scheduledEventId: Scalars['Int'];
}>;


export type GetScheduledEventEquipmentsQuery = (
  { __typename?: 'Query' }
  & { proposalBookingScheduledEvent: Maybe<(
    { __typename?: 'ScheduledEvent' }
    & { equipments: Array<(
      { __typename?: 'EquipmentWithAssignmentStatus' }
      & Pick<EquipmentWithAssignmentStatus, 'id' | 'name' | 'description' | 'maintenanceStartsAt' | 'maintenanceEndsAt' | 'status'>
    )> }
  )> }
);

export type GetScheduledEventWithEquipmentsQueryVariables = Exact<{
  proposalBookingId: Scalars['Int'];
  scheduledEventId: Scalars['Int'];
  scheduledEventFilter: ProposalBookingScheduledEventFilter;
}>;


export type GetScheduledEventWithEquipmentsQuery = (
  { __typename?: 'Query' }
  & { proposalBookingScheduledEvent: Maybe<(
    { __typename?: 'ScheduledEvent' }
    & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt' | 'status'>
    & { proposalBooking: Maybe<(
      { __typename?: 'ProposalBooking' }
      & Pick<ProposalBooking, 'id' | 'status' | 'allocatedTime'>
      & { scheduledEvents: Array<(
        { __typename?: 'ScheduledEvent' }
        & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt'>
      )>, proposal: Maybe<(
        { __typename?: 'Proposal' }
        & Pick<Proposal, 'primaryKey' | 'title' | 'proposalId'>
        & { proposer: Maybe<(
          { __typename?: 'BasicUserDetails' }
          & Pick<BasicUserDetails, 'firstname' | 'lastname'>
        )> }
      )>, call: Maybe<(
        { __typename?: 'Call' }
        & Pick<Call, 'id' | 'shortCode' | 'startCycle' | 'endCycle' | 'cycleComment'>
      )> }
    )>, scheduledBy: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'firstname' | 'lastname'>
    )>, equipments: Array<(
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
    & Pick<ScheduledEvent, 'id' | 'bookingType' | 'equipmentId' | 'startsAt' | 'endsAt' | 'status' | 'description'>
    & { instrument: Maybe<(
      { __typename?: 'Instrument' }
      & Pick<Instrument, 'id' | 'name'>
    )>, scheduledBy: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'firstname' | 'lastname'>
    )>, proposalBooking: Maybe<(
      { __typename?: 'ProposalBooking' }
      & Pick<ProposalBooking, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'allocatedTime'>
      & { proposal: Maybe<(
        { __typename?: 'Proposal' }
        & Pick<Proposal, 'primaryKey' | 'title' | 'proposalId'>
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
  proposalBookingId: Scalars['Int'];
}>;


export type GetScheduledEventsWithEquipmentsQuery = (
  { __typename?: 'Query' }
  & { proposalBookingScheduledEvents: Array<(
    { __typename?: 'ScheduledEvent' }
    & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt' | 'status'>
    & { equipments: Array<(
      { __typename?: 'EquipmentWithAssignmentStatus' }
      & Pick<EquipmentWithAssignmentStatus, 'id' | 'name' | 'description' | 'maintenanceStartsAt' | 'maintenanceEndsAt' | 'status'>
    )> }
  )> }
);

export type UpdateScheduledEventMutationVariables = Exact<{
  input: UpdateScheduledEventInput;
}>;


export type UpdateScheduledEventMutation = (
  { __typename?: 'Mutation' }
  & { updateScheduledEvent: (
    { __typename?: 'ScheduledEventResponseWrap' }
    & Pick<ScheduledEventResponseWrap, 'error'>
    & { scheduledEvent: Maybe<(
      { __typename?: 'ScheduledEvent' }
      & Pick<ScheduledEvent, 'id' | 'startsAt' | 'endsAt'>
    )> }
  ) }
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
      description
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
    query getAvailableEquipments($scheduledEventId: Int!) {
  availableEquipments(scheduledEventId: $scheduledEventId) {
    id
    createdAt
    updatedAt
    name
    description
    maintenanceStartsAt
    maintenanceEndsAt
    autoAccept
  }
}
    `;
export const GetEquipmentDocument = gql`
    query getEquipment($id: Int!) {
  equipment(id: $id) {
    id
    createdAt
    updatedAt
    name
    description
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
    description
    maintenanceStartsAt
    maintenanceEndsAt
    autoAccept
  }
}
    `;
export const UpdateEquipmentDocument = gql`
    mutation updateEquipment($id: Int!, $updateEquipmentInput: EquipmentInput!) {
  updateEquipment(id: $id, updateEquipmentInput: $updateEquipmentInput) {
    error
    equipment {
      id
      name
      description
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
export const AddLostTimeDocument = gql`
    mutation addLostTime($input: AddLostTimeInput!) {
  addLostTime(addLostTimeInput: $input) {
    error
    lostTime {
      id
      startsAt
      endsAt
      scheduledEventId
    }
  }
}
    `;
export const DeleteLostTimeDocument = gql`
    mutation deleteLostTime($input: DeleteLostTimeInput!) {
  deleteLostTime(deleteLostTimeInput: $input) {
    error
    lostTime {
      id
      startsAt
      endsAt
      scheduledEventId
    }
  }
}
    `;
export const GetProposalBookingLostTimesDocument = gql`
    query getProposalBookingLostTimes($proposalBookingId: Int!, $scheduledEventId: Int) {
  proposalBookingLostTimes(
    proposalBookingId: $proposalBookingId
    scheduledEventId: $scheduledEventId
  ) {
    id
    startsAt
    scheduledEventId
    endsAt
  }
}
    `;
export const UpdateLostTimeDocument = gql`
    mutation updateLostTime($input: UpdateLostTimeInput!) {
  updateLostTime(updateLostTimeInput: $input) {
    error
    lostTime {
      id
      startsAt
      endsAt
      scheduledEventId
    }
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
    mutation activateProposalBooking($id: Int!) {
  activateProposalBooking(id: $id) {
    error
  }
}
    `;
export const FinalizeProposalBookingDocument = gql`
    mutation finalizeProposalBooking($action: ProposalBookingFinalizeAction!, $id: Int!) {
  finalizeProposalBooking(action: $action, id: $id) {
    error
  }
}
    `;
export const GetInstrumentProposalBookingsDocument = gql`
    query getInstrumentProposalBookings($instrumentIds: [Int!]!, $filter: ProposalBookingScheduledEventFilter!) {
  instrumentProposalBookings(instrumentIds: $instrumentIds) {
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
      proposalId
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
    query getProposalBooking($id: Int!, $filter: ProposalBookingScheduledEventFilter!) {
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
      proposalId
    }
    scheduledEvents(filter: $filter) {
      id
      startsAt
      endsAt
      bookingType
      scheduledBy {
        id
        firstname
        lastname
      }
      status
      description
    }
    instrument {
      id
      name
    }
    createdAt
    updatedAt
    status
    allocatedTime
  }
}
    `;
export const ActivateScheduledEventDocument = gql`
    mutation activateScheduledEvent($input: ActivateScheduledEventInput!) {
  activateScheduledEvent(activateScheduledEvent: $input) {
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
      startsAt
      endsAt
      bookingType
      scheduledBy {
        id
        firstname
        lastname
      }
      status
      description
    }
  }
}
    `;
export const DeleteScheduledEventsDocument = gql`
    mutation deleteScheduledEvents($input: DeleteScheduledEventsInput!) {
  deleteScheduledEvents(deleteScheduledEventsInput: $input) {
    error
    scheduledEvents {
      id
      bookingType
      startsAt
      endsAt
      description
      status
    }
  }
}
    `;
export const FinalizeScheduledEventDocument = gql`
    mutation finalizeScheduledEvent($input: FinalizeScheduledEventInput!) {
  finalizeScheduledEvent(finalizeScheduledEvent: $input) {
    error
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
      status
      equipmentAssignmentStatus
      equipmentId
      proposalBooking {
        status
        proposal {
          primaryKey
          title
          proposalId
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
    query getProposalBookingScheduledEvents($proposalBookingId: Int!) {
  proposalBookingScheduledEvents(proposalBookingId: $proposalBookingId) {
    id
    startsAt
    endsAt
    bookingType
    scheduledBy {
      id
      firstname
      lastname
    }
    status
    description
  }
}
    `;
export const GetScheduledEventEquipmentsDocument = gql`
    query getScheduledEventEquipments($proposalBookingId: Int!, $scheduledEventId: Int!) {
  proposalBookingScheduledEvent(
    proposalBookingId: $proposalBookingId
    scheduledEventId: $scheduledEventId
  ) {
    equipments {
      id
      name
      description
      maintenanceStartsAt
      maintenanceEndsAt
      status
    }
  }
}
    `;
export const GetScheduledEventWithEquipmentsDocument = gql`
    query getScheduledEventWithEquipments($proposalBookingId: Int!, $scheduledEventId: Int!, $scheduledEventFilter: ProposalBookingScheduledEventFilter!) {
  proposalBookingScheduledEvent(
    proposalBookingId: $proposalBookingId
    scheduledEventId: $scheduledEventId
  ) {
    id
    startsAt
    endsAt
    status
    proposalBooking {
      id
      status
      allocatedTime
      scheduledEvents(filter: $scheduledEventFilter) {
        id
        startsAt
        endsAt
      }
      proposal {
        primaryKey
        title
        proposalId
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
    }
    scheduledBy {
      firstname
      lastname
    }
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
    status
    description
    instrument {
      id
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
        proposalId
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
    query getScheduledEventsWithEquipments($proposalBookingId: Int!) {
  proposalBookingScheduledEvents(proposalBookingId: $proposalBookingId) {
    id
    startsAt
    endsAt
    status
    equipments {
      id
      name
      description
      maintenanceStartsAt
      maintenanceEndsAt
      status
    }
  }
}
    `;
export const UpdateScheduledEventDocument = gql`
    mutation updateScheduledEvent($input: UpdateScheduledEventInput!) {
  updateScheduledEvent(updateScheduledEvent: $input) {
    error
    scheduledEvent {
      id
      startsAt
      endsAt
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
    addLostTime(variables: AddLostTimeMutationVariables): Promise<AddLostTimeMutation> {
      return withWrapper(() => client.request<AddLostTimeMutation>(print(AddLostTimeDocument), variables));
    },
    deleteLostTime(variables: DeleteLostTimeMutationVariables): Promise<DeleteLostTimeMutation> {
      return withWrapper(() => client.request<DeleteLostTimeMutation>(print(DeleteLostTimeDocument), variables));
    },
    getProposalBookingLostTimes(variables: GetProposalBookingLostTimesQueryVariables): Promise<GetProposalBookingLostTimesQuery> {
      return withWrapper(() => client.request<GetProposalBookingLostTimesQuery>(print(GetProposalBookingLostTimesDocument), variables));
    },
    updateLostTime(variables: UpdateLostTimeMutationVariables): Promise<UpdateLostTimeMutation> {
      return withWrapper(() => client.request<UpdateLostTimeMutation>(print(UpdateLostTimeDocument), variables));
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
    activateScheduledEvent(variables: ActivateScheduledEventMutationVariables): Promise<ActivateScheduledEventMutation> {
      return withWrapper(() => client.request<ActivateScheduledEventMutation>(print(ActivateScheduledEventDocument), variables));
    },
    createScheduledEvent(variables: CreateScheduledEventMutationVariables): Promise<CreateScheduledEventMutation> {
      return withWrapper(() => client.request<CreateScheduledEventMutation>(print(CreateScheduledEventDocument), variables));
    },
    deleteScheduledEvents(variables: DeleteScheduledEventsMutationVariables): Promise<DeleteScheduledEventsMutation> {
      return withWrapper(() => client.request<DeleteScheduledEventsMutation>(print(DeleteScheduledEventsDocument), variables));
    },
    finalizeScheduledEvent(variables: FinalizeScheduledEventMutationVariables): Promise<FinalizeScheduledEventMutation> {
      return withWrapper(() => client.request<FinalizeScheduledEventMutation>(print(FinalizeScheduledEventDocument), variables));
    },
    getEquipmentScheduledEvents(variables: GetEquipmentScheduledEventsQueryVariables): Promise<GetEquipmentScheduledEventsQuery> {
      return withWrapper(() => client.request<GetEquipmentScheduledEventsQuery>(print(GetEquipmentScheduledEventsDocument), variables));
    },
    getProposalBookingScheduledEvents(variables: GetProposalBookingScheduledEventsQueryVariables): Promise<GetProposalBookingScheduledEventsQuery> {
      return withWrapper(() => client.request<GetProposalBookingScheduledEventsQuery>(print(GetProposalBookingScheduledEventsDocument), variables));
    },
    getScheduledEventEquipments(variables: GetScheduledEventEquipmentsQueryVariables): Promise<GetScheduledEventEquipmentsQuery> {
      return withWrapper(() => client.request<GetScheduledEventEquipmentsQuery>(print(GetScheduledEventEquipmentsDocument), variables));
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
    updateScheduledEvent(variables: UpdateScheduledEventMutationVariables): Promise<UpdateScheduledEventMutation> {
      return withWrapper(() => client.request<UpdateScheduledEventMutation>(print(UpdateScheduledEventDocument), variables));
    },
    getUsers(variables?: GetUsersQueryVariables): Promise<GetUsersQuery> {
      return withWrapper(() => client.request<GetUsersQuery>(print(GetUsersDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;