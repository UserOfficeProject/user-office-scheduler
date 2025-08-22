import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  IntStringDateBoolArray: { input: any; output: any; }
  TzLessDateTime: { input: any; output: any; }
};

export type ActivateScheduledEventsInput = {
  ids: Array<Scalars['Int']['input']>;
};

export type AddConnectionStatusActionsInput = {
  actions: Array<ConnectionHasActionsInput>;
  connectionId: Scalars['Int']['input'];
  workflowId: Scalars['Int']['input'];
};

export type AddLostTimeInput = {
  lostTime: SimpleLostTimeInput;
  proposalBookingId: Scalars['Int']['input'];
};

export type AddStatusChangingEventsToConnectionInput = {
  statusChangingEvents: Array<Scalars['String']['input']>;
  workflowConnectionId: Scalars['Int']['input'];
};

export type AddTechnicalReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<Scalars['String']['input']>;
  instrumentId: Scalars['Int']['input'];
  proposalPk: Scalars['Int']['input'];
  publicComment?: InputMaybe<Scalars['String']['input']>;
  questionaryId: Scalars['Int']['input'];
  reviewerId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<TechnicalReviewStatus>;
  submitted?: InputMaybe<Scalars['Boolean']['input']>;
  timeAllocation?: InputMaybe<Scalars['Int']['input']>;
};

export type AddWorkflowStatusInput = {
  droppableGroupId: Scalars['String']['input'];
  nextStatusId?: InputMaybe<Scalars['Int']['input']>;
  parentDroppableGroupId?: InputMaybe<Scalars['String']['input']>;
  prevStatusId?: InputMaybe<Scalars['Int']['input']>;
  sortOrder: Scalars['Int']['input'];
  statusId: Scalars['Int']['input'];
  workflowId: Scalars['Int']['input'];
};

export type AllQuestionsFilter = {
  category?: InputMaybe<TemplateCategoryId>;
  dataType?: InputMaybe<Array<DataType>>;
  excludeDataType?: InputMaybe<Array<DataType>>;
};

export type AllQuestionsQueryResult = {
  questions: Array<QuestionWithUsage>;
  totalCount: Scalars['Int']['output'];
};

export enum AllocationTimeUnits {
  DAY = 'Day',
  HOUR = 'Hour',
  WEEK = 'Week'
}

export type Answer = {
  answerId: Maybe<Scalars['Int']['output']>;
  config: FieldConfig;
  dependencies: Array<FieldDependency>;
  dependenciesOperator: Maybe<DependenciesLogicOperator>;
  question: Question;
  sortOrder: Scalars['Int']['output'];
  topicId: Scalars['Int']['output'];
  value: Maybe<Scalars['IntStringDateBoolArray']['output']>;
};

export type AnswerBasic = {
  answer: Scalars['IntStringDateBoolArray']['output'];
  answerId: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['DateTime']['output'];
  questionId: Scalars['String']['output'];
  questionaryId: Scalars['Int']['output'];
};

export type AnswerInput = {
  questionId: Scalars['String']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
};

export type ApiCallRequestHeader = {
  name: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ApproveVisitRegistrationInput = {
  userId: Scalars['Int']['input'];
  visitId: Scalars['Int']['input'];
};

export type AssignChairOrSecretaryToFapInput = {
  fapId: Scalars['Int']['input'];
  roleId: UserRole;
  userId: Scalars['Int']['input'];
};

export type AssignEquipmentsToScheduledEventInput = {
  equipmentIds: Array<Scalars['Int']['input']>;
  proposalBookingId: Scalars['Int']['input'];
  scheduledEventId: Scalars['Int']['input'];
};

export type AssignInstrumentsToCallInput = {
  callId: Scalars['Int']['input'];
  instrumentFapIds: Array<InstrumentFapMappingInput>;
};

export type AuthJwtApiTokenPayload = {
  accessTokenId: Scalars['String']['output'];
};

export type AuthJwtPayload = {
  currentRole: Role;
  roles: Array<Role>;
  user: UserJwt;
};

export type BasicUserDetails = {
  country: Maybe<Scalars['String']['output']>;
  created: Maybe<Scalars['DateTime']['output']>;
  email: Maybe<Scalars['String']['output']>;
  firstname: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  institution: Scalars['String']['output'];
  institutionId: Scalars['Int']['output'];
  lastname: Scalars['String']['output'];
  placeholder: Maybe<Scalars['Boolean']['output']>;
  position: Scalars['String']['output'];
  preferredname: Maybe<Scalars['String']['output']>;
};

export type BooleanConfig = {
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  tooltip: Scalars['String']['output'];
};

export type Call = {
  allocationTimeUnit: AllocationTimeUnits;
  cycleComment: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  endCall: Scalars['DateTime']['output'];
  endCallInternal: Maybe<Scalars['DateTime']['output']>;
  endCycle: Scalars['DateTime']['output'];
  endFapReview: Maybe<Scalars['DateTime']['output']>;
  endNotify: Scalars['DateTime']['output'];
  endReview: Scalars['DateTime']['output'];
  esiTemplateId: Maybe<Scalars['Int']['output']>;
  experimentSafetyPdfTemplateId: Maybe<Scalars['Int']['output']>;
  experimentWorkflow: Maybe<Workflow>;
  experimentWorkflowId: Maybe<Scalars['Int']['output']>;
  fapReviewTemplateId: Maybe<Scalars['Int']['output']>;
  faps: Maybe<Array<Fap>>;
  id: Scalars['Int']['output'];
  instruments: Array<InstrumentWithAvailabilityTime>;
  isActive: Scalars['Boolean']['output'];
  isActiveInternal: Scalars['Boolean']['output'];
  proposalCount: Scalars['Int']['output'];
  proposalPdfTemplateId: Maybe<Scalars['Int']['output']>;
  proposalSequence: Maybe<Scalars['Int']['output']>;
  proposalWorkflow: Maybe<Workflow>;
  proposalWorkflowId: Maybe<Scalars['Int']['output']>;
  referenceNumberFormat: Maybe<Scalars['String']['output']>;
  shortCode: Scalars['String']['output'];
  startCall: Scalars['DateTime']['output'];
  startCycle: Scalars['DateTime']['output'];
  startFapReview: Maybe<Scalars['DateTime']['output']>;
  startNotify: Scalars['DateTime']['output'];
  startReview: Scalars['DateTime']['output'];
  submissionMessage: Maybe<Scalars['String']['output']>;
  surveyComment: Scalars['String']['output'];
  tags: Tag;
  technicalReviewTemplateId: Maybe<Scalars['Int']['output']>;
  template: Template;
  templateId: Scalars['Int']['output'];
  title: Maybe<Scalars['String']['output']>;
};

export type CallsFilter = {
  esiTemplateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  experimentSafetyPdfTemplateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  fapIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  fapReviewTemplateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  instrumentIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isActiveInternal?: InputMaybe<Scalars['Boolean']['input']>;
  isCallEndedByEvent?: InputMaybe<Scalars['Boolean']['input']>;
  isEnded?: InputMaybe<Scalars['Boolean']['input']>;
  isEndedInternal?: InputMaybe<Scalars['Boolean']['input']>;
  isFapReviewEnded?: InputMaybe<Scalars['Boolean']['input']>;
  isReviewEnded?: InputMaybe<Scalars['Boolean']['input']>;
  proposalPdfTemplateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  proposalStatusShortCode?: InputMaybe<Scalars['String']['input']>;
  shortCode?: InputMaybe<Scalars['String']['input']>;
  technicalReviewTemplateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  templateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type CancelVisitRegistrationInput = {
  userId: Scalars['Int']['input'];
  visitId: Scalars['Int']['input'];
};

export type ChangeProposalsStatusInput = {
  proposalPks: Array<Scalars['Int']['input']>;
  statusId: Scalars['Int']['input'];
};

export type CloneProposalsInput = {
  callId: Scalars['Int']['input'];
  proposalsToClonePk: Array<Scalars['Int']['input']>;
};

export type ConfirmEquipmentAssignmentInput = {
  equipmentId: Scalars['Int']['input'];
  newStatus: EquipmentAssignmentStatus;
  scheduledEventId: Scalars['Int']['input'];
};

export type ConflictResolution = {
  itemId: Scalars['String']['input'];
  strategy: ConflictResolutionStrategy;
};

export enum ConflictResolutionStrategy {
  UNRESOLVED = 'UNRESOLVED',
  USE_EXISTING = 'USE_EXISTING',
  USE_NEW = 'USE_NEW'
}

export type ConnectionHasActionsInput = {
  actionId: Scalars['Int']['input'];
  actionType: StatusActionType;
  config?: InputMaybe<Scalars['String']['input']>;
};

export type ConnectionStatusAction = {
  action: StatusAction;
  actionId: Scalars['Int']['output'];
  config: Maybe<StatusActionConfig>;
  connectionId: Scalars['Int']['output'];
  workflowId: Scalars['Int']['output'];
};

export type CopyAnswerInput = {
  sourceQuestionaryId: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type CreateApiAccessTokenInput = {
  accessPermissions: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateCallInput = {
  allocationTimeUnit: AllocationTimeUnits;
  cycleComment: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  endCall: Scalars['DateTime']['input'];
  endCallInternal?: InputMaybe<Scalars['DateTime']['input']>;
  endCycle: Scalars['DateTime']['input'];
  endFapReview?: InputMaybe<Scalars['DateTime']['input']>;
  endNotify: Scalars['DateTime']['input'];
  endReview: Scalars['DateTime']['input'];
  esiTemplateId?: InputMaybe<Scalars['Int']['input']>;
  experimentSafetyPdfTemplateId?: InputMaybe<Scalars['Int']['input']>;
  experimentWorkflowId?: InputMaybe<Scalars['Int']['input']>;
  fapReviewTemplateId?: InputMaybe<Scalars['Int']['input']>;
  faps?: InputMaybe<Array<Scalars['Int']['input']>>;
  proposalPdfTemplateId?: InputMaybe<Scalars['Int']['input']>;
  proposalSequence?: InputMaybe<Scalars['Int']['input']>;
  proposalWorkflowId: Scalars['Int']['input'];
  referenceNumberFormat?: InputMaybe<Scalars['String']['input']>;
  shortCode: Scalars['String']['input'];
  startCall: Scalars['DateTime']['input'];
  startCycle: Scalars['DateTime']['input'];
  startFapReview?: InputMaybe<Scalars['DateTime']['input']>;
  startNotify: Scalars['DateTime']['input'];
  startReview: Scalars['DateTime']['input'];
  submissionMessage?: InputMaybe<Scalars['String']['input']>;
  surveyComment: Scalars['String']['input'];
  technicalReviewTemplateId?: InputMaybe<Scalars['Int']['input']>;
  templateId: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateInternalReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<Scalars['String']['input']>;
  reviewerId?: InputMaybe<Scalars['Int']['input']>;
  technicalReviewId: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type CreatePredefinedMessageInput = {
  key: Scalars['String']['input'];
  message: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateStatusInput = {
  description: Scalars['String']['input'];
  entityType: WorkflowType;
  name: Scalars['String']['input'];
  shortCode: Scalars['String']['input'];
};

export type CreateWorkflowInput = {
  description: Scalars['String']['input'];
  entityType: WorkflowType;
  name: Scalars['String']['input'];
};

export enum DataType {
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  DYNAMIC_MULTIPLE_CHOICE = 'DYNAMIC_MULTIPLE_CHOICE',
  EMBELLISHMENT = 'EMBELLISHMENT',
  EXPERIMENT_SAFETY_REVIEW_BASIS = 'EXPERIMENT_SAFETY_REVIEW_BASIS',
  FAP_REVIEW_BASIS = 'FAP_REVIEW_BASIS',
  FEEDBACK_BASIS = 'FEEDBACK_BASIS',
  FILE_UPLOAD = 'FILE_UPLOAD',
  GENERIC_TEMPLATE = 'GENERIC_TEMPLATE',
  GENERIC_TEMPLATE_BASIS = 'GENERIC_TEMPLATE_BASIS',
  INSTRUMENT_PICKER = 'INSTRUMENT_PICKER',
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
  TECHNICAL_REVIEW_BASIS = 'TECHNICAL_REVIEW_BASIS',
  TECHNIQUE_PICKER = 'TECHNIQUE_PICKER',
  TEXT_INPUT = 'TEXT_INPUT',
  VISIT_BASIS = 'VISIT_BASIS'
}

export type DateConfig = {
  defaultDate: Maybe<Scalars['String']['output']>;
  includeTime: Scalars['Boolean']['output'];
  maxDate: Maybe<Scalars['String']['output']>;
  minDate: Maybe<Scalars['String']['output']>;
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  tooltip: Scalars['String']['output'];
};

export type DateFilterInput = {
  from?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
};

export type DbStat = {
  state: Maybe<Scalars['String']['output']>;
  total: Scalars['Float']['output'];
};

export type DeleteApiAccessTokenInput = {
  accessTokenId: Scalars['String']['input'];
};

export type DeleteEquipmentAssignmentInput = {
  equipmentId: Scalars['Int']['input'];
  proposalBookingId: Scalars['Int']['input'];
  scheduledEventId: Scalars['Int']['input'];
};

export type DeleteInternalReviewInput = {
  id: Scalars['Int']['input'];
  technicalReviewId: Scalars['Int']['input'];
};

export type DeleteLostTimeInput = {
  id: Scalars['Int']['input'];
};

export type DeletePredefinedMessageInput = {
  id: Scalars['Int']['input'];
};

export type DeleteScheduledEventsInput = {
  ids: Array<Scalars['Int']['input']>;
  instrumentId: Scalars['Int']['input'];
  proposalBookingId?: InputMaybe<Scalars['Int']['input']>;
};

export type DeleteWorkflowStatusInput = {
  sortOrder: Scalars['Int']['input'];
  statusId: Scalars['Int']['input'];
  workflowId: Scalars['Int']['input'];
};

export enum DependenciesLogicOperator {
  AND = 'AND',
  OR = 'OR'
}

export type DynamicMultipleChoiceConfig = {
  apiCallRequestHeaders: Array<ApiCallRequestHeader>;
  externalApiCall: Scalars['Boolean']['output'];
  isMultipleSelect: Scalars['Boolean']['output'];
  jsonPath: Scalars['String']['output'];
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  tooltip: Scalars['String']['output'];
  url: Scalars['String']['output'];
  variant: Scalars['String']['output'];
};

export type EmailActionConfig = {
  recipientsWithEmailTemplate: Array<EmailStatusActionRecipientsWithTemplate>;
};

export type EmailActionDefaultConfig = {
  emailTemplates: Array<EmailStatusActionEmailTemplate>;
  recipients: Array<EmailStatusActionRecipient>;
};

export type EmailStatusActionEmailTemplate = {
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type EmailStatusActionRecipient = {
  description: Maybe<Scalars['String']['output']>;
  name: EmailStatusActionRecipients;
};

export enum EmailStatusActionRecipients {
  CO_PROPOSERS = 'CO_PROPOSERS',
  EXPERIMENT_SAFETY_REVIEWERS = 'EXPERIMENT_SAFETY_REVIEWERS',
  FAP_CHAIR_AND_SECRETARY = 'FAP_CHAIR_AND_SECRETARY',
  FAP_REVIEWERS = 'FAP_REVIEWERS',
  INSTRUMENT_SCIENTISTS = 'INSTRUMENT_SCIENTISTS',
  OTHER = 'OTHER',
  PI = 'PI',
  TECHNIQUE_SCIENTISTS = 'TECHNIQUE_SCIENTISTS',
  USER_OFFICE = 'USER_OFFICE'
}

export type EmailStatusActionRecipientsWithTemplate = {
  combineEmails: Maybe<Scalars['Boolean']['output']>;
  emailTemplate: EmailStatusActionEmailTemplate;
  otherRecipientEmails: Maybe<Array<Scalars['String']['output']>>;
  recipient: EmailStatusActionRecipient;
};

export type EmbellishmentConfig = {
  html: Scalars['String']['output'];
  omitFromPdf: Scalars['Boolean']['output'];
  plain: Scalars['String']['output'];
  readPermissions: Array<Scalars['String']['output']>;
};

export type Entry = {
  id: Scalars['Int']['output'];
  value: Scalars['String']['output'];
};

export type Equipment = {
  autoAccept: Scalars['Boolean']['output'];
  color: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  equipmentInstruments: Maybe<Array<Instrument>>;
  equipmentResponsible: Maybe<Array<BasicUserDetails>>;
  events: Maybe<Array<ScheduledEvent>>;
  id: Scalars['Int']['output'];
  maintenanceEndsAt: Maybe<Scalars['TzLessDateTime']['output']>;
  maintenanceStartsAt: Maybe<Scalars['TzLessDateTime']['output']>;
  name: Scalars['String']['output'];
  owner: Maybe<BasicUserDetails>;
  updatedAt: Scalars['DateTime']['output'];
};


export type EquipmentEventsArgs = {
  endsAt: Scalars['TzLessDateTime']['input'];
  startsAt: Scalars['TzLessDateTime']['input'];
};

export enum EquipmentAssignmentStatus {
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED'
}

export type EquipmentInput = {
  autoAccept: Scalars['Boolean']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  equipmentResponsible?: InputMaybe<Array<Scalars['Int']['input']>>;
  instrumentIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  maintenanceEndsAt?: InputMaybe<Scalars['TzLessDateTime']['input']>;
  maintenanceStartsAt?: InputMaybe<Scalars['TzLessDateTime']['input']>;
  name: Scalars['String']['input'];
  ownerUserId: Scalars['Int']['input'];
};

export type EquipmentResponseWrap = {
  equipment: Maybe<Equipment>;
  error: Maybe<Scalars['String']['output']>;
};

export type EquipmentWithAssignmentStatus = {
  autoAccept: Scalars['Boolean']['output'];
  color: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  equipmentInstruments: Maybe<Array<Instrument>>;
  equipmentResponsible: Maybe<Array<BasicUserDetails>>;
  events: Maybe<Array<ScheduledEvent>>;
  id: Scalars['Int']['output'];
  maintenanceEndsAt: Maybe<Scalars['TzLessDateTime']['output']>;
  maintenanceStartsAt: Maybe<Scalars['TzLessDateTime']['output']>;
  name: Scalars['String']['output'];
  owner: Maybe<BasicUserDetails>;
  status: EquipmentAssignmentStatus;
  updatedAt: Scalars['DateTime']['output'];
};


export type EquipmentWithAssignmentStatusEventsArgs = {
  endsAt: Scalars['TzLessDateTime']['input'];
  startsAt: Scalars['TzLessDateTime']['input'];
};

export enum EvaluatorOperator {
  EQ = 'eq',
  NEQ = 'neq'
}

export enum Event {
  CALL_CREATED = 'CALL_CREATED',
  CALL_ENDED = 'CALL_ENDED',
  CALL_ENDED_INTERNAL = 'CALL_ENDED_INTERNAL',
  CALL_FAP_REVIEW_ENDED = 'CALL_FAP_REVIEW_ENDED',
  CALL_REVIEW_ENDED = 'CALL_REVIEW_ENDED',
  EMAIL_INVITE = 'EMAIL_INVITE',
  EMAIL_INVITES = 'EMAIL_INVITES',
  EMAIL_INVITE_LEGACY = 'EMAIL_INVITE_LEGACY',
  EXPERIMENT_ESF_APPROVED_BY_ESR = 'EXPERIMENT_ESF_APPROVED_BY_ESR',
  EXPERIMENT_ESF_APPROVED_BY_IS = 'EXPERIMENT_ESF_APPROVED_BY_IS',
  EXPERIMENT_ESF_REJECTED_BY_ESR = 'EXPERIMENT_ESF_REJECTED_BY_ESR',
  EXPERIMENT_ESF_REJECTED_BY_IS = 'EXPERIMENT_ESF_REJECTED_BY_IS',
  EXPERIMENT_ESF_SUBMITTED = 'EXPERIMENT_ESF_SUBMITTED',
  EXPERIMENT_SAFETY_MANAGEMENT_DECISION_SUBMITTED_BY_ESR = 'EXPERIMENT_SAFETY_MANAGEMENT_DECISION_SUBMITTED_BY_ESR',
  EXPERIMENT_SAFETY_MANAGEMENT_DECISION_SUBMITTED_BY_IS = 'EXPERIMENT_SAFETY_MANAGEMENT_DECISION_SUBMITTED_BY_IS',
  EXPERIMENT_SAFETY_STATUS_CHANGED_BY_USER = 'EXPERIMENT_SAFETY_STATUS_CHANGED_BY_USER',
  EXPERIMENT_SAFETY_STATUS_CHANGED_BY_WORKFLOW = 'EXPERIMENT_SAFETY_STATUS_CHANGED_BY_WORKFLOW',
  FAP_ALL_MEETINGS_SUBMITTED = 'FAP_ALL_MEETINGS_SUBMITTED',
  FAP_CREATED = 'FAP_CREATED',
  FAP_MEMBERS_ASSIGNED = 'FAP_MEMBERS_ASSIGNED',
  FAP_MEMBER_ASSIGNED_TO_PROPOSAL = 'FAP_MEMBER_ASSIGNED_TO_PROPOSAL',
  FAP_MEMBER_REMOVED = 'FAP_MEMBER_REMOVED',
  FAP_MEMBER_REMOVED_FROM_PROPOSAL = 'FAP_MEMBER_REMOVED_FROM_PROPOSAL',
  FAP_REVIEWER_NOTIFIED = 'FAP_REVIEWER_NOTIFIED',
  FAP_UPDATED = 'FAP_UPDATED',
  INSTRUMENTS_ASSIGNED_TO_TECHNIQUE = 'INSTRUMENTS_ASSIGNED_TO_TECHNIQUE',
  INSTRUMENTS_REMOVED_FROM_TECHNIQUE = 'INSTRUMENTS_REMOVED_FROM_TECHNIQUE',
  INSTRUMENT_ASSIGNED_TO_SCIENTIST = 'INSTRUMENT_ASSIGNED_TO_SCIENTIST',
  INSTRUMENT_CREATED = 'INSTRUMENT_CREATED',
  INSTRUMENT_DELETED = 'INSTRUMENT_DELETED',
  INSTRUMENT_UPDATED = 'INSTRUMENT_UPDATED',
  INTERNAL_REVIEW_CREATED = 'INTERNAL_REVIEW_CREATED',
  INTERNAL_REVIEW_DELETED = 'INTERNAL_REVIEW_DELETED',
  INTERNAL_REVIEW_UPDATED = 'INTERNAL_REVIEW_UPDATED',
  INVITE_ACCEPTED = 'INVITE_ACCEPTED',
  PREDEFINED_MESSAGE_CREATED = 'PREDEFINED_MESSAGE_CREATED',
  PREDEFINED_MESSAGE_DELETED = 'PREDEFINED_MESSAGE_DELETED',
  PREDEFINED_MESSAGE_UPDATED = 'PREDEFINED_MESSAGE_UPDATED',
  PROPOSAL_ACCEPTED = 'PROPOSAL_ACCEPTED',
  PROPOSAL_ALL_FAP_MEETINGS_SUBMITTED = 'PROPOSAL_ALL_FAP_MEETINGS_SUBMITTED',
  PROPOSAL_ALL_FAP_MEETING_INSTRUMENT_SUBMITTED = 'PROPOSAL_ALL_FAP_MEETING_INSTRUMENT_SUBMITTED',
  PROPOSAL_ALL_FAP_REVIEWERS_SELECTED = 'PROPOSAL_ALL_FAP_REVIEWERS_SELECTED',
  PROPOSAL_ALL_FAP_REVIEWS_SUBMITTED = 'PROPOSAL_ALL_FAP_REVIEWS_SUBMITTED',
  PROPOSAL_ALL_FEASIBILITY_REVIEWS_FEASIBLE = 'PROPOSAL_ALL_FEASIBILITY_REVIEWS_FEASIBLE',
  PROPOSAL_ALL_FEASIBILITY_REVIEWS_SUBMITTED = 'PROPOSAL_ALL_FEASIBILITY_REVIEWS_SUBMITTED',
  PROPOSAL_ALL_REVIEWS_SUBMITTED_FOR_ALL_FAPS = 'PROPOSAL_ALL_REVIEWS_SUBMITTED_FOR_ALL_FAPS',
  PROPOSAL_ASSIGNED_TO_TECHNIQUES = 'PROPOSAL_ASSIGNED_TO_TECHNIQUES',
  PROPOSAL_BOOKING_TIME_ACTIVATED = 'PROPOSAL_BOOKING_TIME_ACTIVATED',
  PROPOSAL_BOOKING_TIME_COMPLETED = 'PROPOSAL_BOOKING_TIME_COMPLETED',
  PROPOSAL_BOOKING_TIME_REOPENED = 'PROPOSAL_BOOKING_TIME_REOPENED',
  PROPOSAL_BOOKING_TIME_SLOTS_REMOVED = 'PROPOSAL_BOOKING_TIME_SLOTS_REMOVED',
  PROPOSAL_BOOKING_TIME_SLOT_ADDED = 'PROPOSAL_BOOKING_TIME_SLOT_ADDED',
  PROPOSAL_BOOKING_TIME_UPDATED = 'PROPOSAL_BOOKING_TIME_UPDATED',
  PROPOSAL_CLONED = 'PROPOSAL_CLONED',
  PROPOSAL_CO_PROPOSER_CLAIM_ACCEPTED = 'PROPOSAL_CO_PROPOSER_CLAIM_ACCEPTED',
  PROPOSAL_CO_PROPOSER_CLAIM_SENT = 'PROPOSAL_CO_PROPOSER_CLAIM_SENT',
  PROPOSAL_CREATED = 'PROPOSAL_CREATED',
  PROPOSAL_DELETED = 'PROPOSAL_DELETED',
  PROPOSAL_FAPS_REMOVED = 'PROPOSAL_FAPS_REMOVED',
  PROPOSAL_FAPS_SELECTED = 'PROPOSAL_FAPS_SELECTED',
  PROPOSAL_FAP_MEETING_INSTRUMENT_SUBMITTED = 'PROPOSAL_FAP_MEETING_INSTRUMENT_SUBMITTED',
  PROPOSAL_FAP_MEETING_INSTRUMENT_UNSUBMITTED = 'PROPOSAL_FAP_MEETING_INSTRUMENT_UNSUBMITTED',
  PROPOSAL_FAP_MEETING_RANKING_OVERWRITTEN = 'PROPOSAL_FAP_MEETING_RANKING_OVERWRITTEN',
  PROPOSAL_FAP_MEETING_REORDER = 'PROPOSAL_FAP_MEETING_REORDER',
  PROPOSAL_FAP_MEETING_SAVED = 'PROPOSAL_FAP_MEETING_SAVED',
  PROPOSAL_FAP_MEETING_SUBMITTED = 'PROPOSAL_FAP_MEETING_SUBMITTED',
  PROPOSAL_FAP_REVIEW_SUBMITTED = 'PROPOSAL_FAP_REVIEW_SUBMITTED',
  PROPOSAL_FAP_REVIEW_UPDATED = 'PROPOSAL_FAP_REVIEW_UPDATED',
  PROPOSAL_FEASIBILITY_REVIEW_FEASIBLE = 'PROPOSAL_FEASIBILITY_REVIEW_FEASIBLE',
  PROPOSAL_FEASIBILITY_REVIEW_SUBMITTED = 'PROPOSAL_FEASIBILITY_REVIEW_SUBMITTED',
  PROPOSAL_FEASIBILITY_REVIEW_UNFEASIBLE = 'PROPOSAL_FEASIBILITY_REVIEW_UNFEASIBLE',
  PROPOSAL_FEASIBILITY_REVIEW_UPDATED = 'PROPOSAL_FEASIBILITY_REVIEW_UPDATED',
  PROPOSAL_INSTRUMENTS_SELECTED = 'PROPOSAL_INSTRUMENTS_SELECTED',
  PROPOSAL_MANAGEMENT_DECISION_SUBMITTED = 'PROPOSAL_MANAGEMENT_DECISION_SUBMITTED',
  PROPOSAL_MANAGEMENT_DECISION_UPDATED = 'PROPOSAL_MANAGEMENT_DECISION_UPDATED',
  PROPOSAL_NOTIFIED = 'PROPOSAL_NOTIFIED',
  PROPOSAL_REJECTED = 'PROPOSAL_REJECTED',
  PROPOSAL_RESERVED = 'PROPOSAL_RESERVED',
  PROPOSAL_SAMPLE_REVIEW_SUBMITTED = 'PROPOSAL_SAMPLE_REVIEW_SUBMITTED',
  PROPOSAL_SAMPLE_SAFE = 'PROPOSAL_SAMPLE_SAFE',
  PROPOSAL_STATUS_ACTION_EXECUTED = 'PROPOSAL_STATUS_ACTION_EXECUTED',
  PROPOSAL_STATUS_CHANGED_BY_USER = 'PROPOSAL_STATUS_CHANGED_BY_USER',
  PROPOSAL_STATUS_CHANGED_BY_WORKFLOW = 'PROPOSAL_STATUS_CHANGED_BY_WORKFLOW',
  PROPOSAL_SUBMITTED = 'PROPOSAL_SUBMITTED',
  PROPOSAL_UPDATED = 'PROPOSAL_UPDATED',
  TECHNIQUE_CREATED = 'TECHNIQUE_CREATED',
  TECHNIQUE_DELETED = 'TECHNIQUE_DELETED',
  TECHNIQUE_UPDATED = 'TECHNIQUE_UPDATED',
  TOPIC_ANSWERED = 'TOPIC_ANSWERED',
  USER_DELETED = 'USER_DELETED',
  USER_PASSWORD_RESET_EMAIL = 'USER_PASSWORD_RESET_EMAIL',
  USER_ROLE_UPDATED = 'USER_ROLE_UPDATED',
  USER_UPDATED = 'USER_UPDATED',
  VISIT_REGISTRATION_APPROVED = 'VISIT_REGISTRATION_APPROVED',
  VISIT_REGISTRATION_CANCELLED = 'VISIT_REGISTRATION_CANCELLED'
}

export type EventLog = {
  changedBy: Maybe<User>;
  changedObjectId: Scalars['String']['output'];
  description: Scalars['String']['output'];
  eventTStamp: Scalars['DateTime']['output'];
  eventType: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  rowData: Scalars['String']['output'];
};

export type Experiment = {
  createdAt: Scalars['DateTime']['output'];
  endsAt: Scalars['DateTime']['output'];
  experimentId: Scalars['String']['output'];
  experimentPk: Scalars['Float']['output'];
  experimentSafety: Maybe<ExperimentSafety>;
  feedback: Maybe<Feedback>;
  feedbackRequests: Array<FeedbackRequest>;
  instrument: Instrument;
  instrumentId: Scalars['Float']['output'];
  localContact: Maybe<BasicUserDetails>;
  localContactId: Maybe<Scalars['Float']['output']>;
  proposal: Proposal;
  proposalPk: Scalars['Float']['output'];
  referenceNumberSequence: Maybe<Scalars['Float']['output']>;
  scheduledEventId: Scalars['Float']['output'];
  shipments: Array<Shipment>;
  startsAt: Scalars['DateTime']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  visit: Maybe<Visit>;
};

export type ExperimentHasSample = {
  createdAt: Scalars['DateTime']['output'];
  experimentPk: Scalars['Float']['output'];
  isEsiSubmitted: Scalars['Boolean']['output'];
  questionary: Questionary;
  sample: Sample;
  sampleEsiQuestionaryId: Scalars['Float']['output'];
  sampleId: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ExperimentSafety = {
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['Float']['output'];
  esiQuestionaryId: Scalars['Float']['output'];
  esiQuestionarySubmittedAt: Maybe<Scalars['DateTime']['output']>;
  experimentPk: Scalars['Float']['output'];
  experimentSafetyPk: Scalars['Float']['output'];
  experimentSafetyReviewerComment: Maybe<Scalars['String']['output']>;
  experimentSafetyReviewerDecision: Maybe<ExperimentSafetyReviewerDecisionEnum>;
  instrumentScientistComment: Maybe<Scalars['String']['output']>;
  instrumentScientistDecision: Maybe<InstrumentScientistDecisionEnum>;
  proposal: Proposal;
  questionary: Questionary;
  reviewedBy: Maybe<Scalars['Float']['output']>;
  safetyReviewQuestionary: Questionary;
  safetyReviewQuestionaryId: Maybe<Scalars['Float']['output']>;
  samples: Array<ExperimentHasSample>;
  status: Maybe<Status>;
  statusId: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ExperimentSafetyPdfTemplate = {
  created: Scalars['DateTime']['output'];
  creatorId: Scalars['Int']['output'];
  dummyData: Scalars['String']['output'];
  experimentSafetyPdfTemplateId: Scalars['Int']['output'];
  templateData: Scalars['String']['output'];
  templateFooter: Scalars['String']['output'];
  templateHeader: Scalars['String']['output'];
  templateId: Scalars['Int']['output'];
  templateSampleDeclaration: Scalars['String']['output'];
};

export type ExperimentSafetyPdfTemplatesFilter = {
  creatorId?: InputMaybe<Scalars['Int']['input']>;
  dummyData?: InputMaybe<Scalars['String']['input']>;
  experimentSafetyPdfTemplateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  pdfTemplateData?: InputMaybe<Scalars['String']['input']>;
  pdfTemplateFooter?: InputMaybe<Scalars['String']['input']>;
  pdfTemplateHeader?: InputMaybe<Scalars['String']['input']>;
  pdfTemplateSampleDeclaration?: InputMaybe<Scalars['String']['input']>;
  templateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type ExperimentSafetyReviewBasisConfig = {
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  tooltip: Scalars['String']['output'];
};

export enum ExperimentSafetyReviewerDecisionEnum {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  UNSET = 'UNSET'
}

export enum ExperimentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DRAFT = 'DRAFT'
}

export type ExperimentsFilter = {
  callId?: InputMaybe<Scalars['Int']['input']>;
  experimentEndDate?: InputMaybe<Scalars['DateTime']['input']>;
  experimentSafetyStatusId?: InputMaybe<Scalars['Int']['input']>;
  experimentStartDate?: InputMaybe<Scalars['DateTime']['input']>;
  instrumentId?: InputMaybe<Scalars['Int']['input']>;
  overlaps?: InputMaybe<TimeSpan>;
};

export type ExperimentsQueryResult = {
  experiments: Array<Experiment>;
  totalCount: Scalars['Int']['output'];
};

export type ExternalTokenResult = {
  isValid: Scalars['Boolean']['output'];
};

export type Fap = {
  active: Scalars['Boolean']['output'];
  code: Scalars['String']['output'];
  customGradeGuide: Maybe<Scalars['Boolean']['output']>;
  description: Scalars['String']['output'];
  fapChairs: Array<BasicUserDetails>;
  fapChairsCurrentProposalCounts: Array<FapProposalCount>;
  fapSecretaries: Array<BasicUserDetails>;
  fapSecretariesCurrentProposalCounts: Array<FapProposalCount>;
  files: Maybe<Scalars['String']['output']>;
  gradeGuide: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  numberRatingsRequired: Scalars['Float']['output'];
  proposalCount: Scalars['Int']['output'];
  proposalCurrentCount: Scalars['Int']['output'];
};

export type FapAssignment = {
  dateAssigned: Scalars['DateTime']['output'];
  dateReassigned: Maybe<Scalars['DateTime']['output']>;
  emailSent: Scalars['Boolean']['output'];
  fapId: Scalars['Int']['output'];
  fapMemberUserId: Maybe<Scalars['Int']['output']>;
  proposal: Proposal;
  proposalPk: Scalars['Int']['output'];
  rank: Maybe<Scalars['Int']['output']>;
  reassigned: Scalars['Boolean']['output'];
  review: Maybe<Review>;
  role: Maybe<Role>;
  user: Maybe<BasicUserDetails>;
};

export type FapInstrument = {
  fapId: Maybe<Scalars['Int']['output']>;
  instrumentId: Maybe<Scalars['Int']['output']>;
};

export type FapInstrumentInput = {
  fapId?: InputMaybe<Scalars['Int']['input']>;
  instrumentId?: InputMaybe<Scalars['Int']['input']>;
};

export type FapMeetingDecision = {
  commentForManagement: Maybe<Scalars['String']['output']>;
  commentForUser: Maybe<Scalars['String']['output']>;
  fapId: Scalars['Int']['output'];
  instrumentId: Scalars['Int']['output'];
  proposalPk: Scalars['Int']['output'];
  rankOrder: Maybe<Scalars['Int']['output']>;
  recommendation: Maybe<ProposalEndStatus>;
  submitted: Scalars['Boolean']['output'];
  submittedBy: Maybe<Scalars['Int']['output']>;
};

export type FapProposal = {
  assignments: Maybe<Array<FapAssignment>>;
  dateAssigned: Scalars['DateTime']['output'];
  fapId: Scalars['Int']['output'];
  fapTimeAllocation: Maybe<Scalars['Int']['output']>;
  instrument: Maybe<Instrument>;
  instrumentId: Scalars['Int']['output'];
  instrumentSubmitted: Scalars['Boolean']['output'];
  proposal: Proposal;
  proposalPk: Scalars['Int']['output'];
};

export type FapProposalCount = {
  count: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
};

export type FapReviewAssignmentInput = {
  memberId: Scalars['Int']['input'];
  proposalPk: Scalars['Int']['input'];
};

export type FapReviewBasisConfig = {
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  tooltip: Scalars['String']['output'];
};

export type FapReviewTemplate = {
  callCount: Scalars['Int']['output'];
  complementaryQuestions: Array<Question>;
  description: Maybe<Scalars['String']['output']>;
  experimentSafetyPdfCallCount: Maybe<Scalars['Int']['output']>;
  experimentSafetyPdfTemplate: Maybe<ExperimentSafetyPdfTemplate>;
  group: TemplateGroup;
  groupId: TemplateGroupId;
  isArchived: Scalars['Boolean']['output'];
  json: Scalars['String']['output'];
  name: Scalars['String']['output'];
  proposalESICallCount: Maybe<Scalars['Int']['output']>;
  proposalPdfCallCount: Maybe<Scalars['Int']['output']>;
  proposalPdfTemplate: Maybe<ProposalPdfTemplate>;
  questionaryCount: Scalars['Int']['output'];
  steps: Array<TemplateStep>;
  templateId: Scalars['Int']['output'];
};

export type FapReviewTemplatesFilter = {
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  templateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type FapReviewer = {
  fapId: Scalars['Int']['output'];
  proposalsCount: Scalars['Int']['output'];
  proposalsCountByCall: Scalars['Int']['output'];
  role: Maybe<Role>;
  user: BasicUserDetails;
  userId: Scalars['Int']['output'];
};

export type FapsFilter = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  callIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type FapsQueryResult = {
  faps: Array<Fap>;
  totalCount: Scalars['Int']['output'];
};

export type Feature = {
  description: Scalars['String']['output'];
  id: FeatureId;
  isEnabled: Scalars['Boolean']['output'];
};

export enum FeatureId {
  CONFLICT_OF_INTEREST_WARNING = 'CONFLICT_OF_INTEREST_WARNING',
  DATA_ACCESS_USERS = 'DATA_ACCESS_USERS',
  EMAIL_INVITE = 'EMAIL_INVITE',
  EMAIL_INVITE_LEGACY = 'EMAIL_INVITE_LEGACY',
  EMAIL_SEARCH = 'EMAIL_SEARCH',
  EXPERIMENT_SAFETY_REVIEW = 'EXPERIMENT_SAFETY_REVIEW',
  FAP_REVIEW = 'FAP_REVIEW',
  INSTRUMENT_MANAGEMENT = 'INSTRUMENT_MANAGEMENT',
  OAUTH = 'OAUTH',
  PREGENERATED_PROPOSAL_PDF = 'PREGENERATED_PROPOSAL_PDF',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  SCHEDULER = 'SCHEDULER',
  SHIPPING = 'SHIPPING',
  STFC_IDLE_TIMER = 'STFC_IDLE_TIMER',
  TAGS = 'TAGS',
  TECHNICAL_REVIEW = 'TECHNICAL_REVIEW',
  TECHNIQUE_PROPOSALS = 'TECHNIQUE_PROPOSALS',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  USER_SEARCH_FILTER = 'USER_SEARCH_FILTER',
  VISIT_MANAGEMENT = 'VISIT_MANAGEMENT'
}

export enum FeatureUpdateAction {
  DISABLE = 'DISABLE',
  ENABLE = 'ENABLE'
}

export type Feedback = {
  createdAt: Scalars['DateTime']['output'];
  creatorId: Scalars['Int']['output'];
  experimentPk: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  questionary: Questionary;
  questionaryId: Scalars['Int']['output'];
  status: FeedbackStatus;
  submittedAt: Maybe<Scalars['DateTime']['output']>;
};

export type FeedbackBasisConfig = {
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  tooltip: Scalars['String']['output'];
};

export type FeedbackRequest = {
  experimentPk: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  requestedAt: Scalars['DateTime']['output'];
};

export enum FeedbackStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED'
}

export type FeedbacksFilter = {
  creatorId?: InputMaybe<Scalars['Int']['input']>;
  experimentPk?: InputMaybe<Scalars['Int']['input']>;
};

export type FieldCondition = {
  condition: EvaluatorOperator;
  params: Scalars['IntStringDateBoolArray']['output'];
};

export type FieldConditionInput = {
  condition: EvaluatorOperator;
  params: Scalars['String']['input'];
};

export type FieldConfig = BooleanConfig | DateConfig | DynamicMultipleChoiceConfig | EmbellishmentConfig | ExperimentSafetyReviewBasisConfig | FapReviewBasisConfig | FeedbackBasisConfig | FileUploadConfig | GenericTemplateBasisConfig | InstrumentPickerConfig | IntervalConfig | NumberInputConfig | ProposalBasisConfig | ProposalEsiBasisConfig | RichTextInputConfig | SampleBasisConfig | SampleDeclarationConfig | SampleEsiBasisConfig | SelectionFromOptionsConfig | ShipmentBasisConfig | SubTemplateConfig | TechnicalReviewBasisConfig | TechniquePickerConfig | TextInputConfig | VisitBasisConfig;

export type FieldDependency = {
  condition: FieldCondition;
  dependencyId: Scalars['String']['output'];
  dependencyNaturalKey: Scalars['String']['output'];
  questionId: Scalars['String']['output'];
};

export type FieldDependencyInput = {
  condition: FieldConditionInput;
  dependencyId: Scalars['String']['input'];
};

export type FileMetadata = {
  createdDate: Scalars['DateTime']['output'];
  fileId: Scalars['String']['output'];
  mimeType: Scalars['String']['output'];
  originalFileName: Scalars['String']['output'];
  sizeInBytes: Scalars['Int']['output'];
};

export type FileUploadConfig = {
  file_type: Array<Scalars['String']['output']>;
  max_files: Scalars['Int']['output'];
  omitFromPdf: Scalars['Boolean']['output'];
  pdf_page_limit: Scalars['Int']['output'];
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  tooltip: Scalars['String']['output'];
};

export type FilesMetadataFilter = {
  fileIds: Array<Scalars['String']['input']>;
};

export type FinalizeScheduledEventInput = {
  action: ProposalBookingFinalizeAction;
  id: Scalars['Int']['input'];
};

export type GenericTemplate = {
  created: Scalars['DateTime']['output'];
  creatorId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  proposal: Proposal;
  proposalPk: Scalars['Int']['output'];
  questionId: Scalars['String']['output'];
  questionary: Questionary;
  questionaryId: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type GenericTemplateBasisConfig = {
  questionLabel: Scalars['String']['output'];
  readPermissions: Array<Scalars['String']['output']>;
  titlePlaceholder: Scalars['String']['output'];
};

export type GenericTemplatesFilter = {
  creatorId?: InputMaybe<Scalars['Int']['input']>;
  genericTemplateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  proposalPk?: InputMaybe<Scalars['Int']['input']>;
  questionId?: InputMaybe<Scalars['String']['input']>;
  questionaryIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type HealthStats = {
  dbStats: Array<DbStat>;
  message: Scalars['String']['output'];
};

export type IndexWithGroupId = {
  droppableId: Scalars['String']['input'];
  index: Scalars['Int']['input'];
};

export type Institution = {
  country: Maybe<Entry>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  rorId: Maybe<Scalars['String']['output']>;
};

export type InstitutionsFilter = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Instrument = {
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  instrumentContact: Maybe<BasicUserDetails>;
  managerUserId: Scalars['Int']['output'];
  multipleTechReviewsEnabled: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  scientists: Array<BasicUserDetails>;
  selectable: Maybe<Scalars['Boolean']['output']>;
  shortCode: Scalars['String']['output'];
  tags: Maybe<Array<Tag>>;
};

export type InstrumentFapMappingInput = {
  fapId?: InputMaybe<Scalars['Int']['input']>;
  instrumentId: Scalars['Int']['input'];
};

export type InstrumentFilterInput = {
  instrumentId?: InputMaybe<Scalars['Int']['input']>;
  showAllProposals: Scalars['Boolean']['input'];
  showMultiInstrumentProposals: Scalars['Boolean']['input'];
};

export type InstrumentOption = {
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
};

export type InstrumentPickerConfig = {
  instruments: Array<InstrumentOption>;
  isMultipleSelect: Scalars['Boolean']['output'];
  readPermissions: Array<Scalars['String']['output']>;
  requestTime: Scalars['Boolean']['output'];
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  tooltip: Scalars['String']['output'];
  variant: Scalars['String']['output'];
};

export enum InstrumentScientistDecisionEnum {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  UNSET = 'UNSET'
}

export type InstrumentWithAvailabilityTime = {
  availabilityTime: Maybe<Scalars['Int']['output']>;
  description: Scalars['String']['output'];
  fap: Maybe<Fap>;
  fapId: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  instrumentContact: Maybe<BasicUserDetails>;
  managerUserId: Scalars['Int']['output'];
  multipleTechReviewsEnabled: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  scientists: Array<BasicUserDetails>;
  selectable: Maybe<Scalars['Boolean']['output']>;
  shortCode: Scalars['String']['output'];
  submitted: Maybe<Scalars['Boolean']['output']>;
  tags: Maybe<Array<Tag>>;
};

export type InstrumentWithManagementTime = {
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  instrumentContact: Maybe<BasicUserDetails>;
  managementTimeAllocation: Maybe<Scalars['Int']['output']>;
  managerUserId: Scalars['Int']['output'];
  multipleTechReviewsEnabled: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  scientists: Array<BasicUserDetails>;
  selectable: Maybe<Scalars['Boolean']['output']>;
  shortCode: Scalars['String']['output'];
  tags: Maybe<Array<Tag>>;
};

export type InstrumentsQueryResult = {
  instruments: Array<Instrument>;
  totalCount: Scalars['Int']['output'];
};

export type InternalReview = {
  assignedBy: Scalars['Int']['output'];
  assignedByUser: Maybe<BasicUserDetails>;
  comment: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  files: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  reviewer: Maybe<BasicUserDetails>;
  reviewerId: Scalars['Int']['output'];
  technicalReviewId: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type InternalReviewsFilter = {
  reviewerId?: InputMaybe<Scalars['Int']['input']>;
  technicalReviewId?: InputMaybe<Scalars['Int']['input']>;
};

export type IntervalConfig = {
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  tooltip: Scalars['String']['output'];
  units: Array<Unit>;
};

export type Invite = {
  claimedAt: Maybe<Scalars['DateTime']['output']>;
  claimedByUserId: Maybe<Scalars['Int']['output']>;
  code: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdByUserId: Scalars['Int']['output'];
  email: Scalars['String']['output'];
  expiresAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  isEmailSent: Scalars['Boolean']['output'];
};

export type LostTime = {
  createdAt: Scalars['DateTime']['output'];
  endsAt: Scalars['TzLessDateTime']['output'];
  id: Scalars['Int']['output'];
  proposalBookingId: Scalars['Int']['output'];
  scheduledEventId: Scalars['Int']['output'];
  startsAt: Scalars['TzLessDateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type LostTimeResponseWrap = {
  error: Maybe<Scalars['String']['output']>;
  lostTime: Maybe<LostTime>;
};

export type ManagementTimeAllocationsInput = {
  instrumentId: Scalars['Int']['input'];
  value: Scalars['Int']['input'];
};

export type MoveWorkflowStatusInput = {
  from: IndexWithGroupId;
  to: IndexWithGroupId;
  workflowId: Scalars['Int']['input'];
};

export type Mutation = {
  acceptInvite: Invite;
  activateProposalBooking: ProposalBookingResponseWrap;
  activateScheduledEvents: ScheduledEventsResponseWrap;
  addClientLog: Scalars['Boolean']['output'];
  addConnectionStatusActions: Maybe<Array<ConnectionStatusAction>>;
  addLostTime: LostTimeResponseWrap;
  addSampleToExperiment: ExperimentHasSample;
  addSamplesToShipment: Shipment;
  addStatusChangingEventsToConnection: Array<StatusChangingEvent>;
  addTechnicalReview: TechnicalReview;
  addUserForReview: Review;
  addUserRole: Scalars['Boolean']['output'];
  addWorkflowStatus: WorkflowConnection;
  administrationProposal: Proposal;
  answerTopic: Array<AnswerBasic>;
  applyPatches: Array<Scalars['String']['output']>;
  approveVisitRegistration: VisitRegistration;
  assignCallsToTag: Scalars['Boolean']['output'];
  assignChairOrSecretary: Fap;
  assignFapReviewersToProposals: Fap;
  assignInstrumentsToCall: Call;
  assignInstrumentsToTag: Scalars['Boolean']['output'];
  assignInstrumentsToTechnique: Scalars['Boolean']['output'];
  assignProposalToTechniques: Scalars['Boolean']['output'];
  assignProposalsToFaps: Scalars['Boolean']['output'];
  assignProposalsToInstruments: Scalars['Boolean']['output'];
  assignReviewersToFap: Fap;
  assignScientistsToInstrument: Scalars['Boolean']['output'];
  assignScientistsToTechnique: Scalars['Boolean']['output'];
  assignTechniqueProposalsToInstruments: Scalars['Boolean']['output'];
  assignToScheduledEvents: Scalars['Boolean']['output'];
  cancelVisitRegistration: VisitRegistration;
  changeProposalsStatus: Scalars['Boolean']['output'];
  changeTechniqueProposalsStatus: Scalars['Boolean']['output'];
  cloneExperimentSample: ExperimentHasSample;
  cloneGenericTemplate: GenericTemplate;
  cloneProposals: Array<Proposal>;
  cloneSample: Sample;
  cloneTemplate: Template;
  confirmEquipmentAssignment: SchedulerSuccessResponseWrap;
  createApiAccessToken: PermissionsWithAccessToken;
  createCall: Call;
  createEquipment: EquipmentResponseWrap;
  createExperimentSafety: ExperimentSafety;
  createExperimentSafetyPdfTemplate: ExperimentSafetyPdfTemplate;
  createFap: Fap;
  createFeedback: Feedback;
  createGenericTemplate: GenericTemplate;
  createGenericTemplateWithCopiedAnswers: Array<GenericTemplate>;
  createInstrument: Instrument;
  createInternalReview: InternalReview;
  createPredefinedMessage: PredefinedMessage;
  createProposal: Proposal;
  createProposalPdfTemplate: ProposalPdfTemplate;
  createProposalScientistComment: ProposalScientistComment;
  createQuestion: Question;
  createQuestionTemplateRelation: Template;
  createQuestionary: Questionary;
  createSample: Sample;
  createScheduledEvent: ScheduledEventResponseWrap;
  createShipment: Shipment;
  createStatus: Status;
  createTag: Tag;
  createTechnique: Technique;
  createTemplate: Template;
  createTopic: Template;
  createUnit: Unit;
  createUserByEmailInvite: Scalars['Int']['output'];
  createVisit: Visit;
  createVisitRegistration: VisitRegistration;
  createWorkflow: Workflow;
  deleteApiAccessToken: Scalars['Boolean']['output'];
  deleteCall: Call;
  deleteEquipmentAssignment: Scalars['Boolean']['output'];
  deleteExperimentSafetyPdfTemplate: ExperimentSafetyPdfTemplate;
  deleteFap: Fap;
  deleteFeedback: Feedback;
  deleteGenericTemplate: GenericTemplate;
  deleteInstitution: Institution;
  deleteInstrument: Instrument;
  deleteInternalReview: InternalReview;
  deleteLostTime: LostTimeResponseWrap;
  deletePredefinedMessage: PredefinedMessage;
  deleteProposal: Proposal;
  deleteProposalPdfTemplate: ProposalPdfTemplate;
  deleteProposalScientistComment: ProposalScientistComment;
  deleteQuestion: Question;
  deleteQuestionTemplateRelation: Template;
  deleteSample: Sample;
  deleteScheduledEvents: ScheduledEventsResponseWrap;
  deleteShipment: Shipment;
  deleteStatus: Status;
  deleteTechnique: Technique;
  deleteTemplate: Template;
  deleteTopic: Template;
  deleteUnit: Unit;
  deleteUser: User;
  deleteVisit: Visit;
  deleteWorkflow: Workflow;
  deleteWorkflowStatus: Scalars['Boolean']['output'];
  externalTokenLogin: Scalars['String']['output'];
  finalizeProposalBooking: ProposalBookingResponseWrap;
  finalizeScheduledEvent: ScheduledEventResponseWrap;
  getTokenForUser: Scalars['String']['output'];
  importProposal: Proposal;
  importTemplate: Template;
  importUnits: Array<Unit>;
  logout: Scalars['String']['output'];
  mergeInstitutions: Institution;
  moveWorkflowStatus: WorkflowConnection;
  notifyProposal: Proposal;
  prepareDB: Array<Scalars['String']['output']>;
  redeemCode: RedeemCode;
  removeAssignedInstrumentFromCall: Call;
  removeCallFromTag: Scalars['Boolean']['output'];
  removeInstrumentFromTag: Scalars['Boolean']['output'];
  removeInstrumentsFromTechnique: Scalars['Boolean']['output'];
  removeMemberFromFap: Fap;
  removeMemberFromFapProposal: Fap;
  removeProposalsFromFaps: Array<FapProposal>;
  removeProposalsFromInstrument: Scalars['Boolean']['output'];
  removeSampleFromExperiment: ExperimentHasSample;
  removeScientistFromInstrument: Scalars['Boolean']['output'];
  removeScientistFromTechnique: Scalars['Boolean']['output'];
  removeUserForReview: Review;
  reopenProposalBooking: ProposalBookingResponseWrap;
  reopenScheduledEvent: ScheduledEventResponseWrap;
  reorderFapMeetingDecisionProposals: FapMeetingDecision;
  replayStatusActionsLog: Scalars['Boolean']['output'];
  replayStatusActionsLogs: ReplayStatusActionsLogsResult;
  requestFeedback: FeedbackRequest;
  requestVisitRegistrationChanges: VisitRegistration;
  resetSchedulerDb: Scalars['String']['output'];
  reviewExperimentSafety: ExperimentSafety;
  saveFapMeetingDecision: FapMeetingDecision;
  saveReviewerRank: Scalars['Boolean']['output'];
  selectRole: Scalars['String']['output'];
  setActiveTemplate: Scalars['Boolean']['output'];
  setCoProposerInvites: Array<Invite>;
  setInstrumentAvailabilityTime: Scalars['Boolean']['output'];
  setPageContent: Page;
  setUserNotPlaceholder: User;
  submitExperimentSafety: ExperimentSafety;
  submitExperimentSafetyReviewerExperimentSafetyReview: ExperimentSafety;
  submitFapMeetingDecisions: Array<FapProposal>;
  submitInstrumentInFap: Scalars['Boolean']['output'];
  submitInstrumentScientistExperimentSafetyReview: ExperimentSafety;
  submitProposal: Proposal;
  submitProposalsReview: Scalars['Boolean']['output'];
  submitSampleReview: Sample;
  submitShipment: Shipment;
  submitTechnicalReviews: Scalars['Boolean']['output'];
  submitVisitRegistration: VisitRegistration;
  token: Scalars['String']['output'];
  unsubmitInstrumentInFap: Scalars['Boolean']['output'];
  updateAnswer: Scalars['String']['output'];
  updateApiAccessToken: PermissionsWithAccessToken;
  updateCall: Call;
  updateEquipment: EquipmentResponseWrap;
  updateExperimentSafetyPdfTemplate: ExperimentSafetyPdfTemplate;
  updateExperimentSample: ExperimentHasSample;
  updateFap: Fap;
  updateFapTimeAllocation: FapProposal;
  updateFapToCallInstrument: Call;
  updateFeatures: Array<Feature>;
  updateFeedback: Feedback;
  updateGenericTemplate: GenericTemplate;
  updateInstitution: Institution;
  updateInstrument: Instrument;
  updateInternalReview: InternalReview;
  updateLostTime: LostTimeResponseWrap;
  updatePredefinedMessage: PredefinedMessage;
  updateProposal: Proposal;
  updateProposalPdfTemplate: ProposalPdfTemplate;
  updateProposalScientistComment: ProposalScientistComment;
  updateQuestion: Question;
  updateQuestionTemplateRelation: Template;
  updateQuestionTemplateRelationSettings: Template;
  updateReview: Review;
  updateSample: Sample;
  updateScheduledEvent: ScheduledEventResponseWrap;
  updateSettings: Settings;
  updateShipment: Shipment;
  updateStatus: Status;
  updateTag: Tag;
  updateTechnicalReviewAssignee: Array<TechnicalReview>;
  updateTechnique: Technique;
  updateTemplate: Template;
  updateTopic: Template;
  updateUser: User;
  updateUserByOidcSub: User;
  updateUserRoles: User;
  updateVisit: Visit;
  updateVisitRegistration: VisitRegistration;
  updateWorkflow: Workflow;
  validateTemplateImport: TemplateValidation;
  validateUnitsImport: UnitsImportWithValidation;
};


export type MutationAcceptInviteArgs = {
  code: Scalars['String']['input'];
};


export type MutationActivateProposalBookingArgs = {
  id: Scalars['Int']['input'];
};


export type MutationActivateScheduledEventsArgs = {
  activateScheduledEvents: ActivateScheduledEventsInput;
};


export type MutationAddClientLogArgs = {
  error: Scalars['String']['input'];
};


export type MutationAddConnectionStatusActionsArgs = {
  newConnectionStatusActionsInput: AddConnectionStatusActionsInput;
};


export type MutationAddLostTimeArgs = {
  addLostTimeInput: AddLostTimeInput;
};


export type MutationAddSampleToExperimentArgs = {
  experimentPk: Scalars['Int']['input'];
  sampleId: Scalars['Int']['input'];
};


export type MutationAddSamplesToShipmentArgs = {
  sampleIds: Array<Scalars['Int']['input']>;
  shipmentId: Scalars['Int']['input'];
};


export type MutationAddStatusChangingEventsToConnectionArgs = {
  addStatusChangingEventsToConnectionInput: AddStatusChangingEventsToConnectionInput;
};


export type MutationAddTechnicalReviewArgs = {
  addTechnicalReviewInput: AddTechnicalReviewInput;
};


export type MutationAddUserForReviewArgs = {
  fapID: Scalars['Int']['input'];
  proposalPk: Scalars['Int']['input'];
  userID: Scalars['Int']['input'];
};


export type MutationAddUserRoleArgs = {
  roleID: Scalars['Int']['input'];
  userID: Scalars['Int']['input'];
};


export type MutationAddWorkflowStatusArgs = {
  newWorkflowStatusInput: AddWorkflowStatusInput;
};


export type MutationAdministrationProposalArgs = {
  commentForManagement?: InputMaybe<Scalars['String']['input']>;
  commentForUser?: InputMaybe<Scalars['String']['input']>;
  finalStatus: ProposalEndStatus;
  managementDecisionSubmitted?: InputMaybe<Scalars['Boolean']['input']>;
  managementTimeAllocations: Array<ManagementTimeAllocationsInput>;
  proposalPk: Scalars['Int']['input'];
};


export type MutationAnswerTopicArgs = {
  answers: Array<AnswerInput>;
  isPartialSave?: InputMaybe<Scalars['Boolean']['input']>;
  questionaryId: Scalars['Int']['input'];
  topicId: Scalars['Int']['input'];
};


export type MutationApproveVisitRegistrationArgs = {
  visitRegistration: ApproveVisitRegistrationInput;
};


export type MutationAssignCallsToTagArgs = {
  callIds: Array<Scalars['Int']['input']>;
  tagId: Scalars['Int']['input'];
};


export type MutationAssignChairOrSecretaryArgs = {
  assignChairOrSecretaryToFapInput: AssignChairOrSecretaryToFapInput;
};


export type MutationAssignFapReviewersToProposalsArgs = {
  assignments: Array<FapReviewAssignmentInput>;
  fapId: Scalars['Int']['input'];
};


export type MutationAssignInstrumentsToCallArgs = {
  assignInstrumentsToCallInput: AssignInstrumentsToCallInput;
};


export type MutationAssignInstrumentsToTagArgs = {
  instrumentIds: Array<Scalars['Int']['input']>;
  tagId: Scalars['Int']['input'];
};


export type MutationAssignInstrumentsToTechniqueArgs = {
  instrumentIds: Array<Scalars['Int']['input']>;
  techniqueId: Scalars['Int']['input'];
};


export type MutationAssignProposalToTechniquesArgs = {
  proposalPk: Scalars['Int']['input'];
  techniqueIds: Array<Scalars['Int']['input']>;
};


export type MutationAssignProposalsToFapsArgs = {
  fapInstruments: Array<FapInstrumentInput>;
  proposalPks: Array<Scalars['Int']['input']>;
};


export type MutationAssignProposalsToInstrumentsArgs = {
  instrumentIds: Array<Scalars['Int']['input']>;
  proposalPks: Array<Scalars['Int']['input']>;
};


export type MutationAssignReviewersToFapArgs = {
  fapId: Scalars['Int']['input'];
  memberIds: Array<Scalars['Int']['input']>;
};


export type MutationAssignScientistsToInstrumentArgs = {
  instrumentId: Scalars['Int']['input'];
  scientistIds: Array<Scalars['Int']['input']>;
};


export type MutationAssignScientistsToTechniqueArgs = {
  scientistIds: Array<Scalars['Int']['input']>;
  techniqueId: Scalars['Int']['input'];
};


export type MutationAssignTechniqueProposalsToInstrumentsArgs = {
  instrumentIds: Array<Scalars['Int']['input']>;
  proposalPks: Array<Scalars['Int']['input']>;
};


export type MutationAssignToScheduledEventsArgs = {
  assignEquipmentsToScheduledEventInput: AssignEquipmentsToScheduledEventInput;
};


export type MutationCancelVisitRegistrationArgs = {
  visitRegistration: CancelVisitRegistrationInput;
};


export type MutationChangeProposalsStatusArgs = {
  changeProposalsStatusInput: ChangeProposalsStatusInput;
};


export type MutationChangeTechniqueProposalsStatusArgs = {
  changeProposalsStatusInput: ChangeProposalsStatusInput;
};


export type MutationCloneExperimentSampleArgs = {
  experimentPk: Scalars['Int']['input'];
  newSampleTitle?: InputMaybe<Scalars['String']['input']>;
  sampleId: Scalars['Int']['input'];
};


export type MutationCloneGenericTemplateArgs = {
  genericTemplateId: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCloneProposalsArgs = {
  cloneProposalsInput: CloneProposalsInput;
};


export type MutationCloneSampleArgs = {
  isPostProposalSubmission?: InputMaybe<Scalars['Boolean']['input']>;
  sampleId: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCloneTemplateArgs = {
  templateId: Scalars['Int']['input'];
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


export type MutationCreateExperimentSafetyArgs = {
  experimentPk: Scalars['Int']['input'];
};


export type MutationCreateExperimentSafetyPdfTemplateArgs = {
  dummyData: Scalars['String']['input'];
  templateData: Scalars['String']['input'];
  templateFooter: Scalars['String']['input'];
  templateHeader: Scalars['String']['input'];
  templateId: Scalars['Int']['input'];
  templateSampleDeclaration: Scalars['String']['input'];
};


export type MutationCreateFapArgs = {
  active: Scalars['Boolean']['input'];
  code: Scalars['String']['input'];
  customGradeGuide?: InputMaybe<Scalars['Boolean']['input']>;
  description: Scalars['String']['input'];
  gradeGuide?: InputMaybe<Scalars['String']['input']>;
  numberRatingsRequired?: Scalars['Int']['input'];
};


export type MutationCreateFeedbackArgs = {
  experimentPk: Scalars['Int']['input'];
};


export type MutationCreateGenericTemplateArgs = {
  proposalPk: Scalars['Int']['input'];
  questionId: Scalars['String']['input'];
  templateId: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};


export type MutationCreateGenericTemplateWithCopiedAnswersArgs = {
  copyAnswersInput: Array<CopyAnswerInput>;
  proposalPk: Scalars['Int']['input'];
  questionId: Scalars['String']['input'];
  templateId: Scalars['Int']['input'];
};


export type MutationCreateInstrumentArgs = {
  description: Scalars['String']['input'];
  managerUserId: Scalars['Int']['input'];
  multipleTechReviewsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  selectable?: InputMaybe<Scalars['Boolean']['input']>;
  shortCode: Scalars['String']['input'];
};


export type MutationCreateInternalReviewArgs = {
  createInternalReviewInput: CreateInternalReviewInput;
};


export type MutationCreatePredefinedMessageArgs = {
  createPredefinedMessageInput: CreatePredefinedMessageInput;
};


export type MutationCreateProposalArgs = {
  callId: Scalars['Int']['input'];
};


export type MutationCreateProposalPdfTemplateArgs = {
  dummyData: Scalars['String']['input'];
  templateData: Scalars['String']['input'];
  templateFooter: Scalars['String']['input'];
  templateHeader: Scalars['String']['input'];
  templateId: Scalars['Int']['input'];
  templateSampleDeclaration: Scalars['String']['input'];
};


export type MutationCreateProposalScientistCommentArgs = {
  comment: Scalars['String']['input'];
  proposalPk: Scalars['Int']['input'];
};


export type MutationCreateQuestionArgs = {
  categoryId: TemplateCategoryId;
  dataType: DataType;
};


export type MutationCreateQuestionTemplateRelationArgs = {
  questionId: Scalars['String']['input'];
  sortOrder: Scalars['Int']['input'];
  templateId: Scalars['Int']['input'];
  topicId: Scalars['Int']['input'];
};


export type MutationCreateQuestionaryArgs = {
  templateId: Scalars['Int']['input'];
};


export type MutationCreateSampleArgs = {
  isPostProposalSubmission?: InputMaybe<Scalars['Boolean']['input']>;
  proposalPk: Scalars['Int']['input'];
  questionId: Scalars['String']['input'];
  templateId: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};


export type MutationCreateScheduledEventArgs = {
  newScheduledEvent: NewScheduledEventInput;
};


export type MutationCreateShipmentArgs = {
  experimentPk: Scalars['Int']['input'];
  proposalPk: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};


export type MutationCreateStatusArgs = {
  newStatusInput: CreateStatusInput;
};


export type MutationCreateTagArgs = {
  name: Scalars['String']['input'];
  shortCode: Scalars['String']['input'];
};


export type MutationCreateTechniqueArgs = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  shortCode: Scalars['String']['input'];
};


export type MutationCreateTemplateArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  groupId: TemplateGroupId;
  name: Scalars['String']['input'];
};


export type MutationCreateTopicArgs = {
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  templateId: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationCreateUnitArgs = {
  id: Scalars['String']['input'];
  quantity: Scalars['String']['input'];
  siConversionFormula: Scalars['String']['input'];
  symbol: Scalars['String']['input'];
  unit: Scalars['String']['input'];
};


export type MutationCreateUserByEmailInviteArgs = {
  email: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  userRole: UserRole;
};


export type MutationCreateVisitArgs = {
  experimentPk: Scalars['Int']['input'];
  team: Array<Scalars['Int']['input']>;
  teamLeadUserId: Scalars['Int']['input'];
};


export type MutationCreateVisitRegistrationArgs = {
  userId: Scalars['Int']['input'];
  visitId: Scalars['Int']['input'];
};


export type MutationCreateWorkflowArgs = {
  newWorkflowInput: CreateWorkflowInput;
};


export type MutationDeleteApiAccessTokenArgs = {
  deleteApiAccessTokenInput: DeleteApiAccessTokenInput;
};


export type MutationDeleteCallArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteEquipmentAssignmentArgs = {
  deleteEquipmentAssignmentInput: DeleteEquipmentAssignmentInput;
};


export type MutationDeleteExperimentSafetyPdfTemplateArgs = {
  experimentSafetyPdfTemplateId: Scalars['Int']['input'];
};


export type MutationDeleteFapArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteFeedbackArgs = {
  feedbackId: Scalars['Int']['input'];
};


export type MutationDeleteGenericTemplateArgs = {
  genericTemplateId: Scalars['Int']['input'];
};


export type MutationDeleteInstitutionArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteInstrumentArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteInternalReviewArgs = {
  deleteInternalReviewInput: DeleteInternalReviewInput;
};


export type MutationDeleteLostTimeArgs = {
  deleteLostTimeInput: DeleteLostTimeInput;
};


export type MutationDeletePredefinedMessageArgs = {
  deletePredefinedMessageInput: DeletePredefinedMessageInput;
};


export type MutationDeleteProposalArgs = {
  proposalPk: Scalars['Int']['input'];
};


export type MutationDeleteProposalPdfTemplateArgs = {
  proposalPdfTemplateId: Scalars['Int']['input'];
};


export type MutationDeleteProposalScientistCommentArgs = {
  commentId: Scalars['Int']['input'];
};


export type MutationDeleteQuestionArgs = {
  questionId: Scalars['String']['input'];
};


export type MutationDeleteQuestionTemplateRelationArgs = {
  questionId: Scalars['String']['input'];
  templateId: Scalars['Int']['input'];
};


export type MutationDeleteSampleArgs = {
  sampleId: Scalars['Int']['input'];
};


export type MutationDeleteScheduledEventsArgs = {
  deleteScheduledEventsInput: DeleteScheduledEventsInput;
};


export type MutationDeleteShipmentArgs = {
  shipmentId: Scalars['Int']['input'];
};


export type MutationDeleteStatusArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteTechniqueArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteTemplateArgs = {
  templateId: Scalars['Int']['input'];
};


export type MutationDeleteTopicArgs = {
  topicId: Scalars['Int']['input'];
};


export type MutationDeleteUnitArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteVisitArgs = {
  visitId: Scalars['Int']['input'];
};


export type MutationDeleteWorkflowArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteWorkflowStatusArgs = {
  deleteWorkflowStatusInput: DeleteWorkflowStatusInput;
};


export type MutationExternalTokenLoginArgs = {
  externalToken: Scalars['String']['input'];
  iss?: InputMaybe<Scalars['String']['input']>;
  redirectUri: Scalars['String']['input'];
};


export type MutationFinalizeProposalBookingArgs = {
  action: ProposalBookingFinalizeAction;
  id: Scalars['Int']['input'];
};


export type MutationFinalizeScheduledEventArgs = {
  finalizeScheduledEvent: FinalizeScheduledEventInput;
};


export type MutationGetTokenForUserArgs = {
  userId: Scalars['Int']['input'];
};


export type MutationImportProposalArgs = {
  abstract?: InputMaybe<Scalars['String']['input']>;
  callId: Scalars['Int']['input'];
  created?: InputMaybe<Scalars['DateTime']['input']>;
  instrumentId?: InputMaybe<Scalars['Int']['input']>;
  proposerId?: InputMaybe<Scalars['Int']['input']>;
  referenceNumber: Scalars['Int']['input'];
  submittedDate: Scalars['DateTime']['input'];
  submitterId: Scalars['Int']['input'];
  techniqueIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  users?: InputMaybe<Array<Scalars['Int']['input']>>;
};


export type MutationImportTemplateArgs = {
  conflictResolutions: Array<ConflictResolution>;
  subTemplatesConflictResolutions: Array<Array<ConflictResolution>>;
  templateAsJson: Scalars['String']['input'];
};


export type MutationImportUnitsArgs = {
  conflictResolutions: Array<ConflictResolution>;
  json: Scalars['String']['input'];
};


export type MutationLogoutArgs = {
  token: Scalars['String']['input'];
};


export type MutationMergeInstitutionsArgs = {
  institutionIdFrom: Scalars['Int']['input'];
  institutionIdInto: Scalars['Int']['input'];
  newTitle: Scalars['String']['input'];
};


export type MutationMoveWorkflowStatusArgs = {
  moveWorkflowStatusInput: MoveWorkflowStatusInput;
};


export type MutationNotifyProposalArgs = {
  proposalPk: Scalars['Int']['input'];
};


export type MutationPrepareDbArgs = {
  includeSeeds?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationRedeemCodeArgs = {
  code: Scalars['String']['input'];
};


export type MutationRemoveAssignedInstrumentFromCallArgs = {
  removeAssignedInstrumentFromCallInput: RemoveAssignedInstrumentFromCallInput;
};


export type MutationRemoveCallFromTagArgs = {
  callId: Scalars['Int']['input'];
  tagId: Scalars['Int']['input'];
};


export type MutationRemoveInstrumentFromTagArgs = {
  instrumentId: Scalars['Int']['input'];
  tagId: Scalars['Int']['input'];
};


export type MutationRemoveInstrumentsFromTechniqueArgs = {
  instrumentIds: Array<Scalars['Int']['input']>;
  techniqueId: Scalars['Int']['input'];
};


export type MutationRemoveMemberFromFapArgs = {
  fapId: Scalars['Int']['input'];
  memberId: Scalars['Int']['input'];
  roleId: UserRole;
};


export type MutationRemoveMemberFromFapProposalArgs = {
  fapId: Scalars['Int']['input'];
  memberId: Scalars['Int']['input'];
  proposalPk: Scalars['Int']['input'];
};


export type MutationRemoveProposalsFromFapsArgs = {
  fapIds: Array<Scalars['Int']['input']>;
  proposalPks: Array<Scalars['Int']['input']>;
};


export type MutationRemoveProposalsFromInstrumentArgs = {
  proposalPks: Array<Scalars['Int']['input']>;
};


export type MutationRemoveSampleFromExperimentArgs = {
  experimentPk: Scalars['Int']['input'];
  sampleId: Scalars['Int']['input'];
};


export type MutationRemoveScientistFromInstrumentArgs = {
  instrumentId: Scalars['Int']['input'];
  scientistId: Scalars['Int']['input'];
};


export type MutationRemoveScientistFromTechniqueArgs = {
  scientistId: Scalars['Int']['input'];
  techniqueId: Scalars['Int']['input'];
};


export type MutationRemoveUserForReviewArgs = {
  fapId: Scalars['Int']['input'];
  reviewId: Scalars['Int']['input'];
};


export type MutationReopenProposalBookingArgs = {
  id: Scalars['Int']['input'];
};


export type MutationReopenScheduledEventArgs = {
  id: Scalars['Int']['input'];
};


export type MutationReorderFapMeetingDecisionProposalsArgs = {
  reorderFapMeetingDecisionProposalsInput: ReorderFapMeetingDecisionProposalsInput;
};


export type MutationReplayStatusActionsLogArgs = {
  statusActionsLogId: Scalars['Int']['input'];
};


export type MutationReplayStatusActionsLogsArgs = {
  statusActionsLogIds: Array<Scalars['Int']['input']>;
};


export type MutationRequestFeedbackArgs = {
  experimentPk: Scalars['Int']['input'];
};


export type MutationRequestVisitRegistrationChangesArgs = {
  visitRegistration: RequestVisitRegistrationChangesInput;
};


export type MutationResetSchedulerDbArgs = {
  includeSeeds?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationReviewExperimentSafetyArgs = {
  experimentSafetyPk: Scalars['Int']['input'];
  isSubmitted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationSaveFapMeetingDecisionArgs = {
  saveFapMeetingDecisionInput: SaveFapMeetingDecisionInput;
};


export type MutationSaveReviewerRankArgs = {
  fapReviewId: Scalars['Int']['input'];
  rank: Scalars['Int']['input'];
  reviewerId: Scalars['Int']['input'];
};


export type MutationSelectRoleArgs = {
  selectedRoleId?: InputMaybe<Scalars['Int']['input']>;
  token: Scalars['String']['input'];
};


export type MutationSetActiveTemplateArgs = {
  templateGroupId: TemplateGroupId;
  templateId: Scalars['Int']['input'];
};


export type MutationSetCoProposerInvitesArgs = {
  input: SetCoProposerInvitesInput;
};


export type MutationSetInstrumentAvailabilityTimeArgs = {
  availabilityTime: Scalars['Int']['input'];
  callId: Scalars['Int']['input'];
  instrumentId: Scalars['Int']['input'];
};


export type MutationSetPageContentArgs = {
  id: PageName;
  text: Scalars['String']['input'];
};


export type MutationSetUserNotPlaceholderArgs = {
  id: Scalars['Int']['input'];
};


export type MutationSubmitExperimentSafetyArgs = {
  experimentSafetyPk: Scalars['Int']['input'];
  isSubmitted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationSubmitExperimentSafetyReviewerExperimentSafetyReviewArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  decision?: InputMaybe<ExperimentSafetyReviewerDecisionEnum>;
  experimentSafetyPk: Scalars['Int']['input'];
};


export type MutationSubmitFapMeetingDecisionsArgs = {
  SubmitFapMeetingDecisionsInput: SubmitFapMeetingDecisionsInput;
};


export type MutationSubmitInstrumentInFapArgs = {
  callId: Scalars['Int']['input'];
  fapId: Scalars['Int']['input'];
  instrumentId: Scalars['Int']['input'];
};


export type MutationSubmitInstrumentScientistExperimentSafetyReviewArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  decision?: InputMaybe<InstrumentScientistDecisionEnum>;
  experimentSafetyPk: Scalars['Int']['input'];
};


export type MutationSubmitProposalArgs = {
  proposalPk: Scalars['Int']['input'];
};


export type MutationSubmitProposalsReviewArgs = {
  submitProposalsReviewInput: SubmitProposalsReviewInput;
};


export type MutationSubmitSampleReviewArgs = {
  safetyComment?: InputMaybe<Scalars['String']['input']>;
  safetyStatus: SampleStatus;
  sampleId: Scalars['Int']['input'];
};


export type MutationSubmitShipmentArgs = {
  shipmentId: Scalars['Int']['input'];
};


export type MutationSubmitTechnicalReviewsArgs = {
  submitTechnicalReviewsInput: SubmitTechnicalReviewsInput;
};


export type MutationSubmitVisitRegistrationArgs = {
  userId: Scalars['Int']['input'];
  visitId: Scalars['Int']['input'];
};


export type MutationTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationUnsubmitInstrumentInFapArgs = {
  callId: Scalars['Int']['input'];
  fapId: Scalars['Int']['input'];
  instrumentId: Scalars['Int']['input'];
};


export type MutationUpdateAnswerArgs = {
  answer: AnswerInput;
  questionaryId: Scalars['Int']['input'];
};


export type MutationUpdateApiAccessTokenArgs = {
  updateApiAccessTokenInput: UpdateApiAccessTokenInput;
};


export type MutationUpdateCallArgs = {
  updateCallInput: UpdateCallInput;
};


export type MutationUpdateEquipmentArgs = {
  id: Scalars['Int']['input'];
  updateEquipmentInput: EquipmentInput;
};


export type MutationUpdateExperimentSafetyPdfTemplateArgs = {
  dummyData?: InputMaybe<Scalars['String']['input']>;
  experimentSafetyPdfTemplateId: Scalars['Int']['input'];
  templateData?: InputMaybe<Scalars['String']['input']>;
  templateFooter?: InputMaybe<Scalars['String']['input']>;
  templateHeader?: InputMaybe<Scalars['String']['input']>;
  templateSampleDeclaration?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateExperimentSampleArgs = {
  experimentPk: Scalars['Int']['input'];
  isSubmitted?: InputMaybe<Scalars['Boolean']['input']>;
  sampleId: Scalars['Int']['input'];
};


export type MutationUpdateFapArgs = {
  active: Scalars['Boolean']['input'];
  code: Scalars['String']['input'];
  customGradeGuide?: InputMaybe<Scalars['Boolean']['input']>;
  description: Scalars['String']['input'];
  files?: InputMaybe<Scalars['String']['input']>;
  gradeGuide?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  numberRatingsRequired?: Scalars['Int']['input'];
};


export type MutationUpdateFapTimeAllocationArgs = {
  fapId: Scalars['Int']['input'];
  fapTimeAllocation?: InputMaybe<Scalars['Int']['input']>;
  instrumentId: Scalars['Int']['input'];
  proposalPk: Scalars['Int']['input'];
};


export type MutationUpdateFapToCallInstrumentArgs = {
  updateFapToCallInstrumentInput: UpdateFapToCallInstrumentInput;
};


export type MutationUpdateFeaturesArgs = {
  updatedFeaturesInput: UpdateFeaturesInput;
};


export type MutationUpdateFeedbackArgs = {
  feedbackId: Scalars['Int']['input'];
  status?: InputMaybe<FeedbackStatus>;
};


export type MutationUpdateGenericTemplateArgs = {
  genericTemplateId: Scalars['Int']['input'];
  safetyComment?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateInstitutionArgs = {
  country: Scalars['Int']['input'];
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  rorId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateInstrumentArgs = {
  description: Scalars['String']['input'];
  id: Scalars['Int']['input'];
  managerUserId: Scalars['Int']['input'];
  multipleTechReviewsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  selectable?: InputMaybe<Scalars['Boolean']['input']>;
  shortCode: Scalars['String']['input'];
  updateTechReview: Scalars['Boolean']['input'];
};


export type MutationUpdateInternalReviewArgs = {
  updateInternalReviewInput: UpdateInternalReviewInput;
};


export type MutationUpdateLostTimeArgs = {
  updateLostTimeInput: UpdateLostTimeInput;
};


export type MutationUpdatePredefinedMessageArgs = {
  updatePredefinedMessageInput: UpdatePredefinedMessageInput;
};


export type MutationUpdateProposalArgs = {
  abstract?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  proposalPk: Scalars['Int']['input'];
  proposerId?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  users?: InputMaybe<Array<Scalars['Int']['input']>>;
};


export type MutationUpdateProposalPdfTemplateArgs = {
  dummyData?: InputMaybe<Scalars['String']['input']>;
  proposalPdfTemplateId: Scalars['Int']['input'];
  templateData?: InputMaybe<Scalars['String']['input']>;
  templateFooter?: InputMaybe<Scalars['String']['input']>;
  templateHeader?: InputMaybe<Scalars['String']['input']>;
  templateSampleDeclaration?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateProposalScientistCommentArgs = {
  comment: Scalars['String']['input'];
  commentId: Scalars['Int']['input'];
};


export type MutationUpdateQuestionArgs = {
  config?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  naturalKey?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateQuestionTemplateRelationArgs = {
  config?: InputMaybe<Scalars['String']['input']>;
  questionId: Scalars['String']['input'];
  sortOrder: Scalars['Int']['input'];
  templateId: Scalars['Int']['input'];
  topicId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateQuestionTemplateRelationSettingsArgs = {
  config?: InputMaybe<Scalars['String']['input']>;
  dependencies: Array<FieldDependencyInput>;
  dependenciesOperator?: InputMaybe<DependenciesLogicOperator>;
  questionId: Scalars['String']['input'];
  templateId: Scalars['Int']['input'];
};


export type MutationUpdateReviewArgs = {
  comment: Scalars['String']['input'];
  fapID: Scalars['Int']['input'];
  grade: Scalars['Float']['input'];
  questionaryID: Scalars['Int']['input'];
  reviewID: Scalars['Int']['input'];
  status: ReviewStatus;
};


export type MutationUpdateSampleArgs = {
  sampleId: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateScheduledEventArgs = {
  updateScheduledEvent: UpdateScheduledEventInput;
};


export type MutationUpdateSettingsArgs = {
  updatedSettingsInput: UpdateSettingsInput;
};


export type MutationUpdateShipmentArgs = {
  externalRef?: InputMaybe<Scalars['String']['input']>;
  proposalPk?: InputMaybe<Scalars['Int']['input']>;
  shipmentId: Scalars['Int']['input'];
  status?: InputMaybe<ShipmentStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateStatusArgs = {
  updatedStatusInput: UpdateStatusInput;
};


export type MutationUpdateTagArgs = {
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  shortCode: Scalars['String']['input'];
};


export type MutationUpdateTechnicalReviewAssigneeArgs = {
  instrumentId: Scalars['Int']['input'];
  proposalPks: Array<Scalars['Int']['input']>;
  userId: Scalars['Int']['input'];
};


export type MutationUpdateTechniqueArgs = {
  description: Scalars['String']['input'];
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  shortCode: Scalars['String']['input'];
};


export type MutationUpdateTemplateArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  templateId: Scalars['Int']['input'];
};


export type MutationUpdateTopicArgs = {
  id: Scalars['Int']['input'];
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  templateId?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateUserArgs = {
  birthdate?: InputMaybe<Scalars['DateTime']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  institutionId?: InputMaybe<Scalars['Int']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  placeholder?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['String']['input']>;
  preferredname?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<Scalars['Int']['input']>>;
  telephone?: InputMaybe<Scalars['String']['input']>;
  user_title?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateUserByOidcSubArgs = {
  birthdate?: InputMaybe<Scalars['DateTime']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  institutionId?: InputMaybe<Scalars['Int']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  oidcSub: Scalars['String']['input'];
  placeholder?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['String']['input']>;
  preferredname?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<Scalars['Int']['input']>>;
  telephone?: InputMaybe<Scalars['String']['input']>;
  user_title?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateUserRolesArgs = {
  id: Scalars['Int']['input'];
  roles?: InputMaybe<Array<Scalars['Int']['input']>>;
};


export type MutationUpdateVisitArgs = {
  team?: InputMaybe<Array<Scalars['Int']['input']>>;
  teamLeadUserId?: InputMaybe<Scalars['Int']['input']>;
  visitId: Scalars['Int']['input'];
};


export type MutationUpdateVisitRegistrationArgs = {
  endsAt?: InputMaybe<Scalars['DateTime']['input']>;
  startsAt?: InputMaybe<Scalars['DateTime']['input']>;
  userId: Scalars['Int']['input'];
  visitId: Scalars['Int']['input'];
};


export type MutationUpdateWorkflowArgs = {
  updatedWorkflowInput: UpdateWorkflowInput;
};


export type MutationValidateTemplateImportArgs = {
  templateAsJson: Scalars['String']['input'];
};


export type MutationValidateUnitsImportArgs = {
  unitsAsJson: Scalars['String']['input'];
};

export type NewScheduledEventInput = {
  bookingType: ScheduledEventBookingType;
  description?: InputMaybe<Scalars['String']['input']>;
  endsAt: Scalars['TzLessDateTime']['input'];
  instrumentId: Scalars['Int']['input'];
  proposalBookingId?: InputMaybe<Scalars['Int']['input']>;
  startsAt: Scalars['TzLessDateTime']['input'];
};

export type NumberInputConfig = {
  numberValueConstraint: Maybe<NumberValueConstraint>;
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  tooltip: Scalars['String']['output'];
  units: Array<Unit>;
};

export enum NumberValueConstraint {
  NONE = 'NONE',
  ONLY_NEGATIVE = 'ONLY_NEGATIVE',
  ONLY_NEGATIVE_INTEGER = 'ONLY_NEGATIVE_INTEGER',
  ONLY_POSITIVE = 'ONLY_POSITIVE',
  ONLY_POSITIVE_INTEGER = 'ONLY_POSITIVE_INTEGER'
}

export type Page = {
  content: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
};

export enum PageName {
  COOKIEPAGE = 'COOKIEPAGE',
  FOOTERCONTENT = 'FOOTERCONTENT',
  GRADEGUIDEPAGE = 'GRADEGUIDEPAGE',
  HELPPAGE = 'HELPPAGE',
  HOMEPAGE = 'HOMEPAGE',
  LOGINHELPPAGE = 'LOGINHELPPAGE',
  PRIVACYPAGE = 'PRIVACYPAGE',
  REVIEWPAGE = 'REVIEWPAGE',
  TECHNIQUEPROPOSALMANAGEMENTPAGE = 'TECHNIQUEPROPOSALMANAGEMENTPAGE'
}

export type PermissionsWithAccessToken = {
  accessPermissions: Scalars['String']['output'];
  accessToken: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type PredefinedMessage = {
  dateModified: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  lastModifiedBy: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  modifiedBy: BasicUserDetails;
  title: Scalars['String']['output'];
};

export type PredefinedMessagesFilter = {
  key?: InputMaybe<Scalars['String']['input']>;
};

export type Proposal = {
  abstract: Scalars['String']['output'];
  attachments: Maybe<ProposalAttachments>;
  call: Maybe<Call>;
  callId: Scalars['Int']['output'];
  coProposerInvites: Array<Invite>;
  commentForManagement: Maybe<Scalars['String']['output']>;
  commentForUser: Maybe<Scalars['String']['output']>;
  created: Scalars['DateTime']['output'];
  experimentSequence: Maybe<Scalars['Int']['output']>;
  experiments: Maybe<Array<Experiment>>;
  fapMeetingDecisions: Maybe<Array<FapMeetingDecision>>;
  faps: Maybe<Array<Fap>>;
  fileId: Maybe<Scalars['String']['output']>;
  finalStatus: Maybe<ProposalEndStatus>;
  genericTemplates: Maybe<Array<GenericTemplate>>;
  instruments: Maybe<Array<Maybe<InstrumentWithManagementTime>>>;
  managementDecisionSubmitted: Scalars['Boolean']['output'];
  notified: Scalars['Boolean']['output'];
  primaryKey: Scalars['Int']['output'];
  proposalBooking: Maybe<ProposalBooking>;
  proposalId: Scalars['String']['output'];
  proposer: Maybe<BasicUserDetails>;
  proposerId: Scalars['Int']['output'];
  publicStatus: ProposalPublicStatus;
  questionary: Questionary;
  questionaryId: Scalars['Int']['output'];
  reviews: Maybe<Array<Review>>;
  samples: Maybe<Array<Sample>>;
  status: Maybe<Status>;
  statusId: Scalars['Int']['output'];
  submitted: Scalars['Boolean']['output'];
  submittedDate: Maybe<Scalars['DateTime']['output']>;
  technicalReviews: Array<TechnicalReview>;
  techniques: Maybe<Array<Maybe<Technique>>>;
  title: Scalars['String']['output'];
  updated: Scalars['DateTime']['output'];
  users: Array<BasicUserDetails>;
  visits: Maybe<Array<Visit>>;
};


export type ProposalFapMeetingDecisionsArgs = {
  fapId?: InputMaybe<Scalars['Int']['input']>;
};


export type ProposalProposalBookingArgs = {
  filter?: InputMaybe<ProposalProposalBookingFilter>;
};


export type ProposalReviewsArgs = {
  fapId?: InputMaybe<Scalars['Int']['input']>;
};

export type ProposalAttachments = {
  questions: Maybe<Array<Question>>;
};

export type ProposalBasisConfig = {
  readPermissions: Array<Scalars['String']['output']>;
  tooltip: Scalars['String']['output'];
};

export type ProposalBooking = {
  allocatedTime: Scalars['Int']['output'];
  call: Maybe<Call>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instrument: Maybe<Instrument>;
  proposal: Maybe<Proposal>;
  scheduledEvents: Array<ScheduledEvent>;
  status: ProposalBookingStatusCore;
  updatedAt: Scalars['DateTime']['output'];
};


export type ProposalBookingScheduledEventsArgs = {
  filter: ProposalBookingScheduledEventFilter;
};

export enum ProposalBookingFinalizeAction {
  COMPLETE = 'COMPLETE',
  RESTART = 'RESTART'
}

export type ProposalBookingResponseWrap = {
  error: Maybe<Scalars['String']['output']>;
  proposalBooking: Maybe<ProposalBooking>;
};

export type ProposalBookingScheduledEventFilter = {
  bookingType?: InputMaybe<ScheduledEventBookingType>;
  endsAfter?: InputMaybe<Scalars['TzLessDateTime']['input']>;
  endsBefore?: InputMaybe<Scalars['TzLessDateTime']['input']>;
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
  readPermissions: Array<Scalars['String']['output']>;
  tooltip: Scalars['String']['output'];
};

export type ProposalPdfTemplate = {
  created: Scalars['DateTime']['output'];
  creatorId: Scalars['Int']['output'];
  dummyData: Scalars['String']['output'];
  proposalPdfTemplateId: Scalars['Int']['output'];
  templateData: Scalars['String']['output'];
  templateFooter: Scalars['String']['output'];
  templateHeader: Scalars['String']['output'];
  templateId: Scalars['Int']['output'];
  templateSampleDeclaration: Scalars['String']['output'];
};

export type ProposalPdfTemplatesFilter = {
  creatorId?: InputMaybe<Scalars['Int']['input']>;
  dummyData?: InputMaybe<Scalars['String']['input']>;
  pdfTemplateData?: InputMaybe<Scalars['String']['input']>;
  pdfTemplateFooter?: InputMaybe<Scalars['String']['input']>;
  pdfTemplateHeader?: InputMaybe<Scalars['String']['input']>;
  pdfTemplateSampleDeclaration?: InputMaybe<Scalars['String']['input']>;
  proposalPdfTemplateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  templateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type ProposalPkWithRankOrder = {
  fapId: Scalars['Int']['input'];
  instrumentId: Scalars['Int']['input'];
  proposalPk: Scalars['Int']['input'];
  rankOrder: Scalars['Int']['input'];
};

export type ProposalPkWithReviewId = {
  proposalPk: Scalars['Int']['input'];
  reviewId: Scalars['Int']['input'];
};

export type ProposalProposalBookingFilter = {
  status?: InputMaybe<Array<ProposalBookingStatusCore>>;
};

export enum ProposalPublicStatus {
  ACCEPTED = 'accepted',
  DRAFT = 'draft',
  REJECTED = 'rejected',
  RESERVED = 'reserved',
  SUBMITTED = 'submitted',
  UNKNOWN = 'unknown'
}

export type ProposalScientistComment = {
  comment: Scalars['String']['output'];
  commentId: Scalars['Int']['output'];
  proposalPk: Scalars['Int']['output'];
};

export type ProposalTemplate = {
  callCount: Scalars['Int']['output'];
  complementaryQuestions: Array<Question>;
  description: Maybe<Scalars['String']['output']>;
  experimentSafetyPdfCallCount: Maybe<Scalars['Int']['output']>;
  experimentSafetyPdfTemplate: Maybe<ExperimentSafetyPdfTemplate>;
  group: TemplateGroup;
  groupId: TemplateGroupId;
  isArchived: Scalars['Boolean']['output'];
  json: Scalars['String']['output'];
  name: Scalars['String']['output'];
  proposalESICallCount: Maybe<Scalars['Int']['output']>;
  proposalPdfCallCount: Maybe<Scalars['Int']['output']>;
  proposalPdfTemplate: Maybe<ProposalPdfTemplate>;
  questionaryCount: Scalars['Int']['output'];
  steps: Array<TemplateStep>;
  templateId: Scalars['Int']['output'];
};

export type ProposalTemplatesFilter = {
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  templateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type ProposalView = {
  allocationTimeUnit: AllocationTimeUnits;
  callId: Scalars['Int']['output'];
  callShortCode: Maybe<Scalars['String']['output']>;
  fapInstruments: Maybe<Array<FapInstrument>>;
  faps: Maybe<Array<ProposalViewFap>>;
  finalStatus: Maybe<ProposalEndStatus>;
  instruments: Maybe<Array<ProposalViewInstrument>>;
  notified: Scalars['Boolean']['output'];
  primaryKey: Scalars['Int']['output'];
  principalInvestigator: Maybe<User>;
  principalInvestigatorId: Scalars['Int']['output'];
  proposalId: Scalars['String']['output'];
  statusDescription: Scalars['String']['output'];
  statusId: Scalars['Int']['output'];
  statusName: Scalars['String']['output'];
  submitted: Scalars['Boolean']['output'];
  submittedDate: Maybe<Scalars['DateTime']['output']>;
  technicalReviews: Maybe<Array<ProposalViewTechnicalReview>>;
  techniques: Maybe<Array<ProposalViewTechnique>>;
  title: Scalars['String']['output'];
  workflowId: Scalars['Int']['output'];
};

export type ProposalViewFap = {
  code: Scalars['String']['output'];
  id: Scalars['Int']['output'];
};

export type ProposalViewInstrument = {
  id: Scalars['Int']['output'];
  managementTimeAllocation: Maybe<Scalars['Int']['output']>;
  managerUserId: Scalars['Int']['output'];
  multipleTechReviewsEnabled: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
};

export type ProposalViewTechnicalReview = {
  id: Scalars['Int']['output'];
  instrumentId: Maybe<Scalars['Int']['output']>;
  status: Maybe<TechnicalReviewStatus>;
  submitted: Scalars['Boolean']['output'];
  technicalReviewAssignee: Maybe<ProposalViewTechnicalReviewAssignee>;
  timeAllocation: Maybe<Scalars['Int']['output']>;
};

export type ProposalViewTechnicalReviewAssignee = {
  firstname: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  lastname: Scalars['String']['output'];
};

export type ProposalViewTechnique = {
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  shortCode: Scalars['String']['output'];
};

export type ProposalsFilter = {
  callId?: InputMaybe<Scalars['Int']['input']>;
  dateFilter?: InputMaybe<DateFilterInput>;
  excludeProposalStatusIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  instrumentFilter?: InputMaybe<InstrumentFilterInput>;
  instrumentId?: InputMaybe<Scalars['Int']['input']>;
  proposalStatusId?: InputMaybe<Scalars['Int']['input']>;
  questionFilter?: InputMaybe<QuestionFilterInput>;
  questionaryIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  referenceNumbers?: InputMaybe<Array<Scalars['String']['input']>>;
  reviewer?: InputMaybe<ReviewerFilter>;
  shortCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  techniqueFilter?: InputMaybe<TechniqueFilterInput>;
  templateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type ProposalsQueryResult = {
  proposals: Array<Proposal>;
  totalCount: Scalars['Int']['output'];
};

export type ProposalsViewQueryResult = {
  proposalViews: Array<ProposalView>;
  totalCount: Scalars['Int']['output'];
};

export type ProposalsViewResult = {
  proposals: Array<ProposalView>;
  totalCount: Scalars['Int']['output'];
};

export type Quantity = {
  id: Scalars['String']['output'];
};

export type QueriesAndMutations = {
  mutations: Array<Scalars['String']['output']>;
  queries: Array<Scalars['String']['output']>;
};

export type QueriesMutationsAndServices = {
  mutations: Array<QueryMutationAndServicesGroup>;
  queries: Array<QueryMutationAndServicesGroup>;
  services: Array<QueryMutationAndServicesGroup>;
};

export type Query = {
  accessTokenAndPermissions: Maybe<PermissionsWithAccessToken>;
  activeTemplateId: Maybe<Scalars['Int']['output']>;
  allAccessTokensAndPermissions: Maybe<Array<PermissionsWithAccessToken>>;
  allExperiments: Maybe<ExperimentsQueryResult>;
  allQuestions: AllQuestionsQueryResult;
  availableEquipments: Array<Equipment>;
  basicUserDetails: Maybe<BasicUserDetails>;
  basicUserDetailsByEmail: Maybe<BasicUserDetails>;
  blankQuestionary: Questionary;
  blankQuestionarySteps: Maybe<Array<QuestionaryStep>>;
  blankQuestionaryStepsByCallId: Maybe<Array<QuestionaryStep>>;
  call: Maybe<Call>;
  calls: Maybe<Array<Call>>;
  callsByInstrumentScientist: Maybe<Array<Call>>;
  checkEmailExist: Maybe<Scalars['Boolean']['output']>;
  checkExternalToken: ExternalTokenResult;
  checkToken: TokenResult;
  countries: Maybe<Array<Entry>>;
  dataAccessUsers: Array<BasicUserDetails>;
  equipment: Maybe<Equipment>;
  equipments: Array<Equipment>;
  eventLogs: Maybe<Array<EventLog>>;
  events: Maybe<Array<WorkflowEvent>>;
  experiment: Experiment;
  experimentSafety: Maybe<ExperimentSafety>;
  experimentSafetyPdfTemplate: Maybe<ExperimentSafetyPdfTemplate>;
  experimentSafetyPdfTemplates: Maybe<Array<ExperimentSafetyPdfTemplate>>;
  experimentSample: Maybe<ExperimentHasSample>;
  factoryVersion: Scalars['String']['output'];
  fap: Maybe<Fap>;
  fapMembers: Maybe<Array<FapReviewer>>;
  fapProposal: Maybe<FapProposal>;
  fapProposals: Maybe<Array<FapProposal>>;
  fapProposalsByInstrument: Maybe<Array<FapProposal>>;
  fapReviewTemplates: Maybe<Array<FapReviewTemplate>>;
  fapReviewers: Maybe<Array<FapReviewer>>;
  faps: Maybe<FapsQueryResult>;
  features: Array<Feature>;
  feedback: Maybe<Feedback>;
  feedbacks: Array<Feedback>;
  fileMetadata: Maybe<FileMetadata>;
  filesMetadata: Array<FileMetadata>;
  genericTemplate: Maybe<GenericTemplate>;
  genericTemplates: Maybe<Array<GenericTemplate>>;
  genericTemplatesOnCopy: Maybe<Array<GenericTemplate>>;
  getCallByAnswerId: Maybe<Call>;
  getDynamicMultipleChoiceOptions: Maybe<Array<Scalars['String']['output']>>;
  healthCheck: HealthStats;
  institutions: Maybe<Array<Institution>>;
  instrument: Maybe<Instrument>;
  instrumentProposalBookings: Array<ProposalBooking>;
  instrumentScientistHasAccess: Maybe<Scalars['Boolean']['output']>;
  instrumentScientistHasInstrument: Maybe<Scalars['Boolean']['output']>;
  instrumentScientistProposals: Maybe<ProposalsViewResult>;
  instruments: Maybe<InstrumentsQueryResult>;
  instrumentsByFap: Maybe<Array<InstrumentWithAvailabilityTime>>;
  instrumentsByIds: Maybe<Array<InstrumentWithAvailabilityTime>>;
  internalReview: Maybe<InternalReview>;
  internalReviews: Maybe<Array<InternalReview>>;
  isNaturalKeyPresent: Maybe<Scalars['Boolean']['output']>;
  me: Maybe<User>;
  myShipments: Maybe<Array<Shipment>>;
  myVisits: Array<Visit>;
  pageContent: Maybe<Scalars['String']['output']>;
  predefinedMessage: Maybe<PredefinedMessage>;
  predefinedMessages: Array<PredefinedMessage>;
  previousCollaborators: Maybe<UserQueryResult>;
  proposal: Maybe<Proposal>;
  proposalBooking: Maybe<ProposalBooking>;
  proposalBookingLostTimes: Array<LostTime>;
  proposalBookingScheduledEvent: Maybe<ScheduledEvent>;
  proposalBookingScheduledEvents: Array<ScheduledEvent>;
  proposalById: Maybe<Proposal>;
  proposalPdfTemplate: Maybe<ProposalPdfTemplate>;
  proposalPdfTemplates: Maybe<Array<ProposalPdfTemplate>>;
  proposalReviews: Maybe<Array<Review>>;
  proposalScientistComment: Maybe<ProposalScientistComment>;
  proposalTemplates: Maybe<Array<ProposalTemplate>>;
  proposals: Maybe<ProposalsQueryResult>;
  proposalsView: Maybe<ProposalsViewQueryResult>;
  quantities: Array<Quantity>;
  queriesMutationsAndServices: Maybe<QueriesMutationsAndServices>;
  questionByNaturalKey: Question;
  questionary: Maybe<Questionary>;
  questions: Array<QuestionWithUsage>;
  review: Maybe<Review>;
  reviews: Maybe<ReviewsQueryResult>;
  roles: Maybe<Array<Role>>;
  sample: Maybe<Sample>;
  samples: Maybe<Array<Sample>>;
  samplesByCallId: Maybe<Array<Sample>>;
  scheduledEvent: Maybe<ScheduledEvent>;
  scheduledEvents: Array<ScheduledEvent>;
  schedulerQueriesAndMutations: Maybe<QueriesAndMutations>;
  schedulerVersion: Scalars['String']['output'];
  settings: Array<Settings>;
  shipment: Maybe<Shipment>;
  shipments: Maybe<Array<Shipment>>;
  status: Maybe<Status>;
  statusActions: Maybe<Array<StatusAction>>;
  statusActionsLogs: Maybe<StatusActionsLogQueryResult>;
  statuses: Maybe<Array<Status>>;
  tag: Maybe<Tag>;
  tags: Array<Tag>;
  technicalReview: Maybe<TechnicalReview>;
  technicalReviewTemplates: Maybe<Array<TechnicalReviewTemplate>>;
  technicalReviews: Maybe<TechnicalReviewsQueryResult>;
  technique: Maybe<Technique>;
  techniqueScientistProposals: Maybe<ProposalsViewResult>;
  techniques: Maybe<TechniquesQueryResult>;
  techniquesByIds: Maybe<Array<Technique>>;
  techniquesByScientist: Maybe<Array<Technique>>;
  template: Maybe<Template>;
  templateCategories: Maybe<Array<TemplateCategory>>;
  templates: Maybe<Array<Template>>;
  units: Maybe<Array<Unit>>;
  unitsAsJson: Maybe<Scalars['String']['output']>;
  user: Maybe<User>;
  userByOIDCSub: Maybe<User>;
  userHasAccessToProposal: Maybe<Scalars['Boolean']['output']>;
  userInstruments: Maybe<InstrumentsQueryResult>;
  users: Maybe<UserQueryResult>;
  version: Scalars['String']['output'];
  visit: Maybe<Visit>;
  visitRegistration: Maybe<VisitRegistration>;
  visits: Array<Visit>;
  workflow: Maybe<Workflow>;
  workflows: Maybe<Array<Workflow>>;
};


export type QueryAccessTokenAndPermissionsArgs = {
  accessTokenId: Scalars['String']['input'];
};


export type QueryActiveTemplateIdArgs = {
  templateGroupId: TemplateGroupId;
};


export type QueryAllExperimentsArgs = {
  filter?: InputMaybe<ExperimentsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  searchText?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<Scalars['String']['input']>;
  sortField?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAllQuestionsArgs = {
  filter?: InputMaybe<AllQuestionsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  searchText?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<Scalars['String']['input']>;
  sortField?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAvailableEquipmentsArgs = {
  scheduledEventId: Scalars['Int']['input'];
};


export type QueryBasicUserDetailsArgs = {
  userId: Scalars['Int']['input'];
};


export type QueryBasicUserDetailsByEmailArgs = {
  email: Scalars['String']['input'];
  role?: InputMaybe<UserRole>;
};


export type QueryBlankQuestionaryArgs = {
  templateId: Scalars['Int']['input'];
};


export type QueryBlankQuestionaryStepsArgs = {
  templateId: Scalars['Int']['input'];
};


export type QueryBlankQuestionaryStepsByCallIdArgs = {
  callId: Scalars['Int']['input'];
};


export type QueryCallArgs = {
  callId: Scalars['Int']['input'];
};


export type QueryCallsArgs = {
  filter?: InputMaybe<CallsFilter>;
};


export type QueryCallsByInstrumentScientistArgs = {
  scientistId: Scalars['Int']['input'];
};


export type QueryCheckEmailExistArgs = {
  email: Scalars['String']['input'];
};


export type QueryCheckExternalTokenArgs = {
  token: Scalars['String']['input'];
};


export type QueryCheckTokenArgs = {
  token: Scalars['String']['input'];
};


export type QueryDataAccessUsersArgs = {
  proposalPk: Scalars['Int']['input'];
};


export type QueryEquipmentArgs = {
  id: Scalars['Int']['input'];
};


export type QueryEquipmentsArgs = {
  equipmentIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};


export type QueryEventLogsArgs = {
  changedObjectId: Scalars['String']['input'];
  eventType: Scalars['String']['input'];
};


export type QueryEventsArgs = {
  entityType: WorkflowType;
};


export type QueryExperimentArgs = {
  experimentPk: Scalars['Int']['input'];
};


export type QueryExperimentSafetyArgs = {
  experimentSafetyPk: Scalars['Int']['input'];
};


export type QueryExperimentSafetyPdfTemplateArgs = {
  experimentSafetyPdfTemplateId: Scalars['Int']['input'];
};


export type QueryExperimentSafetyPdfTemplatesArgs = {
  filter?: InputMaybe<ExperimentSafetyPdfTemplatesFilter>;
};


export type QueryExperimentSampleArgs = {
  experimentPk: Scalars['Int']['input'];
  sampleId: Scalars['Int']['input'];
};


export type QueryFapArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFapMembersArgs = {
  fapId: Scalars['Int']['input'];
};


export type QueryFapProposalArgs = {
  fapId: Scalars['Int']['input'];
  proposalPk: Scalars['Int']['input'];
};


export type QueryFapProposalsArgs = {
  callId?: InputMaybe<Scalars['Int']['input']>;
  fapId: Scalars['Int']['input'];
  instrumentId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFapProposalsByInstrumentArgs = {
  callId: Scalars['Int']['input'];
  fapId: Scalars['Int']['input'];
  instrumentId: Scalars['Int']['input'];
};


export type QueryFapReviewTemplatesArgs = {
  filter?: InputMaybe<FapReviewTemplatesFilter>;
};


export type QueryFapReviewersArgs = {
  fapId: Scalars['Int']['input'];
};


export type QueryFapsArgs = {
  filter?: InputMaybe<FapsFilter>;
};


export type QueryFeedbackArgs = {
  feedbackId: Scalars['Int']['input'];
};


export type QueryFeedbacksArgs = {
  filter?: InputMaybe<FeedbacksFilter>;
};


export type QueryFileMetadataArgs = {
  fileId: Scalars['String']['input'];
};


export type QueryFilesMetadataArgs = {
  filter: FilesMetadataFilter;
};


export type QueryGenericTemplateArgs = {
  genericTemplateId: Scalars['Int']['input'];
};


export type QueryGenericTemplatesArgs = {
  filter?: InputMaybe<GenericTemplatesFilter>;
};


export type QueryGetCallByAnswerIdArgs = {
  answerId: Scalars['Int']['input'];
};


export type QueryGetDynamicMultipleChoiceOptionsArgs = {
  questionId: Scalars['String']['input'];
};


export type QueryInstitutionsArgs = {
  filter?: InputMaybe<InstitutionsFilter>;
};


export type QueryInstrumentArgs = {
  instrumentId: Scalars['Int']['input'];
};


export type QueryInstrumentProposalBookingsArgs = {
  callId?: InputMaybe<Scalars['Int']['input']>;
  instrumentIds: Array<Scalars['Int']['input']>;
};


export type QueryInstrumentScientistHasAccessArgs = {
  instrumentId: Scalars['Int']['input'];
  proposalPk: Scalars['Int']['input'];
};


export type QueryInstrumentScientistHasInstrumentArgs = {
  instrumentId: Scalars['Int']['input'];
};


export type QueryInstrumentScientistProposalsArgs = {
  filter?: InputMaybe<ProposalsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryInstrumentsArgs = {
  callIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};


export type QueryInstrumentsByFapArgs = {
  callId: Scalars['Int']['input'];
  fapId: Scalars['Int']['input'];
};


export type QueryInstrumentsByIdsArgs = {
  instrumentIds: Array<Scalars['Int']['input']>;
};


export type QueryInternalReviewArgs = {
  internalReviewId: Scalars['Int']['input'];
};


export type QueryInternalReviewsArgs = {
  filter?: InputMaybe<InternalReviewsFilter>;
};


export type QueryIsNaturalKeyPresentArgs = {
  naturalKey: Scalars['String']['input'];
};


export type QueryPageContentArgs = {
  pageId: PageName;
};


export type QueryPredefinedMessageArgs = {
  predefinedMessageId: Scalars['Int']['input'];
};


export type QueryPredefinedMessagesArgs = {
  filter?: InputMaybe<PredefinedMessagesFilter>;
};


export type QueryPreviousCollaboratorsArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  subtractUsers?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  userId: Scalars['Int']['input'];
  userRole?: InputMaybe<UserRole>;
};


export type QueryProposalArgs = {
  primaryKey: Scalars['Int']['input'];
};


export type QueryProposalBookingArgs = {
  id: Scalars['Int']['input'];
};


export type QueryProposalBookingLostTimesArgs = {
  proposalBookingId: Scalars['Int']['input'];
  scheduledEventId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProposalBookingScheduledEventArgs = {
  proposalBookingId: Scalars['Int']['input'];
  scheduledEventId: Scalars['Int']['input'];
};


export type QueryProposalBookingScheduledEventsArgs = {
  proposalBookingId: Scalars['Int']['input'];
};


export type QueryProposalByIdArgs = {
  proposalId: Scalars['String']['input'];
};


export type QueryProposalPdfTemplateArgs = {
  proposalPdfTemplateId: Scalars['Int']['input'];
};


export type QueryProposalPdfTemplatesArgs = {
  filter?: InputMaybe<ProposalPdfTemplatesFilter>;
};


export type QueryProposalReviewsArgs = {
  fapId?: InputMaybe<Scalars['Int']['input']>;
  proposalPk: Scalars['Int']['input'];
};


export type QueryProposalScientistCommentArgs = {
  proposalPk: Scalars['Int']['input'];
};


export type QueryProposalTemplatesArgs = {
  filter?: InputMaybe<ProposalTemplatesFilter>;
};


export type QueryProposalsArgs = {
  filter?: InputMaybe<ProposalsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProposalsViewArgs = {
  filter?: InputMaybe<ProposalsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  searchText?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<Scalars['String']['input']>;
  sortField?: InputMaybe<Scalars['String']['input']>;
};


export type QueryQuestionByNaturalKeyArgs = {
  naturalKey: Scalars['String']['input'];
};


export type QueryQuestionaryArgs = {
  questionaryId: Scalars['Int']['input'];
};


export type QueryQuestionsArgs = {
  filter?: InputMaybe<QuestionsFilter>;
};


export type QueryReviewArgs = {
  reviewId: Scalars['Int']['input'];
};


export type QueryReviewsArgs = {
  filter?: InputMaybe<ReviewsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySampleArgs = {
  sampleId: Scalars['Int']['input'];
};


export type QuerySamplesArgs = {
  filter?: InputMaybe<SamplesFilter>;
};


export type QuerySamplesByCallIdArgs = {
  callId: Scalars['Int']['input'];
};


export type QueryScheduledEventArgs = {
  id: Scalars['Int']['input'];
};


export type QueryScheduledEventsArgs = {
  filter: ScheduledEventFilter;
};


export type QueryShipmentArgs = {
  shipmentId: Scalars['Int']['input'];
};


export type QueryShipmentsArgs = {
  filter?: InputMaybe<ShipmentsFilter>;
};


export type QueryStatusArgs = {
  statusId: Scalars['Int']['input'];
};


export type QueryStatusActionsLogsArgs = {
  filter?: InputMaybe<StatusActionsLogsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  searchText?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<Scalars['String']['input']>;
  sortField?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStatusesArgs = {
  entityType: WorkflowType;
};


export type QueryTagArgs = {
  id: Scalars['Float']['input'];
};


export type QueryTechnicalReviewArgs = {
  technicalReviewId: Scalars['Int']['input'];
};


export type QueryTechnicalReviewTemplatesArgs = {
  filter?: InputMaybe<TechnicalReviewTemplatesFilter>;
};


export type QueryTechnicalReviewsArgs = {
  filter?: InputMaybe<TechnicalReviewsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTechniqueArgs = {
  techniqueId: Scalars['Int']['input'];
};


export type QueryTechniqueScientistProposalsArgs = {
  filter?: InputMaybe<ProposalsFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  searchText?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<Scalars['String']['input']>;
  sortField?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTechniquesByIdsArgs = {
  techniqueIds: Array<Scalars['Int']['input']>;
};


export type QueryTechniquesByScientistArgs = {
  userNumber: Scalars['Int']['input'];
};


export type QueryTemplateArgs = {
  templateId: Scalars['Int']['input'];
};


export type QueryTemplatesArgs = {
  filter?: InputMaybe<TemplatesFilter>;
};


export type QueryUserArgs = {
  userId: Scalars['Int']['input'];
};


export type QueryUserByOidcSubArgs = {
  oidcSub: Scalars['String']['input'];
};


export type QueryUserHasAccessToProposalArgs = {
  proposalPk: Scalars['Int']['input'];
};


export type QueryUsersArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  subtractUsers?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  userRole?: InputMaybe<UserRole>;
};


export type QueryVisitArgs = {
  visitId: Scalars['Int']['input'];
};


export type QueryVisitRegistrationArgs = {
  userId: Scalars['Int']['input'];
  visitId: Scalars['Int']['input'];
};


export type QueryVisitsArgs = {
  filter?: InputMaybe<VisitsFilter>;
};


export type QueryWorkflowArgs = {
  workflowId: Scalars['Int']['input'];
};


export type QueryWorkflowsArgs = {
  entityType: WorkflowType;
};

export type QueryMutationAndServicesGroup = {
  groupName: QueryMutationAndServicesGroups;
  items: Array<Scalars['String']['output']>;
};

export enum QueryMutationAndServicesGroups {
  CORE = 'CORE',
  SCHEDULER = 'SCHEDULER'
}

export type Question = {
  categoryId: TemplateCategoryId;
  config: FieldConfig;
  dataType: DataType;
  id: Scalars['String']['output'];
  naturalKey: Scalars['String']['output'];
  question: Scalars['String']['output'];
};

export type QuestionComparison = {
  conflictResolutionStrategy: ConflictResolutionStrategy;
  existingQuestion: Maybe<Question>;
  newQuestion: Question;
  status: QuestionComparisonStatus;
};

export enum QuestionComparisonStatus {
  DIFFERENT = 'DIFFERENT',
  NEW = 'NEW',
  SAME = 'SAME'
}

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
  questionId: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type QuestionTemplateRelation = {
  config: FieldConfig;
  dependencies: Array<FieldDependency>;
  dependenciesOperator: Maybe<DependenciesLogicOperator>;
  question: Question;
  sortOrder: Scalars['Int']['output'];
  topicId: Scalars['Int']['output'];
};

export type QuestionWithUsage = {
  answers: Array<AnswerBasic>;
  categoryId: TemplateCategoryId;
  config: FieldConfig;
  dataType: DataType;
  id: Scalars['String']['output'];
  naturalKey: Scalars['String']['output'];
  question: Scalars['String']['output'];
  templates: Array<Template>;
};

export type Questionary = {
  created: Scalars['DateTime']['output'];
  isCompleted: Scalars['Boolean']['output'];
  questionaryId: Scalars['Int']['output'];
  steps: Array<QuestionaryStep>;
  templateId: Scalars['Int']['output'];
};

export type QuestionaryStep = {
  fields: Array<Answer>;
  isCompleted: Scalars['Boolean']['output'];
  topic: Topic;
};

export type QuestionsFilter = {
  category?: InputMaybe<TemplateCategoryId>;
  dataType?: InputMaybe<Array<DataType>>;
  excludeDataType?: InputMaybe<Array<DataType>>;
  questionIds?: InputMaybe<Array<Scalars['String']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type RabbitMqActionConfig = {
  exchanges: Maybe<Array<Scalars['String']['output']>>;
};

export type RabbitMqActionDefaultConfig = {
  exchanges: Maybe<Array<Scalars['String']['output']>>;
};

export type RedeemCode = {
  claimedAt: Maybe<Scalars['DateTime']['output']>;
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['Int']['output'];
  placeholderUserId: Scalars['Int']['output'];
};

export type Rejection = {
  reason: Scalars['String']['output'];
};

export type RemoveAssignedInstrumentFromCallInput = {
  callId: Scalars['Int']['input'];
  instrumentId: Scalars['Int']['input'];
};

export type ReorderFapMeetingDecisionProposalsInput = {
  proposals: Array<ProposalPkWithRankOrder>;
};

export type ReplayStatusActionsLogsResult = {
  failed: Array<ReplayStatusLogFailure>;
  successful: Array<Scalars['Int']['output']>;
  totalRequested: Scalars['Int']['output'];
};

export type ReplayStatusLogFailure = {
  error: Scalars['String']['output'];
  logId: Scalars['Int']['output'];
};

export type RequestVisitRegistrationChangesInput = {
  userId: Scalars['Int']['input'];
  visitId: Scalars['Int']['input'];
};

export type Review = {
  comment: Maybe<Scalars['String']['output']>;
  dateAssigned: Scalars['DateTime']['output'];
  dateReassigned: Maybe<Scalars['DateTime']['output']>;
  emailSent: Scalars['Boolean']['output'];
  fapID: Scalars['Int']['output'];
  grade: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  proposal: Maybe<Proposal>;
  questionary: Questionary;
  questionaryID: Scalars['Int']['output'];
  rank: Maybe<Scalars['Int']['output']>;
  reassigned: Scalars['Boolean']['output'];
  reviewer: Maybe<BasicUserDetails>;
  status: ReviewStatus;
  userID: Scalars['Int']['output'];
};

export enum ReviewStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED'
}

export enum ReviewerFilter {
  ALL = 'ALL',
  ME = 'ME'
}

export type ReviewsFilter = {
  callId?: InputMaybe<Scalars['Int']['input']>;
  questionaryIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  reviewer?: InputMaybe<ReviewerFilter>;
  shortCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  templateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type ReviewsQueryResult = {
  reviews: Array<Review>;
  totalCount: Scalars['Int']['output'];
};

export type RichTextInputConfig = {
  allowImages: Scalars['Boolean']['output'];
  max: Maybe<Scalars['Int']['output']>;
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  tooltip: Scalars['String']['output'];
};

export type Role = {
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  shortCode: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Sample = {
  created: Scalars['DateTime']['output'];
  creatorId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  isPostProposalSubmission: Scalars['Boolean']['output'];
  proposal: Proposal;
  proposalPk: Scalars['Int']['output'];
  questionId: Scalars['String']['output'];
  questionary: Questionary;
  questionaryId: Scalars['Int']['output'];
  safetyComment: Scalars['String']['output'];
  safetyStatus: SampleStatus;
  title: Scalars['String']['output'];
};

export type SampleBasisConfig = {
  readPermissions: Array<Scalars['String']['output']>;
  titlePlaceholder: Scalars['String']['output'];
};

export type SampleDeclarationConfig = {
  addEntryButtonLabel: Scalars['String']['output'];
  esiTemplateId: Maybe<Scalars['Int']['output']>;
  maxEntries: Maybe<Scalars['Int']['output']>;
  minEntries: Maybe<Scalars['Int']['output']>;
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  templateCategory: Scalars['String']['output'];
  templateId: Maybe<Scalars['Int']['output']>;
};

export type SampleEsiBasisConfig = {
  readPermissions: Array<Scalars['String']['output']>;
  tooltip: Scalars['String']['output'];
};

export enum SampleStatus {
  ELEVATED_RISK = 'ELEVATED_RISK',
  HIGH_RISK = 'HIGH_RISK',
  LOW_RISK = 'LOW_RISK',
  PENDING_EVALUATION = 'PENDING_EVALUATION'
}

export type SamplesFilter = {
  creatorId?: InputMaybe<Scalars['Int']['input']>;
  proposalPk?: InputMaybe<Scalars['Int']['input']>;
  questionId?: InputMaybe<Scalars['String']['input']>;
  questionaryIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  sampleIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  status?: InputMaybe<SampleStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
  visitId?: InputMaybe<Scalars['Int']['input']>;
};

export type SaveFapMeetingDecisionInput = {
  commentForManagement?: InputMaybe<Scalars['String']['input']>;
  commentForUser?: InputMaybe<Scalars['String']['input']>;
  fapId: Scalars['Int']['input'];
  instrumentId: Scalars['Int']['input'];
  proposalPk: Scalars['Int']['input'];
  rankOrder?: InputMaybe<Scalars['Int']['input']>;
  recommendation?: InputMaybe<ProposalEndStatus>;
  submitted?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ScheduledEvent = {
  bookingType: ScheduledEventBookingType;
  color: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  endsAt: Scalars['TzLessDateTime']['output'];
  equipmentAssignmentStatus: Maybe<EquipmentAssignmentStatus>;
  equipmentId: Maybe<Scalars['Int']['output']>;
  equipments: Array<EquipmentWithAssignmentStatus>;
  id: Scalars['Int']['output'];
  instrument: Maybe<Instrument>;
  localContact: Maybe<BasicUserDetails>;
  proposalBooking: Maybe<ProposalBooking>;
  proposalBookingId: Maybe<Scalars['Int']['output']>;
  scheduledBy: Maybe<BasicUserDetails>;
  startsAt: Scalars['TzLessDateTime']['output'];
  status: ProposalBookingStatusCore;
  updatedAt: Scalars['DateTime']['output'];
};

export enum ScheduledEventBookingType {
  EQUIPMENT = 'EQUIPMENT',
  MAINTENANCE = 'MAINTENANCE',
  SHUTDOWN = 'SHUTDOWN',
  USER_OPERATIONS = 'USER_OPERATIONS'
}

export type ScheduledEventFilter = {
  callId?: InputMaybe<Scalars['Int']['input']>;
  endsAt: Scalars['TzLessDateTime']['input'];
  instrumentIds: Array<Scalars['Int']['input']>;
  localContactIds: Array<Scalars['Int']['input']>;
  startsAt: Scalars['TzLessDateTime']['input'];
};

export type ScheduledEventResponseWrap = {
  error: Maybe<Scalars['String']['output']>;
  scheduledEvent: Maybe<ScheduledEvent>;
};

export type ScheduledEventWithRejection = Rejection | ScheduledEvent;

export type ScheduledEventsResponseWrap = {
  error: Maybe<Scalars['String']['output']>;
  scheduledEvents: Array<ScheduledEventWithRejection>;
};

export type SchedulerSuccessResponseWrap = {
  error: Maybe<Scalars['String']['output']>;
  isSuccess: Maybe<Scalars['Boolean']['output']>;
};

export type SelectionFromOptionsConfig = {
  isMultipleSelect: Scalars['Boolean']['output'];
  options: Array<Scalars['String']['output']>;
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  tooltip: Scalars['String']['output'];
  variant: Scalars['String']['output'];
};

export type SetCoProposerInvitesInput = {
  emails: Array<Scalars['String']['input']>;
  proposalPk: Scalars['Int']['input'];
};

export type Settings = {
  description: Maybe<Scalars['String']['output']>;
  id: SettingsId;
  settingsValue: Maybe<Scalars['String']['output']>;
};

export enum SettingsId {
  DATE_FORMAT = 'DATE_FORMAT',
  DATE_TIME_FORMAT = 'DATE_TIME_FORMAT',
  DEFAULT_INST_SCI_REVIEWER_FILTER = 'DEFAULT_INST_SCI_REVIEWER_FILTER',
  DEFAULT_INST_SCI_STATUS_FILTER = 'DEFAULT_INST_SCI_STATUS_FILTER',
  DISPLAY_FAQ_LINK = 'DISPLAY_FAQ_LINK',
  DISPLAY_PRIVACY_STATEMENT_LINK = 'DISPLAY_PRIVACY_STATEMENT_LINK',
  EXPERIMENT_SAFETY_REVIEW_EMAIL = 'EXPERIMENT_SAFETY_REVIEW_EMAIL',
  EXTERNAL_AUTH_LOGIN_URL = 'EXTERNAL_AUTH_LOGIN_URL',
  EXTERNAL_AUTH_LOGOUT_URL = 'EXTERNAL_AUTH_LOGOUT_URL',
  FAP_SECS_EDIT_TECH_REVIEWS = 'FAP_SECS_EDIT_TECH_REVIEWS',
  FEEDBACK_EXHAUST_DAYS = 'FEEDBACK_EXHAUST_DAYS',
  FEEDBACK_FREQUENCY_DAYS = 'FEEDBACK_FREQUENCY_DAYS',
  FEEDBACK_MAX_REQUESTS = 'FEEDBACK_MAX_REQUESTS',
  GRADE_PRECISION = 'GRADE_PRECISION',
  HEADER_LOGO_FILENAME = 'HEADER_LOGO_FILENAME',
  IDLE_TIMEOUT = 'IDLE_TIMEOUT',
  INVITE_REMINDERS_SEND_DELAY_DAYS = 'INVITE_REMINDERS_SEND_DELAY_DAYS',
  INVITE_VALIDITY_PERIOD_DAYS = 'INVITE_VALIDITY_PERIOD_DAYS',
  ORGANISATION_NAME = 'ORGANISATION_NAME',
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
  PROFILE_PAGE_LINK = 'PROFILE_PAGE_LINK',
  SMTP_BCC_EMAIL = 'SMTP_BCC_EMAIL',
  TECH_REVIEW_OPTIONAL_WORKFLOW_STATUS = 'TECH_REVIEW_OPTIONAL_WORKFLOW_STATUS',
  TIMEZONE = 'TIMEZONE',
  USER_OFFICE_EMAIL = 'USER_OFFICE_EMAIL'
}

export type Shipment = {
  created: Scalars['DateTime']['output'];
  creatorId: Scalars['Int']['output'];
  experimentPk: Maybe<Scalars['Int']['output']>;
  externalRef: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  proposal: Proposal;
  proposalPk: Scalars['Int']['output'];
  questionary: Questionary;
  questionaryId: Scalars['Int']['output'];
  samples: Array<Sample>;
  status: ShipmentStatus;
  title: Scalars['String']['output'];
};

export type ShipmentBasisConfig = {
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  tooltip: Scalars['String']['output'];
};

export enum ShipmentStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED'
}

export type ShipmentsFilter = {
  creatorId?: InputMaybe<Scalars['Int']['input']>;
  experimentPk?: InputMaybe<Scalars['Int']['input']>;
  externalRef?: InputMaybe<Scalars['String']['input']>;
  proposalPk?: InputMaybe<Scalars['Int']['input']>;
  questionaryIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  shipmentIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  status?: InputMaybe<ShipmentStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type SimpleLostTimeInput = {
  endsAt: Scalars['TzLessDateTime']['input'];
  newlyCreated?: InputMaybe<Scalars['Boolean']['input']>;
  scheduledEventId?: InputMaybe<Scalars['Int']['input']>;
  startsAt: Scalars['TzLessDateTime']['input'];
};

export type Status = {
  description: Scalars['String']['output'];
  entityType: WorkflowType;
  id: Scalars['Int']['output'];
  isDefault: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  shortCode: Scalars['String']['output'];
};

export type StatusAction = {
  defaultConfig: Maybe<StatusActionDefaultConfig>;
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  type: StatusActionType;
};

export type StatusActionConfig = EmailActionConfig | RabbitMqActionConfig;

export type StatusActionDefaultConfig = EmailActionDefaultConfig | RabbitMqActionDefaultConfig;

export enum StatusActionType {
  EMAIL = 'EMAIL',
  PROPOSALDOWNLOAD = 'PROPOSALDOWNLOAD',
  RABBITMQ = 'RABBITMQ'
}

export type StatusActionsLog = {
  connectionStatusAction: Maybe<ConnectionStatusAction>;
  emailStatusActionRecipient: Maybe<EmailStatusActionRecipients>;
  proposals: Array<Proposal>;
  statusActionsLogId: Scalars['Int']['output'];
  statusActionsMessage: Scalars['String']['output'];
  statusActionsSuccessful: Scalars['Boolean']['output'];
  statusActionsTstamp: Scalars['DateTime']['output'];
};

export type StatusActionsLogQueryResult = {
  statusActionsLogs: Array<StatusActionsLog>;
  totalCount: Scalars['Int']['output'];
};

export type StatusActionsLogsFilter = {
  callIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  connectionIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  emailStatusActionRecipient?: InputMaybe<Array<EmailStatusActionRecipients>>;
  statusActionIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  statusActionType?: InputMaybe<StatusActionType>;
  statusActionsLogIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  statusActionsMessage?: InputMaybe<Scalars['String']['input']>;
  statusActionsSuccessful?: InputMaybe<Scalars['Boolean']['input']>;
};

export type StatusChangingEvent = {
  statusChangingEvent: Scalars['String']['output'];
  statusChangingEventId: Scalars['Int']['output'];
  workflowConnectionId: Scalars['Int']['output'];
};

export type SubTemplateConfig = {
  addEntryButtonLabel: Scalars['String']['output'];
  canCopy: Scalars['Boolean']['output'];
  copyButtonLabel: Maybe<Scalars['String']['output']>;
  isCompleteOnCopy: Maybe<Scalars['Boolean']['output']>;
  isMultipleCopySelect: Maybe<Scalars['Boolean']['output']>;
  maxEntries: Maybe<Scalars['Int']['output']>;
  minEntries: Maybe<Scalars['Int']['output']>;
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  templateCategory: Scalars['String']['output'];
  templateId: Maybe<Scalars['Int']['output']>;
};

export type SubmitFapMeetingDecisionsInput = {
  callId: Scalars['Int']['input'];
  fapId: Scalars['Int']['input'];
};

export type SubmitProposalsReviewInput = {
  proposals: Array<ProposalPkWithReviewId>;
};

export type SubmitTechnicalReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<Scalars['String']['input']>;
  instrumentId: Scalars['Int']['input'];
  proposalPk: Scalars['Int']['input'];
  publicComment?: InputMaybe<Scalars['String']['input']>;
  questionaryId?: InputMaybe<Scalars['Int']['input']>;
  reviewerId: Scalars['Int']['input'];
  status?: InputMaybe<TechnicalReviewStatus>;
  submitted: Scalars['Boolean']['input'];
  timeAllocation?: InputMaybe<Scalars['Int']['input']>;
};

export type SubmitTechnicalReviewsInput = {
  technicalReviews: Array<SubmitTechnicalReviewInput>;
};

export type Tag = {
  calls: Array<Call>;
  id: Scalars['Int']['output'];
  instruments: Array<Instrument>;
  name: Scalars['String']['output'];
  shortCode: Scalars['String']['output'];
};

export type TechnicalReview = {
  comment: Maybe<Scalars['String']['output']>;
  files: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  instrumentId: Scalars['Int']['output'];
  proposal: Maybe<Proposal>;
  proposalPk: Scalars['Int']['output'];
  publicComment: Maybe<Scalars['String']['output']>;
  questionary: Questionary;
  questionaryId: Scalars['Int']['output'];
  reviewer: Maybe<BasicUserDetails>;
  reviewerId: Scalars['Int']['output'];
  status: Maybe<TechnicalReviewStatus>;
  submitted: Scalars['Boolean']['output'];
  technicalReviewAssignee: Maybe<BasicUserDetails>;
  technicalReviewAssigneeId: Maybe<Scalars['Int']['output']>;
  timeAllocation: Maybe<Scalars['Int']['output']>;
};

export type TechnicalReviewBasisConfig = {
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  tooltip: Scalars['String']['output'];
};

export enum TechnicalReviewStatus {
  FEASIBLE = 'FEASIBLE',
  PARTIALLY_FEASIBLE = 'PARTIALLY_FEASIBLE',
  UNFEASIBLE = 'UNFEASIBLE'
}

export type TechnicalReviewTemplate = {
  callCount: Scalars['Int']['output'];
  complementaryQuestions: Array<Question>;
  description: Maybe<Scalars['String']['output']>;
  experimentSafetyPdfCallCount: Maybe<Scalars['Int']['output']>;
  experimentSafetyPdfTemplate: Maybe<ExperimentSafetyPdfTemplate>;
  group: TemplateGroup;
  groupId: TemplateGroupId;
  isArchived: Scalars['Boolean']['output'];
  json: Scalars['String']['output'];
  name: Scalars['String']['output'];
  proposalESICallCount: Maybe<Scalars['Int']['output']>;
  proposalPdfCallCount: Maybe<Scalars['Int']['output']>;
  proposalPdfTemplate: Maybe<ProposalPdfTemplate>;
  questionaryCount: Scalars['Int']['output'];
  steps: Array<TemplateStep>;
  templateId: Scalars['Int']['output'];
};

export type TechnicalReviewTemplatesFilter = {
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  templateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type TechnicalReviewsFilter = {
  callId?: InputMaybe<Scalars['Int']['input']>;
  questionaryIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  reviewer?: InputMaybe<ReviewerFilter>;
  shortCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  templateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type TechnicalReviewsQueryResult = {
  technicalReviews: Array<TechnicalReview>;
  totalCount: Scalars['Int']['output'];
};

export type Technique = {
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  instruments: Array<Instrument>;
  name: Scalars['String']['output'];
  scientists: Array<BasicUserDetails>;
  shortCode: Scalars['String']['output'];
};

export type TechniqueFilterInput = {
  showAllProposals: Scalars['Boolean']['input'];
  showMultiTechniqueProposals: Scalars['Boolean']['input'];
  techniqueId?: InputMaybe<Scalars['Int']['input']>;
};

export type TechniqueOption = {
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
};

export type TechniquePickerConfig = {
  isMultipleSelect: Scalars['Boolean']['output'];
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  techniques: Array<TechniqueOption>;
  tooltip: Scalars['String']['output'];
  variant: Scalars['String']['output'];
};

export type TechniquesQueryResult = {
  techniques: Array<Technique>;
  totalCount: Scalars['Int']['output'];
};

export type Template = {
  complementaryQuestions: Array<Question>;
  description: Maybe<Scalars['String']['output']>;
  experimentSafetyPdfCallCount: Maybe<Scalars['Int']['output']>;
  experimentSafetyPdfTemplate: Maybe<ExperimentSafetyPdfTemplate>;
  group: TemplateGroup;
  groupId: TemplateGroupId;
  isArchived: Scalars['Boolean']['output'];
  json: Scalars['String']['output'];
  name: Scalars['String']['output'];
  proposalESICallCount: Maybe<Scalars['Int']['output']>;
  proposalPdfCallCount: Maybe<Scalars['Int']['output']>;
  proposalPdfTemplate: Maybe<ProposalPdfTemplate>;
  questionaryCount: Scalars['Int']['output'];
  steps: Array<TemplateStep>;
  templateId: Scalars['Int']['output'];
};

export type TemplateCategory = {
  categoryId: TemplateCategoryId;
  name: Scalars['String']['output'];
};

export enum TemplateCategoryId {
  EXPERIMENT_SAFETY_PDF = 'EXPERIMENT_SAFETY_PDF',
  EXPERIMENT_SAFETY_REVIEW = 'EXPERIMENT_SAFETY_REVIEW',
  FAP_REVIEW = 'FAP_REVIEW',
  FEEDBACK = 'FEEDBACK',
  GENERIC_TEMPLATE = 'GENERIC_TEMPLATE',
  PROPOSAL_PDF = 'PROPOSAL_PDF',
  PROPOSAL_QUESTIONARY = 'PROPOSAL_QUESTIONARY',
  SAMPLE_DECLARATION = 'SAMPLE_DECLARATION',
  SHIPMENT_DECLARATION = 'SHIPMENT_DECLARATION',
  TECHNICAL_REVIEW = 'TECHNICAL_REVIEW',
  VISIT_REGISTRATION = 'VISIT_REGISTRATION'
}

export type TemplateGroup = {
  categoryId: TemplateCategoryId;
  groupId: TemplateGroupId;
};

export enum TemplateGroupId {
  EXPERIMENT_SAFETY_PDF = 'EXPERIMENT_SAFETY_PDF',
  EXPERIMENT_SAFETY_REVIEW = 'EXPERIMENT_SAFETY_REVIEW',
  FAP_REVIEW = 'FAP_REVIEW',
  FEEDBACK = 'FEEDBACK',
  GENERIC_TEMPLATE = 'GENERIC_TEMPLATE',
  PROPOSAL = 'PROPOSAL',
  PROPOSAL_ESI = 'PROPOSAL_ESI',
  PROPOSAL_PDF = 'PROPOSAL_PDF',
  SAMPLE = 'SAMPLE',
  SAMPLE_ESI = 'SAMPLE_ESI',
  SHIPMENT = 'SHIPMENT',
  TECHNICAL_REVIEW = 'TECHNICAL_REVIEW',
  VISIT_REGISTRATION = 'VISIT_REGISTRATION'
}

export type TemplateStep = {
  fields: Array<QuestionTemplateRelation>;
  topic: Topic;
};

export type TemplateValidation = {
  exportDate: Scalars['DateTime']['output'];
  json: Scalars['String']['output'];
  validationData: TemplateValidationData;
  version: Scalars['String']['output'];
};

export type TemplateValidationData = {
  errors: Array<Scalars['String']['output']>;
  isValid: Scalars['Boolean']['output'];
  questionComparisons: Array<QuestionComparison>;
  subTemplateValidationData: Array<TemplateValidationData>;
};

export type TemplatesFilter = {
  group?: InputMaybe<TemplateGroupId>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  templateIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type TextInputConfig = {
  htmlQuestion: Maybe<Scalars['String']['output']>;
  isCounterHidden: Scalars['Boolean']['output'];
  isHtmlQuestion: Scalars['Boolean']['output'];
  max: Maybe<Scalars['Int']['output']>;
  min: Maybe<Scalars['Int']['output']>;
  multiline: Scalars['Boolean']['output'];
  placeholder: Scalars['String']['output'];
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  tooltip: Scalars['String']['output'];
};

export type TimeSpan = {
  from?: InputMaybe<Scalars['DateTime']['input']>;
  to?: InputMaybe<Scalars['DateTime']['input']>;
};

export type TokenPayloadUnion = AuthJwtApiTokenPayload | AuthJwtPayload;

export type TokenResult = {
  isValid: Scalars['Boolean']['output'];
  payload: Maybe<TokenPayloadUnion>;
};

export type Topic = {
  id: Scalars['Int']['output'];
  isEnabled: Scalars['Boolean']['output'];
  sortOrder: Scalars['Int']['output'];
  templateId: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type Unit = {
  id: Scalars['String']['output'];
  quantity: Scalars['String']['output'];
  siConversionFormula: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  unit: Scalars['String']['output'];
};

export type UnitComparison = {
  conflictResolutionStrategy: ConflictResolutionStrategy;
  existingUnit: Maybe<Unit>;
  newUnit: Unit;
  status: QuestionComparisonStatus;
};

export type UnitsImportWithValidation = {
  errors: Array<Scalars['String']['output']>;
  exportDate: Scalars['DateTime']['output'];
  isValid: Scalars['Boolean']['output'];
  json: Scalars['String']['output'];
  unitComparisons: Array<UnitComparison>;
  version: Scalars['String']['output'];
};

export type UpdateApiAccessTokenInput = {
  accessPermissions: Scalars['String']['input'];
  accessTokenId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type UpdateCallInput = {
  allocationTimeUnit?: InputMaybe<AllocationTimeUnits>;
  callEnded?: InputMaybe<Scalars['Boolean']['input']>;
  callEndedInternal?: InputMaybe<Scalars['Boolean']['input']>;
  callFapReviewEnded?: InputMaybe<Scalars['Boolean']['input']>;
  callReviewEnded?: InputMaybe<Scalars['Boolean']['input']>;
  cycleComment?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endCall?: InputMaybe<Scalars['DateTime']['input']>;
  endCallInternal?: InputMaybe<Scalars['DateTime']['input']>;
  endCycle?: InputMaybe<Scalars['DateTime']['input']>;
  endFapReview?: InputMaybe<Scalars['DateTime']['input']>;
  endNotify?: InputMaybe<Scalars['DateTime']['input']>;
  endReview?: InputMaybe<Scalars['DateTime']['input']>;
  esiTemplateId?: InputMaybe<Scalars['Int']['input']>;
  experimentSafetyPdfTemplateId?: InputMaybe<Scalars['Int']['input']>;
  experimentWorkflowId?: InputMaybe<Scalars['Int']['input']>;
  fapReviewTemplateId?: InputMaybe<Scalars['Int']['input']>;
  faps?: InputMaybe<Array<Scalars['Int']['input']>>;
  id: Scalars['Int']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  proposalPdfTemplateId?: InputMaybe<Scalars['Int']['input']>;
  proposalSequence?: InputMaybe<Scalars['Int']['input']>;
  proposalWorkflowId?: InputMaybe<Scalars['Int']['input']>;
  referenceNumberFormat?: InputMaybe<Scalars['String']['input']>;
  shortCode?: InputMaybe<Scalars['String']['input']>;
  startCall?: InputMaybe<Scalars['DateTime']['input']>;
  startCycle?: InputMaybe<Scalars['DateTime']['input']>;
  startFapReview?: InputMaybe<Scalars['DateTime']['input']>;
  startNotify?: InputMaybe<Scalars['DateTime']['input']>;
  startReview?: InputMaybe<Scalars['DateTime']['input']>;
  submissionMessage?: InputMaybe<Scalars['String']['input']>;
  surveyComment?: InputMaybe<Scalars['String']['input']>;
  technicalReviewTemplateId?: InputMaybe<Scalars['Int']['input']>;
  templateId?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFapToCallInstrumentInput = {
  callId: Scalars['Int']['input'];
  fapId?: InputMaybe<Scalars['Int']['input']>;
  instrumentId: Scalars['Int']['input'];
};

export type UpdateFeaturesInput = {
  action: FeatureUpdateAction;
  featureIds: Array<FeatureId>;
};

export type UpdateInternalReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  reviewerId?: InputMaybe<Scalars['Int']['input']>;
  technicalReviewId: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type UpdateLostTimeInput = {
  endsAt: Scalars['TzLessDateTime']['input'];
  id: Scalars['Int']['input'];
  startsAt: Scalars['TzLessDateTime']['input'];
};

export type UpdatePredefinedMessageInput = {
  id: Scalars['Int']['input'];
  key: Scalars['String']['input'];
  message: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type UpdateScheduledEventInput = {
  bookingType?: InputMaybe<ScheduledEventBookingType>;
  description?: InputMaybe<Scalars['String']['input']>;
  endsAt: Scalars['TzLessDateTime']['input'];
  instrumentId?: InputMaybe<Scalars['Int']['input']>;
  localContact?: InputMaybe<Scalars['Int']['input']>;
  scheduledEventId: Scalars['Int']['input'];
  startsAt: Scalars['TzLessDateTime']['input'];
};

export type UpdateSettingsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  settingsId: SettingsId;
  settingsValue?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStatusInput = {
  description: Scalars['String']['input'];
  id: Scalars['Int']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  shortCode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateWorkflowInput = {
  description: Scalars['String']['input'];
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type User = {
  birthdate: Scalars['DateTime']['output'];
  created: Scalars['String']['output'];
  department: Scalars['String']['output'];
  email: Scalars['String']['output'];
  experiments: Array<Experiment>;
  faps: Array<Fap>;
  firstname: Scalars['String']['output'];
  gender: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  institutionId: Scalars['Int']['output'];
  instruments: Array<Instrument>;
  lastname: Scalars['String']['output'];
  oauthRefreshToken: Maybe<Scalars['String']['output']>;
  oidcSub: Maybe<Scalars['String']['output']>;
  placeholder: Scalars['Boolean']['output'];
  position: Scalars['String']['output'];
  preferredname: Maybe<Scalars['String']['output']>;
  proposals: Array<Proposal>;
  reviews: Array<Review>;
  roles: Array<Role>;
  telephone: Scalars['String']['output'];
  updated: Scalars['String']['output'];
  user_title: Scalars['String']['output'];
  username: Scalars['String']['output'];
};


export type UserExperimentsArgs = {
  filter?: InputMaybe<UserExperimentsFilter>;
};


export type UserProposalsArgs = {
  filter?: InputMaybe<UserProposalsFilter>;
};


export type UserReviewsArgs = {
  callId?: InputMaybe<Scalars['Int']['input']>;
  instrumentId?: InputMaybe<Scalars['Int']['input']>;
  reviewer?: InputMaybe<ReviewerFilter>;
  status?: InputMaybe<ReviewStatus>;
};

export type UserExperimentsFilter = {
  endsAfter?: InputMaybe<Scalars['DateTime']['input']>;
  instrumentId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Array<ExperimentStatus>>;
};

export type UserJwt = {
  created: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstname: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  institutionId: Scalars['Float']['output'];
  lastname: Scalars['String']['output'];
  oidcSub: Maybe<Scalars['String']['output']>;
  placeholder: Scalars['Boolean']['output'];
  position: Scalars['String']['output'];
  preferredname: Maybe<Scalars['String']['output']>;
};

export type UserProposalsFilter = {
  finalStatus?: InputMaybe<ProposalEndStatus>;
  instrumentId?: InputMaybe<Scalars['Int']['input']>;
  managementDecisionSubmitted?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserQueryResult = {
  totalCount: Scalars['Int']['output'];
  users: Array<BasicUserDetails>;
};

export enum UserRole {
  EXPERIMENT_SAFETY_REVIEWER = 'EXPERIMENT_SAFETY_REVIEWER',
  FAP_CHAIR = 'FAP_CHAIR',
  FAP_REVIEWER = 'FAP_REVIEWER',
  FAP_SECRETARY = 'FAP_SECRETARY',
  INSTRUMENT_SCIENTIST = 'INSTRUMENT_SCIENTIST',
  INTERNAL_REVIEWER = 'INTERNAL_REVIEWER',
  USER = 'USER',
  USER_OFFICER = 'USER_OFFICER'
}

export type Visit = {
  creatorId: Scalars['Int']['output'];
  experimentPk: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  proposal: Proposal;
  proposalPk: Scalars['Int']['output'];
  registrations: Array<VisitRegistration>;
  samples: Array<Sample>;
  teamLead: BasicUserDetails;
  teamLeadUserId: Scalars['Int']['output'];
};

export type VisitBasisConfig = {
  readPermissions: Array<Scalars['String']['output']>;
  required: Scalars['Boolean']['output'];
  small_label: Scalars['String']['output'];
  tooltip: Scalars['String']['output'];
};

export type VisitRegistration = {
  endsAt: Maybe<Scalars['DateTime']['output']>;
  questionary: Questionary;
  registrationQuestionaryId: Maybe<Scalars['Int']['output']>;
  startsAt: Maybe<Scalars['DateTime']['output']>;
  status: VisitRegistrationStatus;
  user: Maybe<BasicUserDetails>;
  userId: Scalars['Int']['output'];
  visitId: Scalars['Int']['output'];
};

export enum VisitRegistrationStatus {
  APPROVED = 'APPROVED',
  CANCELLED_BY_FACILITY = 'CANCELLED_BY_FACILITY',
  CANCELLED_BY_USER = 'CANCELLED_BY_USER',
  CHANGE_REQUESTED = 'CHANGE_REQUESTED',
  DRAFTED = 'DRAFTED',
  SUBMITTED = 'SUBMITTED'
}

export type VisitsFilter = {
  creatorId?: InputMaybe<Scalars['Int']['input']>;
  experimentPk?: InputMaybe<Scalars['Int']['input']>;
  proposalPk?: InputMaybe<Scalars['Int']['input']>;
};

export type Workflow = {
  description: Scalars['String']['output'];
  entityType: WorkflowType;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  workflowConnectionGroups: Array<WorkflowConnectionGroup>;
};

export type WorkflowConnection = {
  droppableGroupId: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  nextStatusId: Maybe<Scalars['Int']['output']>;
  prevStatusId: Maybe<Scalars['Int']['output']>;
  sortOrder: Scalars['Int']['output'];
  status: Status;
  statusActions: Maybe<Array<ConnectionStatusAction>>;
  statusChangingEvents: Maybe<Array<StatusChangingEvent>>;
  statusId: Scalars['Int']['output'];
  workflowId: Scalars['Int']['output'];
};

export type WorkflowConnectionGroup = {
  connections: Array<WorkflowConnection>;
  groupId: Scalars['String']['output'];
  parentGroupId: Maybe<Scalars['String']['output']>;
};

export type WorkflowEvent = {
  description: Maybe<Scalars['String']['output']>;
  name: Event;
};

export enum WorkflowType {
  EXPERIMENT = 'EXPERIMENT',
  PROPOSAL = 'PROPOSAL'
}

export type GetAccessTokenAndPermissionsQueryVariables = Exact<{
  accessTokenId: Scalars['String']['input'];
}>;


export type GetAccessTokenAndPermissionsQuery = { accessTokenAndPermissions: { id: string, accessPermissions: string } | null };

export type InstrumentScientistHasAccessQueryVariables = Exact<{
  proposalPk: Scalars['Int']['input'];
  instrumentId: Scalars['Int']['input'];
}>;


export type InstrumentScientistHasAccessQuery = { instrumentScientistHasAccess: boolean | null };

export type InstrumentScientistHasInstrumentQueryVariables = Exact<{
  instrumentId: Scalars['Int']['input'];
}>;


export type InstrumentScientistHasInstrumentQuery = { instrumentScientistHasInstrument: boolean | null };

export type UserInstrumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserInstrumentsQuery = { userInstruments: { instruments: Array<{ id: number }> } | null };

export type UserHasAccessQueryVariables = Exact<{
  proposalPk: Scalars['Int']['input'];
}>;


export type UserHasAccessQuery = { userHasAccessToProposal: boolean | null };


export const GetAccessTokenAndPermissionsDocument = gql`
    query getAccessTokenAndPermissions($accessTokenId: String!) {
  accessTokenAndPermissions(accessTokenId: $accessTokenId) {
    id
    accessPermissions
  }
}
    `;
export const InstrumentScientistHasAccessDocument = gql`
    query instrumentScientistHasAccess($proposalPk: Int!, $instrumentId: Int!) {
  instrumentScientistHasAccess(
    proposalPk: $proposalPk
    instrumentId: $instrumentId
  )
}
    `;
export const InstrumentScientistHasInstrumentDocument = gql`
    query instrumentScientistHasInstrument($instrumentId: Int!) {
  instrumentScientistHasInstrument(instrumentId: $instrumentId)
}
    `;
export const UserInstrumentsDocument = gql`
    query userInstruments {
  userInstruments {
    instruments {
      id
    }
  }
}
    `;
export const UserHasAccessDocument = gql`
    query userHasAccess($proposalPk: Int!) {
  userHasAccessToProposal(proposalPk: $proposalPk)
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getAccessTokenAndPermissions(variables: GetAccessTokenAndPermissionsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetAccessTokenAndPermissionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAccessTokenAndPermissionsQuery>(GetAccessTokenAndPermissionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAccessTokenAndPermissions', 'query');
    },
    instrumentScientistHasAccess(variables: InstrumentScientistHasAccessQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<InstrumentScientistHasAccessQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<InstrumentScientistHasAccessQuery>(InstrumentScientistHasAccessDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'instrumentScientistHasAccess', 'query');
    },
    instrumentScientistHasInstrument(variables: InstrumentScientistHasInstrumentQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<InstrumentScientistHasInstrumentQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<InstrumentScientistHasInstrumentQuery>(InstrumentScientistHasInstrumentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'instrumentScientistHasInstrument', 'query');
    },
    userInstruments(variables?: UserInstrumentsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UserInstrumentsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserInstrumentsQuery>(UserInstrumentsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'userInstruments', 'query');
    },
    userHasAccess(variables: UserHasAccessQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UserHasAccessQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserHasAccessQuery>(UserHasAccessDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'userHasAccess', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;