import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  DateTime: any;
  IntStringDateBoolArray: any;
  _Any: any;
  _FieldSet: any;
};

export type AddProposalWorkflowStatusInput = {
  droppableGroupId: Scalars['String'];
  nextProposalStatusId?: InputMaybe<Scalars['Int']>;
  parentDroppableGroupId?: InputMaybe<Scalars['String']>;
  prevProposalStatusId?: InputMaybe<Scalars['Int']>;
  proposalStatusId: Scalars['Int'];
  proposalWorkflowId: Scalars['Int'];
  sortOrder: Scalars['Int'];
};

export type AddStatusChangingEventsToConnectionInput = {
  proposalWorkflowConnectionId: Scalars['Int'];
  statusChangingEvents: Array<Scalars['String']>;
};

export type AddTechnicalReviewInput = {
  comment?: InputMaybe<Scalars['String']>;
  files?: InputMaybe<Scalars['String']>;
  proposalPk: Scalars['Int'];
  publicComment?: InputMaybe<Scalars['String']>;
  reviewerId?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<TechnicalReviewStatus>;
  submitted?: InputMaybe<Scalars['Boolean']>;
  timeAllocation?: InputMaybe<Scalars['Int']>;
};

export enum AllocationTimeUnits {
  DAY = 'Day',
  HOUR = 'Hour'
}

export type Answer = {
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
  answer: Scalars['IntStringDateBoolArray'];
  answerId: Maybe<Scalars['Int']>;
  createdAt: Scalars['DateTime'];
  questionId: Scalars['String'];
  questionaryId: Scalars['Int'];
};

export type AnswerInput = {
  questionId: Scalars['String'];
  value?: InputMaybe<Scalars['String']>;
};

export type AssignChairOrSecretaryToSepInput = {
  roleId: UserRole;
  sepId: Scalars['Int'];
  userId: Scalars['Int'];
};

export type AssignInstrumentsToCallInput = {
  callId: Scalars['Int'];
  instrumentIds: Array<Scalars['Int']>;
};

export type AuthJwtApiTokenPayload = {
  accessTokenId: Scalars['String'];
};

export type AuthJwtPayload = {
  currentRole: Role;
  roles: Array<Role>;
  user: UserJwt;
};

export type BasicUserDetails = {
  created: Maybe<Scalars['DateTime']>;
  email: Maybe<Scalars['String']>;
  firstname: Scalars['String'];
  id: Scalars['Int'];
  lastname: Scalars['String'];
  organisation: Scalars['String'];
  organizationId: Scalars['Int'];
  placeholder: Maybe<Scalars['Boolean']>;
  position: Scalars['String'];
  preferredname: Maybe<Scalars['String']>;
};

export type BooleanConfig = {
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
};

export type Call = {
  allocationTimeUnit: AllocationTimeUnits;
  cycleComment: Scalars['String'];
  description: Maybe<Scalars['String']>;
  endCall: Scalars['DateTime'];
  endCallInternal: Maybe<Scalars['DateTime']>;
  endCycle: Scalars['DateTime'];
  endNotify: Scalars['DateTime'];
  endReview: Scalars['DateTime'];
  endSEPReview: Maybe<Scalars['DateTime']>;
  esiTemplateId: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  instruments: Array<InstrumentWithAvailabilityTime>;
  isActive: Scalars['Boolean'];
  isActiveInternal: Scalars['Boolean'];
  pdfTemplateId: Maybe<Scalars['Int']>;
  proposalCount: Scalars['Int'];
  proposalSequence: Maybe<Scalars['Int']>;
  proposalWorkflow: Maybe<ProposalWorkflow>;
  proposalWorkflowId: Maybe<Scalars['Int']>;
  referenceNumberFormat: Maybe<Scalars['String']>;
  seps: Maybe<Array<Sep>>;
  shortCode: Scalars['String'];
  startCall: Scalars['DateTime'];
  startCycle: Scalars['DateTime'];
  startNotify: Scalars['DateTime'];
  startReview: Scalars['DateTime'];
  startSEPReview: Maybe<Scalars['DateTime']>;
  submissionMessage: Maybe<Scalars['String']>;
  surveyComment: Scalars['String'];
  template: Template;
  templateId: Scalars['Int'];
  title: Maybe<Scalars['String']>;
};

export type CallsFilter = {
  isActive?: InputMaybe<Scalars['Boolean']>;
  isActiveInternal?: InputMaybe<Scalars['Boolean']>;
  isCallEndedByEvent?: InputMaybe<Scalars['Boolean']>;
  isEnded?: InputMaybe<Scalars['Boolean']>;
  isEndedInternal?: InputMaybe<Scalars['Boolean']>;
  isReviewEnded?: InputMaybe<Scalars['Boolean']>;
  isSEPReviewEnded?: InputMaybe<Scalars['Boolean']>;
  sepIds?: InputMaybe<Array<Scalars['Int']>>;
  templateIds?: InputMaybe<Array<Scalars['Int']>>;
};

export type ChangeProposalsStatusInput = {
  proposals: Array<ProposalPkWithCallId>;
  statusId: Scalars['Int'];
};

export type CloneProposalsInput = {
  callId: Scalars['Int'];
  proposalsToClonePk: Array<Scalars['Int']>;
};

export type ConflictResolution = {
  itemId: Scalars['String'];
  strategy: ConflictResolutionStrategy;
};

export enum ConflictResolutionStrategy {
  UNRESOLVED = 'UNRESOLVED',
  USE_EXISTING = 'USE_EXISTING',
  USE_NEW = 'USE_NEW'
}

export type CreateApiAccessTokenInput = {
  accessPermissions: Scalars['String'];
  name: Scalars['String'];
};

export type CreateCallInput = {
  allocationTimeUnit: AllocationTimeUnits;
  cycleComment: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  endCall: Scalars['DateTime'];
  endCallInternal?: InputMaybe<Scalars['DateTime']>;
  endCycle: Scalars['DateTime'];
  endNotify: Scalars['DateTime'];
  endReview: Scalars['DateTime'];
  endSEPReview?: InputMaybe<Scalars['DateTime']>;
  esiTemplateId?: InputMaybe<Scalars['Int']>;
  pdfTemplateId?: InputMaybe<Scalars['Int']>;
  proposalSequence?: InputMaybe<Scalars['Int']>;
  proposalWorkflowId: Scalars['Int'];
  referenceNumberFormat?: InputMaybe<Scalars['String']>;
  seps?: InputMaybe<Array<Scalars['Int']>>;
  shortCode: Scalars['String'];
  startCall: Scalars['DateTime'];
  startCycle: Scalars['DateTime'];
  startNotify: Scalars['DateTime'];
  startReview: Scalars['DateTime'];
  startSEPReview?: InputMaybe<Scalars['DateTime']>;
  submissionMessage?: InputMaybe<Scalars['String']>;
  surveyComment: Scalars['String'];
  templateId: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
};

export type CreatePredefinedMessageInput = {
  key: Scalars['String'];
  message: Scalars['String'];
  title: Scalars['String'];
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

export enum DataType {
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  DYNAMIC_MULTIPLE_CHOICE = 'DYNAMIC_MULTIPLE_CHOICE',
  EMBELLISHMENT = 'EMBELLISHMENT',
  FEEDBACK_BASIS = 'FEEDBACK_BASIS',
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
  defaultDate: Maybe<Scalars['String']>;
  includeTime: Scalars['Boolean'];
  maxDate: Maybe<Scalars['String']>;
  minDate: Maybe<Scalars['String']>;
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
};

export type DeleteApiAccessTokenInput = {
  accessTokenId: Scalars['String'];
};

export type DeletePredefinedMessageInput = {
  id: Scalars['Int'];
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

export type DynamicMultipleChoiceConfig = {
  isMultipleSelect: Scalars['Boolean'];
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
  url: Scalars['String'];
  variant: Scalars['String'];
};

export type EmbellishmentConfig = {
  html: Scalars['String'];
  omitFromPdf: Scalars['Boolean'];
  plain: Scalars['String'];
};

export type Entry = {
  id: Scalars['Int'];
  value: Scalars['String'];
};

export enum EvaluatorOperator {
  EQ = 'eq',
  NEQ = 'neq'
}

export enum Event {
  CALL_CREATED = 'CALL_CREATED',
  CALL_ENDED = 'CALL_ENDED',
  CALL_ENDED_INTERNAL = 'CALL_ENDED_INTERNAL',
  CALL_REVIEW_ENDED = 'CALL_REVIEW_ENDED',
  CALL_SEP_REVIEW_ENDED = 'CALL_SEP_REVIEW_ENDED',
  EMAIL_INVITE = 'EMAIL_INVITE',
  INSTRUMENT_CREATED = 'INSTRUMENT_CREATED',
  INSTRUMENT_DELETED = 'INSTRUMENT_DELETED',
  INSTRUMENT_UPDATED = 'INSTRUMENT_UPDATED',
  PREDEFINED_MESSAGE_CREATED = 'PREDEFINED_MESSAGE_CREATED',
  PREDEFINED_MESSAGE_DELETED = 'PREDEFINED_MESSAGE_DELETED',
  PREDEFINED_MESSAGE_UPDATED = 'PREDEFINED_MESSAGE_UPDATED',
  PROPOSAL_ACCEPTED = 'PROPOSAL_ACCEPTED',
  PROPOSAL_ALL_SEP_REVIEWERS_SELECTED = 'PROPOSAL_ALL_SEP_REVIEWERS_SELECTED',
  PROPOSAL_ALL_SEP_REVIEWS_SUBMITTED = 'PROPOSAL_ALL_SEP_REVIEWS_SUBMITTED',
  PROPOSAL_BOOKING_TIME_ACTIVATED = 'PROPOSAL_BOOKING_TIME_ACTIVATED',
  PROPOSAL_BOOKING_TIME_COMPLETED = 'PROPOSAL_BOOKING_TIME_COMPLETED',
  PROPOSAL_BOOKING_TIME_REOPENED = 'PROPOSAL_BOOKING_TIME_REOPENED',
  PROPOSAL_BOOKING_TIME_SLOTS_REMOVED = 'PROPOSAL_BOOKING_TIME_SLOTS_REMOVED',
  PROPOSAL_BOOKING_TIME_SLOT_ADDED = 'PROPOSAL_BOOKING_TIME_SLOT_ADDED',
  PROPOSAL_BOOKING_TIME_UPDATED = 'PROPOSAL_BOOKING_TIME_UPDATED',
  PROPOSAL_CLONED = 'PROPOSAL_CLONED',
  PROPOSAL_CREATED = 'PROPOSAL_CREATED',
  PROPOSAL_DELETED = 'PROPOSAL_DELETED',
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
  SEP_REVIEWER_NOTIFIED = 'SEP_REVIEWER_NOTIFIED',
  SEP_UPDATED = 'SEP_UPDATED',
  TOPIC_ANSWERED = 'TOPIC_ANSWERED',
  USER_CREATED = 'USER_CREATED',
  USER_DELETED = 'USER_DELETED',
  USER_PASSWORD_RESET_EMAIL = 'USER_PASSWORD_RESET_EMAIL',
  USER_ROLE_UPDATED = 'USER_ROLE_UPDATED',
  USER_UPDATED = 'USER_UPDATED'
}

export type EventLog = {
  changedBy: User;
  changedObjectId: Scalars['String'];
  eventTStamp: Scalars['DateTime'];
  eventType: Scalars['String'];
  id: Scalars['Int'];
  rowData: Scalars['String'];
};

export type ExperimentSafetyInput = {
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

export type ExternalTokenResult = {
  isValid: Scalars['Boolean'];
};

export type Feature = {
  description: Scalars['String'];
  id: FeatureId;
  isEnabled: Scalars['Boolean'];
};

export enum FeatureId {
  EMAIL_INVITE = 'EMAIL_INVITE',
  EMAIL_SEARCH = 'EMAIL_SEARCH',
  INSTRUMENT_MANAGEMENT = 'INSTRUMENT_MANAGEMENT',
  OAUTH = 'OAUTH',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  SAMPLE_SAFETY = 'SAMPLE_SAFETY',
  SCHEDULER = 'SCHEDULER',
  SEP_REVIEW = 'SEP_REVIEW',
  SHIPPING = 'SHIPPING',
  STFC_IDLE_TIMER = 'STFC_IDLE_TIMER',
  TECHNICAL_REVIEW = 'TECHNICAL_REVIEW',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  VISIT_MANAGEMENT = 'VISIT_MANAGEMENT'
}

export enum FeatureUpdateAction {
  DISABLE = 'DISABLE',
  ENABLE = 'ENABLE'
}

export type Feedback = {
  createdAt: Scalars['DateTime'];
  creatorId: Scalars['Int'];
  id: Scalars['Int'];
  questionary: Questionary;
  questionaryId: Scalars['Int'];
  scheduledEventId: Scalars['Int'];
  status: FeedbackStatus;
  submittedAt: Maybe<Scalars['DateTime']>;
};

export type FeedbackBasisConfig = {
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
};

export type FeedbackRequest = {
  id: Scalars['Int'];
  requestedAt: Scalars['DateTime'];
  scheduledEventId: Scalars['Int'];
};

export enum FeedbackStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED'
}

export type FeedbacksFilter = {
  creatorId?: InputMaybe<Scalars['Int']>;
  scheduledEventId?: InputMaybe<Scalars['Int']>;
};

export type FieldCondition = {
  condition: EvaluatorOperator;
  params: Scalars['IntStringDateBoolArray'];
};

export type FieldConditionInput = {
  condition: EvaluatorOperator;
  params: Scalars['String'];
};

export type FieldConfig = BooleanConfig | DateConfig | DynamicMultipleChoiceConfig | EmbellishmentConfig | FeedbackBasisConfig | FileUploadConfig | GenericTemplateBasisConfig | IntervalConfig | NumberInputConfig | ProposalBasisConfig | ProposalEsiBasisConfig | RichTextInputConfig | SampleBasisConfig | SampleDeclarationConfig | SampleEsiBasisConfig | SelectionFromOptionsConfig | ShipmentBasisConfig | SubTemplateConfig | TextInputConfig | VisitBasisConfig;

export type FieldDependency = {
  condition: FieldCondition;
  dependencyId: Scalars['String'];
  dependencyNaturalKey: Scalars['String'];
  questionId: Scalars['String'];
};

export type FieldDependencyInput = {
  condition: FieldConditionInput;
  dependencyId: Scalars['String'];
};

export type FileMetadata = {
  createdDate: Scalars['DateTime'];
  fileId: Scalars['String'];
  mimeType: Scalars['String'];
  originalFileName: Scalars['String'];
  sizeInBytes: Scalars['Int'];
};

export type FileUploadConfig = {
  file_type: Array<Scalars['String']>;
  max_files: Scalars['Int'];
  pdf_page_limit: Scalars['Int'];
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
};

export type FilesMetadataFilter = {
  fileIds: Array<Scalars['String']>;
};

export type GenericTemplate = {
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
  questionLabel: Scalars['String'];
  titlePlaceholder: Scalars['String'];
};

export type GenericTemplatesFilter = {
  creatorId?: InputMaybe<Scalars['Int']>;
  genericTemplateIds?: InputMaybe<Array<Scalars['Int']>>;
  proposalPk?: InputMaybe<Scalars['Int']>;
  questionId?: InputMaybe<Scalars['String']>;
  questionaryIds?: InputMaybe<Array<Scalars['Int']>>;
  title?: InputMaybe<Scalars['String']>;
};

export type IndexWithGroupId = {
  droppableId: Scalars['String'];
  index: Scalars['Int'];
};

export type Institution = {
  country: Maybe<Entry>;
  id: Scalars['Int'];
  name: Scalars['String'];
  verified: Scalars['Boolean'];
};

export type InstitutionsFilter = {
  isVerified?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
};

export type Instrument = {
  beamlineManager: Maybe<BasicUserDetails>;
  description: Scalars['String'];
  id: Scalars['Int'];
  managerUserId: Scalars['Int'];
  name: Scalars['String'];
  scientists: Array<BasicUserDetails>;
  shortCode: Scalars['String'];
};

export type InstrumentWithAvailabilityTime = {
  availabilityTime: Maybe<Scalars['Int']>;
  beamlineManager: Maybe<BasicUserDetails>;
  description: Scalars['String'];
  id: Scalars['Int'];
  managerUserId: Scalars['Int'];
  name: Scalars['String'];
  scientists: Array<BasicUserDetails>;
  shortCode: Scalars['String'];
  submitted: Scalars['Boolean'];
};

export type InstrumentsQueryResult = {
  instruments: Array<Instrument>;
  totalCount: Scalars['Int'];
};

export type IntervalConfig = {
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
  units: Array<Unit>;
};

export type MoveProposalWorkflowStatusInput = {
  from: IndexWithGroupId;
  proposalWorkflowId: Scalars['Int'];
  to: IndexWithGroupId;
};

export type Mutation = {
  addClientLog: Scalars['Boolean'];
  addProposalWorkflowStatus: ProposalWorkflowConnection;
  addSamplesToShipment: Shipment;
  addStatusChangingEventsToConnection: Array<StatusChangingEvent>;
  addTechnicalReview: TechnicalReview;
  addUserForReview: Review;
  addUserRole: Scalars['Boolean'];
  administrationProposal: Proposal;
  answerTopic: QuestionaryStep;
  applyPatches: Scalars['String'];
  assignChairOrSecretary: Sep;
  assignInstrumentsToCall: Call;
  assignProposalsToInstrument: Scalars['Boolean'];
  assignProposalsToSep: Scalars['Boolean'];
  assignReviewersToSEP: Sep;
  assignScientistsToInstrument: Scalars['Boolean'];
  assignSepReviewersToProposal: Sep;
  changeProposalsStatus: Scalars['Boolean'];
  cloneGenericTemplate: GenericTemplate;
  cloneProposals: Array<Proposal>;
  cloneSample: Sample;
  cloneSampleEsi: SampleExperimentSafetyInput;
  cloneTemplate: Template;
  createApiAccessToken: PermissionsWithAccessToken;
  createCall: Call;
  createEsi: ExperimentSafetyInput;
  createFeedback: Feedback;
  createGenericTemplate: GenericTemplate;
  createInstitution: Institution;
  createInstrument: Instrument;
  createPdfTemplate: PdfTemplate;
  createPredefinedMessage: PredefinedMessage;
  createProposal: Proposal;
  createProposalStatus: ProposalStatus;
  createProposalWorkflow: ProposalWorkflow;
  createQuestion: Question;
  createQuestionTemplateRelation: Template;
  createQuestionary: Questionary;
  createSEP: Sep;
  createSample: Sample;
  createSampleEsi: SampleExperimentSafetyInput;
  createShipment: Shipment;
  createTemplate: Template;
  createTopic: Template;
  createUnit: Unit;
  createUser: User;
  createUserByEmailInvite: Scalars['Int'];
  createVisit: Visit;
  createVisitRegistration: VisitRegistration;
  deleteApiAccessToken: Scalars['Boolean'];
  deleteCall: Call;
  deleteFeedback: Feedback;
  deleteGenericTemplate: GenericTemplate;
  deleteInstitution: Institution;
  deleteInstrument: Instrument;
  deletePdfTemplate: PdfTemplate;
  deletePredefinedMessage: PredefinedMessage;
  deleteProposal: Proposal;
  deleteProposalStatus: ProposalStatus;
  deleteProposalWorkflow: ProposalWorkflow;
  deleteProposalWorkflowStatus: Scalars['Boolean'];
  deleteQuestion: Question;
  deleteQuestionTemplateRelation: Template;
  deleteSEP: Sep;
  deleteSample: Sample;
  deleteSampleEsi: SampleExperimentSafetyInput;
  deleteShipment: Shipment;
  deleteTemplate: Template;
  deleteTopic: Template;
  deleteUnit: Unit;
  deleteUser: User;
  deleteVisit: Visit;
  emailVerification: Scalars['Boolean'];
  externalTokenLogin: Scalars['String'];
  getTokenForUser: Scalars['String'];
  importProposal: Proposal;
  importTemplate: Template;
  importUnits: Array<Unit>;
  logout: Scalars['String'];
  mergeInstitutions: Institution;
  moveProposalWorkflowStatus: ProposalWorkflowConnection;
  notifyProposal: Proposal;
  prepareDB: Scalars['String'];
  removeAssignedInstrumentFromCall: Call;
  removeMemberFromSEPProposal: Sep;
  removeMemberFromSep: Sep;
  removeProposalsFromInstrument: Scalars['Boolean'];
  removeProposalsFromSep: Sep;
  removeScientistFromInstrument: Scalars['Boolean'];
  removeUserForReview: Review;
  reorderSepMeetingDecisionProposals: SepMeetingDecision;
  requestFeedback: FeedbackRequest;
  resetPassword: BasicUserDetails;
  resetPasswordEmail: Scalars['Boolean'];
  saveSepMeetingDecision: SepMeetingDecision;
  selectRole: Scalars['String'];
  setActiveTemplate: Scalars['Boolean'];
  setInstrumentAvailabilityTime: Scalars['Boolean'];
  setPageContent: Page;
  setUserEmailVerified: User;
  setUserNotPlaceholder: User;
  submitInstrument: Scalars['Boolean'];
  submitProposal: Proposal;
  submitProposalsReview: Scalars['Boolean'];
  submitShipment: Shipment;
  submitTechnicalReviews: Scalars['Boolean'];
  token: Scalars['String'];
  updateAnswer: Scalars['String'];
  updateApiAccessToken: PermissionsWithAccessToken;
  updateCall: Call;
  updateEsi: ExperimentSafetyInput;
  updateFeatures: Array<Feature>;
  updateFeedback: Feedback;
  updateGenericTemplate: GenericTemplate;
  updateInstitution: Institution;
  updateInstrument: Instrument;
  updatePassword: BasicUserDetails;
  updatePdfTemplate: PdfTemplate;
  updatePredefinedMessage: PredefinedMessage;
  updateProposal: Proposal;
  updateProposalStatus: ProposalStatus;
  updateProposalWorkflow: ProposalWorkflow;
  updateQuestion: Question;
  updateQuestionTemplateRelation: Template;
  updateQuestionTemplateRelationSettings: Template;
  updateReview: Review;
  updateSEP: Sep;
  updateSEPTimeAllocation: SepProposal;
  updateSample: Sample;
  updateSampleEsi: SampleExperimentSafetyInput;
  updateSettings: Settings;
  updateShipment: Shipment;
  updateTechnicalReviewAssignee: Array<TechnicalReview>;
  updateTemplate: Template;
  updateTopic: Template;
  updateUser: User;
  updateUserRoles: User;
  updateVisit: Visit;
  updateVisitRegistration: VisitRegistration;
  validateTemplateImport: TemplateValidation;
  validateUnitsImport: UnitsImportWithValidation;
};


export type MutationAddClientLogArgs = {
  error: Scalars['String'];
};


export type MutationAddProposalWorkflowStatusArgs = {
  newProposalWorkflowStatusInput: AddProposalWorkflowStatusInput;
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
  commentForManagement?: InputMaybe<Scalars['String']>;
  commentForUser?: InputMaybe<Scalars['String']>;
  finalStatus?: InputMaybe<ProposalEndStatus>;
  managementDecisionSubmitted?: InputMaybe<Scalars['Boolean']>;
  managementTimeAllocation?: InputMaybe<Scalars['Int']>;
  proposalPk: Scalars['Int'];
  statusId?: InputMaybe<Scalars['Int']>;
};


export type MutationAnswerTopicArgs = {
  answers: Array<AnswerInput>;
  isPartialSave?: InputMaybe<Scalars['Boolean']>;
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


export type MutationChangeProposalsStatusArgs = {
  changeProposalsStatusInput: ChangeProposalsStatusInput;
};


export type MutationCloneGenericTemplateArgs = {
  genericTemplateId: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
};


export type MutationCloneProposalsArgs = {
  cloneProposalsInput: CloneProposalsInput;
};


export type MutationCloneSampleArgs = {
  isPostProposalSubmission?: InputMaybe<Scalars['Boolean']>;
  sampleId: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
};


export type MutationCloneSampleEsiArgs = {
  esiId: Scalars['Int'];
  newSampleTitle?: InputMaybe<Scalars['String']>;
  sampleId: Scalars['Int'];
};


export type MutationCloneTemplateArgs = {
  templateId: Scalars['Int'];
};


export type MutationCreateApiAccessTokenArgs = {
  createApiAccessTokenInput: CreateApiAccessTokenInput;
};


export type MutationCreateCallArgs = {
  createCallInput: CreateCallInput;
};


export type MutationCreateEsiArgs = {
  scheduledEventId: Scalars['Int'];
};


export type MutationCreateFeedbackArgs = {
  scheduledEventId: Scalars['Int'];
};


export type MutationCreateGenericTemplateArgs = {
  proposalPk: Scalars['Int'];
  questionId: Scalars['String'];
  templateId: Scalars['Int'];
  title: Scalars['String'];
};


export type MutationCreateInstitutionArgs = {
  country: Scalars['Int'];
  name: Scalars['String'];
  verified: Scalars['Boolean'];
};


export type MutationCreateInstrumentArgs = {
  description: Scalars['String'];
  managerUserId: Scalars['Int'];
  name: Scalars['String'];
  shortCode: Scalars['String'];
};


export type MutationCreatePdfTemplateArgs = {
  templateData: Scalars['String'];
  templateId: Scalars['Int'];
};


export type MutationCreatePredefinedMessageArgs = {
  createPredefinedMessageInput: CreatePredefinedMessageInput;
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
  numberRatingsRequired?: Scalars['Int'];
};


export type MutationCreateSampleArgs = {
  isPostProposalSubmission?: InputMaybe<Scalars['Boolean']>;
  proposalPk: Scalars['Int'];
  questionId: Scalars['String'];
  templateId: Scalars['Int'];
  title: Scalars['String'];
};


export type MutationCreateSampleEsiArgs = {
  esiId: Scalars['Int'];
  sampleId: Scalars['Int'];
};


export type MutationCreateShipmentArgs = {
  proposalPk: Scalars['Int'];
  scheduledEventId: Scalars['Int'];
  title: Scalars['String'];
};


export type MutationCreateTemplateArgs = {
  description?: InputMaybe<Scalars['String']>;
  groupId: TemplateGroupId;
  name: Scalars['String'];
};


export type MutationCreateTopicArgs = {
  sortOrder?: InputMaybe<Scalars['Int']>;
  templateId: Scalars['Int'];
  title?: InputMaybe<Scalars['Int']>;
};


export type MutationCreateUnitArgs = {
  id: Scalars['String'];
  quantity: Scalars['String'];
  siConversionFormula: Scalars['String'];
  symbol: Scalars['String'];
  unit: Scalars['String'];
};


export type MutationCreateUserArgs = {
  birthdate: Scalars['DateTime'];
  department: Scalars['String'];
  email: Scalars['String'];
  firstname: Scalars['String'];
  gender: Scalars['String'];
  lastname: Scalars['String'];
  middlename?: InputMaybe<Scalars['String']>;
  nationality: Scalars['Int'];
  organisation: Scalars['Int'];
  organizationCountry?: InputMaybe<Scalars['Int']>;
  otherOrganisation?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  position: Scalars['String'];
  preferredname?: InputMaybe<Scalars['String']>;
  telephone: Scalars['String'];
  telephone_alt?: InputMaybe<Scalars['String']>;
  user_title?: InputMaybe<Scalars['String']>;
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


export type MutationCreateVisitRegistrationArgs = {
  visitId: Scalars['Int'];
};


export type MutationDeleteApiAccessTokenArgs = {
  deleteApiAccessTokenInput: DeleteApiAccessTokenInput;
};


export type MutationDeleteCallArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteFeedbackArgs = {
  feedbackId: Scalars['Int'];
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


export type MutationDeletePdfTemplateArgs = {
  pdfTemplateId: Scalars['Int'];
};


export type MutationDeletePredefinedMessageArgs = {
  deletePredefinedMessageInput: DeletePredefinedMessageInput;
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
  id: Scalars['String'];
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


export type MutationExternalTokenLoginArgs = {
  externalToken: Scalars['String'];
  redirectUri: Scalars['String'];
};


export type MutationGetTokenForUserArgs = {
  userId: Scalars['Int'];
};


export type MutationImportProposalArgs = {
  abstract?: InputMaybe<Scalars['String']>;
  callId: Scalars['Int'];
  proposerId?: InputMaybe<Scalars['Int']>;
  referenceNumber: Scalars['Int'];
  submitterId: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
  users?: InputMaybe<Array<Scalars['Int']>>;
};


export type MutationImportTemplateArgs = {
  conflictResolutions: Array<ConflictResolution>;
  subTemplatesConflictResolutions: Array<Array<ConflictResolution>>;
  templateAsJson: Scalars['String'];
};


export type MutationImportUnitsArgs = {
  conflictResolutions: Array<ConflictResolution>;
  json: Scalars['String'];
};


export type MutationLogoutArgs = {
  token: Scalars['String'];
};


export type MutationMergeInstitutionsArgs = {
  institutionIdFrom: Scalars['Int'];
  institutionIdInto: Scalars['Int'];
  newTitle: Scalars['String'];
};


export type MutationMoveProposalWorkflowStatusArgs = {
  moveProposalWorkflowStatusInput: MoveProposalWorkflowStatusInput;
};


export type MutationNotifyProposalArgs = {
  proposalPk: Scalars['Int'];
};


export type MutationPrepareDbArgs = {
  includeSeeds?: InputMaybe<Scalars['Boolean']>;
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


export type MutationRequestFeedbackArgs = {
  scheduledEventId: Scalars['Int'];
};


export type MutationResetPasswordArgs = {
  password: Scalars['String'];
  token: Scalars['String'];
};


export type MutationResetPasswordEmailArgs = {
  email: Scalars['String'];
};


export type MutationSaveSepMeetingDecisionArgs = {
  saveSepMeetingDecisionInput: SaveSepMeetingDecisionInput;
};


export type MutationSelectRoleArgs = {
  selectedRoleId?: InputMaybe<Scalars['Int']>;
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


export type MutationSubmitTechnicalReviewsArgs = {
  submitTechnicalReviewsInput: SubmitTechnicalReviewsInput;
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


export type MutationUpdateEsiArgs = {
  esiId: Scalars['Int'];
  isSubmitted?: InputMaybe<Scalars['Boolean']>;
};


export type MutationUpdateFeaturesArgs = {
  updatedFeaturesInput: UpdateFeaturesInput;
};


export type MutationUpdateFeedbackArgs = {
  feedbackId: Scalars['Int'];
  status?: InputMaybe<FeedbackStatus>;
};


export type MutationUpdateGenericTemplateArgs = {
  genericTemplateId: Scalars['Int'];
  safetyComment?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateInstitutionArgs = {
  country: Scalars['Int'];
  id: Scalars['Int'];
  name?: InputMaybe<Scalars['String']>;
  verified?: InputMaybe<Scalars['Boolean']>;
};


export type MutationUpdateInstrumentArgs = {
  description: Scalars['String'];
  id: Scalars['Int'];
  managerUserId: Scalars['Int'];
  name: Scalars['String'];
  shortCode: Scalars['String'];
};


export type MutationUpdatePasswordArgs = {
  id: Scalars['Int'];
  password: Scalars['String'];
};


export type MutationUpdatePdfTemplateArgs = {
  pdfTemplateId: Scalars['Int'];
  templateData?: InputMaybe<Scalars['String']>;
};


export type MutationUpdatePredefinedMessageArgs = {
  updatePredefinedMessageInput: UpdatePredefinedMessageInput;
};


export type MutationUpdateProposalArgs = {
  abstract?: InputMaybe<Scalars['String']>;
  proposalPk: Scalars['Int'];
  proposerId?: InputMaybe<Scalars['Int']>;
  title?: InputMaybe<Scalars['String']>;
  users?: InputMaybe<Array<Scalars['Int']>>;
};


export type MutationUpdateProposalStatusArgs = {
  updatedProposalStatusInput: UpdateProposalStatusInput;
};


export type MutationUpdateProposalWorkflowArgs = {
  updatedProposalWorkflowInput: UpdateProposalWorkflowInput;
};


export type MutationUpdateQuestionArgs = {
  config?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  naturalKey?: InputMaybe<Scalars['String']>;
  question?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateQuestionTemplateRelationArgs = {
  config?: InputMaybe<Scalars['String']>;
  questionId: Scalars['String'];
  sortOrder: Scalars['Int'];
  templateId: Scalars['Int'];
  topicId?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateQuestionTemplateRelationSettingsArgs = {
  config?: InputMaybe<Scalars['String']>;
  dependencies: Array<FieldDependencyInput>;
  dependenciesOperator?: InputMaybe<DependenciesLogicOperator>;
  questionId: Scalars['String'];
  templateId: Scalars['Int'];
};


export type MutationUpdateReviewArgs = {
  comment: Scalars['String'];
  grade: Scalars['Int'];
  reviewID: Scalars['Int'];
  sepID: Scalars['Int'];
  status: ReviewStatus;
};


export type MutationUpdateSepArgs = {
  active: Scalars['Boolean'];
  code: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['Int'];
  numberRatingsRequired?: Scalars['Int'];
};


export type MutationUpdateSepTimeAllocationArgs = {
  proposalPk: Scalars['Int'];
  sepId: Scalars['Int'];
  sepTimeAllocation?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateSampleArgs = {
  safetyComment?: InputMaybe<Scalars['String']>;
  safetyStatus?: InputMaybe<SampleStatus>;
  sampleId: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateSampleEsiArgs = {
  esiId: Scalars['Int'];
  isSubmitted?: InputMaybe<Scalars['Boolean']>;
  sampleId: Scalars['Int'];
};


export type MutationUpdateSettingsArgs = {
  updatedSettingsInput: UpdateSettingsInput;
};


export type MutationUpdateShipmentArgs = {
  externalRef?: InputMaybe<Scalars['String']>;
  proposalPk?: InputMaybe<Scalars['Int']>;
  shipmentId: Scalars['Int'];
  status?: InputMaybe<ShipmentStatus>;
  title?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateTechnicalReviewAssigneeArgs = {
  proposalPks: Array<Scalars['Int']>;
  userId: Scalars['Int'];
};


export type MutationUpdateTemplateArgs = {
  description?: InputMaybe<Scalars['String']>;
  isArchived?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  templateId: Scalars['Int'];
};


export type MutationUpdateTopicArgs = {
  id: Scalars['Int'];
  isEnabled?: InputMaybe<Scalars['Boolean']>;
  sortOrder?: InputMaybe<Scalars['Int']>;
  templateId?: InputMaybe<Scalars['Int']>;
  title?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateUserArgs = {
  birthdate?: InputMaybe<Scalars['DateTime']>;
  department?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstname?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  lastname?: InputMaybe<Scalars['String']>;
  middlename?: InputMaybe<Scalars['String']>;
  nationality?: InputMaybe<Scalars['Int']>;
  organisation?: InputMaybe<Scalars['Int']>;
  organizationCountry?: InputMaybe<Scalars['Int']>;
  otherOrganisation?: InputMaybe<Scalars['String']>;
  placeholder?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['String']>;
  preferredname?: InputMaybe<Scalars['String']>;
  roles?: InputMaybe<Array<Scalars['Int']>>;
  telephone?: InputMaybe<Scalars['String']>;
  telephone_alt?: InputMaybe<Scalars['String']>;
  user_title?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateUserRolesArgs = {
  id: Scalars['Int'];
  roles?: InputMaybe<Array<Scalars['Int']>>;
};


export type MutationUpdateVisitArgs = {
  status?: InputMaybe<VisitStatus>;
  team?: InputMaybe<Array<Scalars['Int']>>;
  teamLeadUserId?: InputMaybe<Scalars['Int']>;
  visitId: Scalars['Int'];
};


export type MutationUpdateVisitRegistrationArgs = {
  endsAt?: InputMaybe<Scalars['DateTime']>;
  isRegistrationSubmitted?: InputMaybe<Scalars['Boolean']>;
  startsAt?: InputMaybe<Scalars['DateTime']>;
  trainingExpiryDate?: InputMaybe<Scalars['DateTime']>;
  visitId: Scalars['Int'];
};


export type MutationValidateTemplateImportArgs = {
  templateAsJson: Scalars['String'];
};


export type MutationValidateUnitsImportArgs = {
  unitsAsJson: Scalars['String'];
};

export type NumberInputConfig = {
  numberValueConstraint: Maybe<NumberValueConstraint>;
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
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
  content: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

export enum PageName {
  COOKIEPAGE = 'COOKIEPAGE',
  FOOTERCONTENT = 'FOOTERCONTENT',
  GRADEGUIDEPAGE = 'GRADEGUIDEPAGE',
  HELPPAGE = 'HELPPAGE',
  HOMEPAGE = 'HOMEPAGE',
  LOGINHELPPAGE = 'LOGINHELPPAGE',
  PRIVACYPAGE = 'PRIVACYPAGE',
  REVIEWPAGE = 'REVIEWPAGE'
}

export type PdfTemplate = {
  created: Scalars['DateTime'];
  creatorId: Scalars['Int'];
  pdfTemplateId: Scalars['Int'];
  templateData: Scalars['String'];
  templateId: Scalars['Int'];
};

export type PdfTemplatesFilter = {
  creatorId?: InputMaybe<Scalars['Int']>;
  pdfTemplateData?: InputMaybe<Scalars['String']>;
  pdfTemplateIds?: InputMaybe<Array<Scalars['Int']>>;
  templateIds?: InputMaybe<Array<Scalars['Int']>>;
};

export type PermissionsWithAccessToken = {
  accessPermissions: Scalars['String'];
  accessToken: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};

export type PredefinedMessage = {
  dateModified: Scalars['DateTime'];
  id: Scalars['Int'];
  lastModifiedBy: Scalars['Int'];
  message: Scalars['String'];
  modifiedBy: BasicUserDetails;
  title: Scalars['String'];
};

export type PredefinedMessagesFilter = {
  key?: InputMaybe<Scalars['String']>;
};

export type Proposal = {
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
  proposalBookingCore: Maybe<ProposalBookingCore>;
  proposalId: Scalars['String'];
  proposer: Maybe<BasicUserDetails>;
  proposerId: Scalars['Int'];
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
  title: Scalars['String'];
  updated: Scalars['DateTime'];
  users: Array<BasicUserDetails>;
  visits: Maybe<Array<Visit>>;
};


export type ProposalProposalBookingCoreArgs = {
  filter?: InputMaybe<ProposalBookingFilter>;
};

export type ProposalBasisConfig = {
  tooltip: Scalars['String'];
};

export type ProposalBookingCore = {
  id: Scalars['Int'];
  scheduledEvents: Array<ScheduledEventCore>;
};


export type ProposalBookingCoreScheduledEventsArgs = {
  filter: ProposalBookingScheduledEventFilterCore;
};

export type ProposalBookingFilter = {
  status?: InputMaybe<Array<ProposalBookingStatusCore>>;
};

export type ProposalBookingScheduledEventFilterCore = {
  bookingType?: InputMaybe<ScheduledEventBookingType>;
  endsAfter?: InputMaybe<Scalars['DateTime']>;
  endsBefore?: InputMaybe<Scalars['DateTime']>;
  status?: InputMaybe<Array<ProposalBookingStatusCore>>;
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
  tooltip: Scalars['String'];
};

export type ProposalEvent = {
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

export enum ProposalPublicStatus {
  ACCEPTED = 'accepted',
  DRAFT = 'draft',
  REJECTED = 'rejected',
  RESERVED = 'reserved',
  SUBMITTED = 'submitted',
  UNKNOWN = 'unknown'
}

export type ProposalStatus = {
  description: Scalars['String'];
  id: Scalars['Int'];
  isDefault: Scalars['Boolean'];
  name: Scalars['String'];
  shortCode: Scalars['String'];
};

export type ProposalTemplate = {
  callCount: Scalars['Int'];
  complementaryQuestions: Array<Question>;
  description: Maybe<Scalars['String']>;
  group: TemplateGroup;
  groupId: TemplateGroupId;
  isArchived: Scalars['Boolean'];
  json: Scalars['String'];
  name: Scalars['String'];
  pdfTemplate: Maybe<PdfTemplate>;
  questionaryCount: Scalars['Int'];
  steps: Array<TemplateStep>;
  templateId: Scalars['Int'];
};

export type ProposalTemplatesFilter = {
  isArchived?: InputMaybe<Scalars['Boolean']>;
  templateIds?: InputMaybe<Array<Scalars['Int']>>;
};

export type ProposalView = {
  allocationTimeUnit: AllocationTimeUnits;
  callId: Scalars['Int'];
  callShortCode: Maybe<Scalars['String']>;
  finalStatus: Maybe<ProposalEndStatus>;
  instrumentId: Maybe<Scalars['Int']>;
  instrumentName: Maybe<Scalars['String']>;
  managementTimeAllocation: Maybe<Scalars['Int']>;
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
  technicalReviewAssigneeFirstName: Maybe<Scalars['String']>;
  technicalReviewAssigneeId: Maybe<Scalars['Int']>;
  technicalReviewAssigneeLastName: Maybe<Scalars['String']>;
  technicalReviewSubmitted: Maybe<Scalars['Int']>;
  technicalStatus: Maybe<TechnicalReviewStatus>;
  technicalTimeAllocation: Maybe<Scalars['Int']>;
  title: Scalars['String'];
};

export type ProposalWorkflow = {
  description: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  proposalWorkflowConnectionGroups: Array<ProposalWorkflowConnectionGroup>;
};

export type ProposalWorkflowConnection = {
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
  connections: Array<ProposalWorkflowConnection>;
  groupId: Scalars['String'];
  parentGroupId: Maybe<Scalars['String']>;
};

export type ProposalsFilter = {
  callId?: InputMaybe<Scalars['Int']>;
  instrumentId?: InputMaybe<Scalars['Int']>;
  proposalStatusId?: InputMaybe<Scalars['Int']>;
  questionFilter?: InputMaybe<QuestionFilterInput>;
  questionaryIds?: InputMaybe<Array<Scalars['Int']>>;
  referenceNumbers?: InputMaybe<Array<Scalars['String']>>;
  reviewer?: InputMaybe<ReviewerFilter>;
  shortCodes?: InputMaybe<Array<Scalars['String']>>;
  text?: InputMaybe<Scalars['String']>;
};

export type ProposalsQueryResult = {
  proposals: Array<Proposal>;
  totalCount: Scalars['Int'];
};

export type ProposalsViewQueryResult = {
  proposalViews: Array<ProposalView>;
  totalCount: Scalars['Int'];
};

export type ProposalsViewResult = {
  proposals: Array<ProposalView>;
  totalCount: Scalars['Int'];
};

export type Quantity = {
  id: Scalars['String'];
};

export type QueriesMutationsAndServices = {
  mutations: Array<QueryMutationAndServicesGroup>;
  queries: Array<QueryMutationAndServicesGroup>;
  services: Array<QueryMutationAndServicesGroup>;
};

export type Query = {
  _entities: Array<Maybe<_Entity>>;
  _service: _Service;
  accessTokenAndPermissions: Maybe<PermissionsWithAccessToken>;
  activeTemplateId: Maybe<Scalars['Int']>;
  allAccessTokensAndPermissions: Maybe<Array<PermissionsWithAccessToken>>;
  basicUserDetails: Maybe<BasicUserDetails>;
  basicUserDetailsByEmail: Maybe<BasicUserDetails>;
  blankQuestionary: Questionary;
  blankQuestionarySteps: Maybe<Array<QuestionaryStep>>;
  call: Maybe<Call>;
  calls: Maybe<Array<Call>>;
  callsByInstrumentScientist: Maybe<Array<Call>>;
  checkEmailExist: Maybe<Scalars['Boolean']>;
  checkExternalToken: ExternalTokenResult;
  checkToken: TokenResult;
  countries: Maybe<Array<Entry>>;
  esi: Maybe<ExperimentSafetyInput>;
  eventLogs: Maybe<Array<EventLog>>;
  factoryVersion: Scalars['String'];
  features: Array<Feature>;
  feedback: Maybe<Feedback>;
  feedbacks: Array<Feedback>;
  fileMetadata: Maybe<FileMetadata>;
  filesMetadata: Array<FileMetadata>;
  genericTemplate: Maybe<GenericTemplate>;
  genericTemplates: Maybe<Array<GenericTemplate>>;
  institutions: Maybe<Array<Institution>>;
  instrument: Maybe<Instrument>;
  instrumentScientistHasAccess: Maybe<Scalars['Boolean']>;
  instrumentScientistHasInstrument: Maybe<Scalars['Boolean']>;
  instrumentScientistProposals: Maybe<ProposalsViewResult>;
  instruments: Maybe<InstrumentsQueryResult>;
  instrumentsBySep: Maybe<Array<InstrumentWithAvailabilityTime>>;
  isNaturalKeyPresent: Maybe<Scalars['Boolean']>;
  me: Maybe<User>;
  myShipments: Maybe<Array<Shipment>>;
  myVisits: Array<Visit>;
  nationalities: Maybe<Array<Entry>>;
  pageContent: Maybe<Scalars['String']>;
  pdfTemplate: Maybe<PdfTemplate>;
  pdfTemplates: Maybe<Array<PdfTemplate>>;
  predefinedMessage: Maybe<PredefinedMessage>;
  predefinedMessages: Array<PredefinedMessage>;
  previousCollaborators: Maybe<UserQueryResult>;
  proposal: Maybe<Proposal>;
  proposalById: Maybe<Proposal>;
  proposalEvents: Maybe<Array<ProposalEvent>>;
  proposalReviews: Maybe<Array<Review>>;
  proposalStatus: Maybe<ProposalStatus>;
  proposalStatuses: Maybe<Array<ProposalStatus>>;
  proposalTemplates: Maybe<Array<ProposalTemplate>>;
  proposalWorkflow: Maybe<ProposalWorkflow>;
  proposalWorkflows: Maybe<Array<ProposalWorkflow>>;
  proposals: Maybe<ProposalsQueryResult>;
  proposalsView: Maybe<ProposalsViewQueryResult>;
  quantities: Array<Quantity>;
  queriesMutationsAndServices: Maybe<QueriesMutationsAndServices>;
  questionByNaturalKey: Question;
  questionary: Maybe<Questionary>;
  questions: Array<QuestionWithUsage>;
  review: Maybe<Review>;
  roles: Maybe<Array<Role>>;
  sample: Maybe<Sample>;
  sampleEsi: Maybe<SampleExperimentSafetyInput>;
  samples: Maybe<Array<Sample>>;
  samplesByCallId: Maybe<Array<Sample>>;
  scheduledEventCore: Maybe<ScheduledEventCore>;
  scheduledEventsCore: Array<ScheduledEventCore>;
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
  unitsAsJson: Maybe<Scalars['String']>;
  user: Maybe<User>;
  userByOIDCSub: Maybe<User>;
  userHasAccessToProposal: Maybe<Scalars['Boolean']>;
  userInstruments: Maybe<InstrumentsQueryResult>;
  users: Maybe<UserQueryResult>;
  version: Scalars['String'];
  visit: Maybe<Visit>;
  visitRegistration: Maybe<VisitRegistration>;
  visits: Array<Visit>;
};


export type Query_EntitiesArgs = {
  representations: Array<Scalars['_Any']>;
};


export type QueryAccessTokenAndPermissionsArgs = {
  accessTokenId: Scalars['String'];
};


export type QueryActiveTemplateIdArgs = {
  templateGroupId: TemplateGroupId;
};


export type QueryBasicUserDetailsArgs = {
  userId: Scalars['Int'];
};


export type QueryBasicUserDetailsByEmailArgs = {
  email: Scalars['String'];
  role?: InputMaybe<UserRole>;
};


export type QueryBlankQuestionaryArgs = {
  templateId: Scalars['Int'];
};


export type QueryBlankQuestionaryStepsArgs = {
  templateId: Scalars['Int'];
};


export type QueryCallArgs = {
  callId: Scalars['Int'];
};


export type QueryCallsArgs = {
  filter?: InputMaybe<CallsFilter>;
};


export type QueryCallsByInstrumentScientistArgs = {
  scientistId: Scalars['Int'];
};


export type QueryCheckEmailExistArgs = {
  email: Scalars['String'];
};


export type QueryCheckExternalTokenArgs = {
  token: Scalars['String'];
};


export type QueryCheckTokenArgs = {
  token: Scalars['String'];
};


export type QueryEsiArgs = {
  esiId: Scalars['Int'];
};


export type QueryEventLogsArgs = {
  changedObjectId: Scalars['String'];
  eventType: Scalars['String'];
};


export type QueryFeedbackArgs = {
  feedbackId: Scalars['Int'];
};


export type QueryFeedbacksArgs = {
  filter?: InputMaybe<FeedbacksFilter>;
};


export type QueryFileMetadataArgs = {
  fileId: Scalars['String'];
};


export type QueryFilesMetadataArgs = {
  filter: FilesMetadataFilter;
};


export type QueryGenericTemplateArgs = {
  genericTemplateId: Scalars['Int'];
};


export type QueryGenericTemplatesArgs = {
  filter?: InputMaybe<GenericTemplatesFilter>;
};


export type QueryInstitutionsArgs = {
  filter?: InputMaybe<InstitutionsFilter>;
};


export type QueryInstrumentArgs = {
  instrumentId: Scalars['Int'];
};


export type QueryInstrumentScientistHasAccessArgs = {
  instrumentId: Scalars['Int'];
  proposalPk: Scalars['Int'];
};


export type QueryInstrumentScientistHasInstrumentArgs = {
  instrumentId: Scalars['Int'];
};


export type QueryInstrumentScientistProposalsArgs = {
  filter?: InputMaybe<ProposalsFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryInstrumentsArgs = {
  callIds?: InputMaybe<Array<Scalars['Int']>>;
};


export type QueryInstrumentsBySepArgs = {
  callId: Scalars['Int'];
  sepId: Scalars['Int'];
};


export type QueryIsNaturalKeyPresentArgs = {
  naturalKey: Scalars['String'];
};


export type QueryPageContentArgs = {
  pageId: PageName;
};


export type QueryPdfTemplateArgs = {
  pdfTemplateId: Scalars['Int'];
};


export type QueryPdfTemplatesArgs = {
  filter?: InputMaybe<PdfTemplatesFilter>;
};


export type QueryPredefinedMessageArgs = {
  predefinedMessageId: Scalars['Int'];
};


export type QueryPredefinedMessagesArgs = {
  filter?: InputMaybe<PredefinedMessagesFilter>;
};


export type QueryPreviousCollaboratorsArgs = {
  filter?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  orderDirection?: InputMaybe<Scalars['String']>;
  subtractUsers?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  userId: Scalars['Int'];
  userRole?: InputMaybe<UserRole>;
};


export type QueryProposalArgs = {
  primaryKey: Scalars['Int'];
};


export type QueryProposalByIdArgs = {
  proposalId: Scalars['String'];
};


export type QueryProposalReviewsArgs = {
  proposalPk: Scalars['Int'];
};


export type QueryProposalStatusArgs = {
  proposalStatusId: Scalars['Int'];
};


export type QueryProposalTemplatesArgs = {
  filter?: InputMaybe<ProposalTemplatesFilter>;
};


export type QueryProposalWorkflowArgs = {
  proposalWorkflowId: Scalars['Int'];
};


export type QueryProposalsArgs = {
  filter?: InputMaybe<ProposalsFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryProposalsViewArgs = {
  filter?: InputMaybe<ProposalsFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  searchText?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<Scalars['String']>;
  sortField?: InputMaybe<Scalars['String']>;
};


export type QueryQuestionByNaturalKeyArgs = {
  naturalKey: Scalars['String'];
};


export type QueryQuestionaryArgs = {
  questionaryId: Scalars['Int'];
};


export type QueryQuestionsArgs = {
  filter?: InputMaybe<QuestionsFilter>;
};


export type QueryReviewArgs = {
  reviewId: Scalars['Int'];
};


export type QuerySampleArgs = {
  sampleId: Scalars['Int'];
};


export type QuerySampleEsiArgs = {
  esiId: Scalars['Int'];
  sampleId: Scalars['Int'];
};


export type QuerySamplesArgs = {
  filter?: InputMaybe<SamplesFilter>;
};


export type QuerySamplesByCallIdArgs = {
  callId: Scalars['Int'];
};


export type QueryScheduledEventCoreArgs = {
  scheduledEventId: Scalars['Int'];
};


export type QueryScheduledEventsCoreArgs = {
  filter?: InputMaybe<ScheduledEventsCoreFilter>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
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
  callId?: InputMaybe<Scalars['Int']>;
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
  filter?: InputMaybe<SePsFilter>;
};


export type QueryShipmentArgs = {
  shipmentId: Scalars['Int'];
};


export type QueryShipmentsArgs = {
  filter?: InputMaybe<ShipmentsFilter>;
};


export type QueryTemplateArgs = {
  templateId: Scalars['Int'];
};


export type QueryTemplatesArgs = {
  filter?: InputMaybe<TemplatesFilter>;
};


export type QueryUserArgs = {
  userId: Scalars['Int'];
};


export type QueryUserByOidcSubArgs = {
  oidcSub: Scalars['String'];
};


export type QueryUserHasAccessToProposalArgs = {
  proposalPk: Scalars['Int'];
};


export type QueryUsersArgs = {
  filter?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  orderDirection?: InputMaybe<Scalars['String']>;
  subtractUsers?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  userRole?: InputMaybe<UserRole>;
};


export type QueryVisitArgs = {
  visitId: Scalars['Int'];
};


export type QueryVisitRegistrationArgs = {
  visitId: Scalars['Int'];
};


export type QueryVisitsArgs = {
  filter?: InputMaybe<VisitsFilter>;
};

export type QueryMutationAndServicesGroup = {
  groupName: QueryMutationAndServicesGroups;
  items: Array<Scalars['String']>;
};

export enum QueryMutationAndServicesGroups {
  CORE = 'CORE',
  SCHEDULER = 'SCHEDULER'
}

export type Question = {
  categoryId: TemplateCategoryId;
  config: FieldConfig;
  dataType: DataType;
  id: Scalars['String'];
  naturalKey: Scalars['String'];
  question: Scalars['String'];
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
  questionId: Scalars['String'];
  value: Scalars['String'];
};

export type QuestionTemplateRelation = {
  config: FieldConfig;
  dependencies: Array<FieldDependency>;
  dependenciesOperator: Maybe<DependenciesLogicOperator>;
  question: Question;
  sortOrder: Scalars['Int'];
  topicId: Scalars['Int'];
};

export type QuestionWithUsage = {
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
  created: Scalars['DateTime'];
  isCompleted: Scalars['Boolean'];
  questionaryId: Scalars['Int'];
  steps: Array<QuestionaryStep>;
  templateId: Scalars['Int'];
};

export type QuestionaryStep = {
  fields: Array<Answer>;
  isCompleted: Scalars['Boolean'];
  topic: Topic;
};

export type QuestionsFilter = {
  category?: InputMaybe<TemplateCategoryId>;
  dataType?: InputMaybe<Array<DataType>>;
  excludeDataType?: InputMaybe<Array<DataType>>;
  questionIds?: InputMaybe<Array<Scalars['String']>>;
  text?: InputMaybe<Scalars['String']>;
};

export type RemoveAssignedInstrumentFromCallInput = {
  callId: Scalars['Int'];
  instrumentId: Scalars['Int'];
};

export type ReorderSepMeetingDecisionProposalsInput = {
  proposals: Array<ProposalPkWithRankOrder>;
};

export type Review = {
  comment: Maybe<Scalars['String']>;
  grade: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  proposal: Maybe<Proposal>;
  reviewer: Maybe<BasicUserDetails>;
  sepID: Scalars['Int'];
  status: ReviewStatus;
  userID: Scalars['Int'];
};

export enum ReviewStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED'
}

export enum ReviewerFilter {
  ALL = 'ALL',
  ME = 'ME'
}

export type RichTextInputConfig = {
  max: Maybe<Scalars['Int']>;
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
};

export type Role = {
  id: Scalars['Int'];
  shortCode: Scalars['String'];
  title: Scalars['String'];
};

export type Sep = {
  active: Scalars['Boolean'];
  code: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['Int'];
  numberRatingsRequired: Scalars['Float'];
  proposalCount: Scalars['Int'];
  sepChair: Maybe<BasicUserDetails>;
  sepChairProposalCount: Maybe<Scalars['Int']>;
  sepSecretary: Maybe<BasicUserDetails>;
  sepSecretaryProposalCount: Maybe<Scalars['Int']>;
};

export type SepAssignment = {
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
  assignments: Maybe<Array<SepAssignment>>;
  dateAssigned: Scalars['DateTime'];
  instrumentSubmitted: Scalars['Boolean'];
  proposal: Proposal;
  proposalPk: Scalars['Int'];
  sepId: Scalars['Int'];
  sepTimeAllocation: Maybe<Scalars['Int']>;
};

export type SepReviewer = {
  proposalsCount: Scalars['Int'];
  role: Maybe<Role>;
  sepId: Scalars['Int'];
  user: BasicUserDetails;
  userId: Scalars['Int'];
};

export type SePsFilter = {
  active?: InputMaybe<Scalars['Boolean']>;
  callIds?: InputMaybe<Array<Scalars['Int']>>;
  filter?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type SePsQueryResult = {
  seps: Array<Sep>;
  totalCount: Scalars['Int'];
};

export type Sample = {
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
  titlePlaceholder: Scalars['String'];
};

export type SampleDeclarationConfig = {
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
  tooltip: Scalars['String'];
};

export type SampleExperimentSafetyInput = {
  esiId: Scalars['Int'];
  isSubmitted: Scalars['Boolean'];
  questionary: Questionary;
  questionaryId: Scalars['Int'];
  sample: Sample;
  sampleId: Scalars['Int'];
};

export enum SampleStatus {
  ELEVATED_RISK = 'ELEVATED_RISK',
  HIGH_RISK = 'HIGH_RISK',
  LOW_RISK = 'LOW_RISK',
  PENDING_EVALUATION = 'PENDING_EVALUATION'
}

export type SamplesFilter = {
  creatorId?: InputMaybe<Scalars['Int']>;
  proposalPk?: InputMaybe<Scalars['Int']>;
  questionId?: InputMaybe<Scalars['String']>;
  questionaryIds?: InputMaybe<Array<Scalars['Int']>>;
  sampleIds?: InputMaybe<Array<Scalars['Int']>>;
  status?: InputMaybe<SampleStatus>;
  title?: InputMaybe<Scalars['String']>;
  visitId?: InputMaybe<Scalars['Int']>;
};

export type SaveSepMeetingDecisionInput = {
  commentForManagement?: InputMaybe<Scalars['String']>;
  commentForUser?: InputMaybe<Scalars['String']>;
  proposalPk: Scalars['Int'];
  rankOrder?: InputMaybe<Scalars['Int']>;
  recommendation?: InputMaybe<ProposalEndStatus>;
  submitted?: InputMaybe<Scalars['Boolean']>;
};

export enum ScheduledEventBookingType {
  EQUIPMENT = 'EQUIPMENT',
  MAINTENANCE = 'MAINTENANCE',
  SHUTDOWN = 'SHUTDOWN',
  USER_OPERATIONS = 'USER_OPERATIONS'
}

export type ScheduledEventCore = {
  bookingType: ScheduledEventBookingType;
  endsAt: Scalars['DateTime'];
  esi: Maybe<ExperimentSafetyInput>;
  feedback: Maybe<Feedback>;
  feedbackRequests: Array<FeedbackRequest>;
  id: Scalars['Int'];
  localContact: Maybe<BasicUserDetails>;
  localContactId: Maybe<Scalars['Int']>;
  proposal: Proposal;
  proposalPk: Maybe<Scalars['Int']>;
  shipments: Array<Shipment>;
  startsAt: Scalars['DateTime'];
  status: ProposalBookingStatusCore;
  visit: Maybe<Visit>;
};

export type ScheduledEventsCoreFilter = {
  callId?: InputMaybe<Scalars['Int']>;
  endsAfter?: InputMaybe<Scalars['DateTime']>;
  endsBefore?: InputMaybe<Scalars['DateTime']>;
  instrumentId?: InputMaybe<Scalars['Int']>;
  overlaps?: InputMaybe<TimeSpan>;
  startsAfter?: InputMaybe<Scalars['DateTime']>;
  startsBefore?: InputMaybe<Scalars['DateTime']>;
};

export type SelectionFromOptionsConfig = {
  isMultipleSelect: Scalars['Boolean'];
  options: Array<Scalars['String']>;
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
  variant: Scalars['String'];
};

export type SepMeetingDecision = {
  commentForManagement: Maybe<Scalars['String']>;
  commentForUser: Maybe<Scalars['String']>;
  proposalPk: Scalars['Int'];
  rankOrder: Maybe<Scalars['Int']>;
  recommendation: Maybe<ProposalEndStatus>;
  submitted: Scalars['Boolean'];
  submittedBy: Maybe<Scalars['Int']>;
};

export type Settings = {
  description: Maybe<Scalars['String']>;
  id: SettingsId;
  settingsValue: Maybe<Scalars['String']>;
};

export enum SettingsId {
  DATE_FORMAT = 'DATE_FORMAT',
  DATE_TIME_FORMAT = 'DATE_TIME_FORMAT',
  DEFAULT_INST_SCI_REVIEWER_FILTER = 'DEFAULT_INST_SCI_REVIEWER_FILTER',
  DEFAULT_INST_SCI_STATUS_FILTER = 'DEFAULT_INST_SCI_STATUS_FILTER',
  EXTERNAL_AUTH_LOGIN_URL = 'EXTERNAL_AUTH_LOGIN_URL',
  EXTERNAL_AUTH_LOGOUT_URL = 'EXTERNAL_AUTH_LOGOUT_URL',
  FEEDBACK_EXHAUST_DAYS = 'FEEDBACK_EXHAUST_DAYS',
  FEEDBACK_FREQUENCY_DAYS = 'FEEDBACK_FREQUENCY_DAYS',
  FEEDBACK_MAX_REQUESTS = 'FEEDBACK_MAX_REQUESTS',
  HEADER_LOGO_FILENAME = 'HEADER_LOGO_FILENAME',
  IDLE_TIMEOUT = 'IDLE_TIMEOUT',
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
  TIMEZONE = 'TIMEZONE'
}

export type Shipment = {
  created: Scalars['DateTime'];
  creatorId: Scalars['Int'];
  externalRef: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  proposal: Proposal;
  proposalPk: Scalars['Int'];
  questionary: Questionary;
  questionaryId: Scalars['Int'];
  samples: Array<Sample>;
  scheduledEventId: Scalars['Int'];
  status: ShipmentStatus;
  title: Scalars['String'];
};

export type ShipmentBasisConfig = {
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
};

export enum ShipmentStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED'
}

export type ShipmentsFilter = {
  creatorId?: InputMaybe<Scalars['Int']>;
  externalRef?: InputMaybe<Scalars['String']>;
  proposalPk?: InputMaybe<Scalars['Int']>;
  questionaryIds?: InputMaybe<Array<Scalars['Int']>>;
  scheduledEventId?: InputMaybe<Scalars['Int']>;
  shipmentIds?: InputMaybe<Array<Scalars['Int']>>;
  status?: InputMaybe<ShipmentStatus>;
  title?: InputMaybe<Scalars['String']>;
};

export type StatusChangingEvent = {
  proposalWorkflowConnectionId: Scalars['Int'];
  statusChangingEvent: Scalars['String'];
  statusChangingEventId: Scalars['Int'];
};

export type SubTemplateConfig = {
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
  comment?: InputMaybe<Scalars['String']>;
  files?: InputMaybe<Scalars['String']>;
  proposalPk: Scalars['Int'];
  publicComment?: InputMaybe<Scalars['String']>;
  reviewerId: Scalars['Int'];
  status?: InputMaybe<TechnicalReviewStatus>;
  submitted: Scalars['Boolean'];
  timeAllocation?: InputMaybe<Scalars['Int']>;
};

export type SubmitTechnicalReviewsInput = {
  technicalReviews: Array<SubmitTechnicalReviewInput>;
};

export type TechnicalReview = {
  comment: Maybe<Scalars['String']>;
  files: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  proposal: Maybe<Proposal>;
  proposalPk: Scalars['Int'];
  publicComment: Maybe<Scalars['String']>;
  reviewer: Maybe<BasicUserDetails>;
  reviewerId: Scalars['Int'];
  status: Maybe<TechnicalReviewStatus>;
  submitted: Scalars['Boolean'];
  technicalReviewAssignee: Maybe<BasicUserDetails>;
  technicalReviewAssigneeId: Maybe<Scalars['Int']>;
  timeAllocation: Maybe<Scalars['Int']>;
};

export enum TechnicalReviewStatus {
  FEASIBLE = 'FEASIBLE',
  PARTIALLY_FEASIBLE = 'PARTIALLY_FEASIBLE',
  UNFEASIBLE = 'UNFEASIBLE'
}

export type Template = {
  complementaryQuestions: Array<Question>;
  description: Maybe<Scalars['String']>;
  group: TemplateGroup;
  groupId: TemplateGroupId;
  isArchived: Scalars['Boolean'];
  json: Scalars['String'];
  name: Scalars['String'];
  pdfTemplate: Maybe<PdfTemplate>;
  questionaryCount: Scalars['Int'];
  steps: Array<TemplateStep>;
  templateId: Scalars['Int'];
};

export type TemplateCategory = {
  categoryId: TemplateCategoryId;
  name: Scalars['String'];
};

export enum TemplateCategoryId {
  FEEDBACK = 'FEEDBACK',
  GENERIC_TEMPLATE = 'GENERIC_TEMPLATE',
  PDF = 'PDF',
  PROPOSAL_QUESTIONARY = 'PROPOSAL_QUESTIONARY',
  SAMPLE_DECLARATION = 'SAMPLE_DECLARATION',
  SHIPMENT_DECLARATION = 'SHIPMENT_DECLARATION',
  VISIT_REGISTRATION = 'VISIT_REGISTRATION'
}

export type TemplateGroup = {
  categoryId: TemplateCategoryId;
  groupId: TemplateGroupId;
};

export enum TemplateGroupId {
  FEEDBACK = 'FEEDBACK',
  GENERIC_TEMPLATE = 'GENERIC_TEMPLATE',
  PDF_TEMPLATE = 'PDF_TEMPLATE',
  PROPOSAL = 'PROPOSAL',
  PROPOSAL_ESI = 'PROPOSAL_ESI',
  SAMPLE = 'SAMPLE',
  SAMPLE_ESI = 'SAMPLE_ESI',
  SHIPMENT = 'SHIPMENT',
  VISIT_REGISTRATION = 'VISIT_REGISTRATION'
}

export type TemplateStep = {
  fields: Array<QuestionTemplateRelation>;
  topic: Topic;
};

export type TemplateValidation = {
  exportDate: Scalars['DateTime'];
  json: Scalars['String'];
  validationData: TemplateValidationData;
  version: Scalars['String'];
};

export type TemplateValidationData = {
  errors: Array<Scalars['String']>;
  isValid: Scalars['Boolean'];
  questionComparisons: Array<QuestionComparison>;
  subTemplateValidationData: Array<TemplateValidationData>;
};

export type TemplatesFilter = {
  group?: InputMaybe<TemplateGroupId>;
  isArchived?: InputMaybe<Scalars['Boolean']>;
  templateIds?: InputMaybe<Array<Scalars['Int']>>;
};

export type TextInputConfig = {
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

export type TimeSpan = {
  from?: InputMaybe<Scalars['DateTime']>;
  to?: InputMaybe<Scalars['DateTime']>;
};

export type TokenPayloadUnion = AuthJwtApiTokenPayload | AuthJwtPayload;

export type TokenResult = {
  isValid: Scalars['Boolean'];
  payload: Maybe<TokenPayloadUnion>;
};

export type Topic = {
  id: Scalars['Int'];
  isEnabled: Scalars['Boolean'];
  sortOrder: Scalars['Int'];
  templateId: Scalars['Int'];
  title: Scalars['String'];
};

export enum TrainingStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  NONE = 'NONE'
}

export type Unit = {
  id: Scalars['String'];
  quantity: Scalars['String'];
  siConversionFormula: Scalars['String'];
  symbol: Scalars['String'];
  unit: Scalars['String'];
};

export type UnitComparison = {
  conflictResolutionStrategy: ConflictResolutionStrategy;
  existingUnit: Maybe<Unit>;
  newUnit: Unit;
  status: QuestionComparisonStatus;
};

export type UnitsImportWithValidation = {
  errors: Array<Scalars['String']>;
  exportDate: Scalars['DateTime'];
  isValid: Scalars['Boolean'];
  json: Scalars['String'];
  unitComparisons: Array<UnitComparison>;
  version: Scalars['String'];
};

export type UpdateApiAccessTokenInput = {
  accessPermissions: Scalars['String'];
  accessTokenId: Scalars['String'];
  name: Scalars['String'];
};

export type UpdateCallInput = {
  allocationTimeUnit: AllocationTimeUnits;
  callEnded?: InputMaybe<Scalars['Int']>;
  callEndedInternal?: InputMaybe<Scalars['Boolean']>;
  callReviewEnded?: InputMaybe<Scalars['Int']>;
  callSEPReviewEnded?: InputMaybe<Scalars['Int']>;
  cycleComment: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  endCall: Scalars['DateTime'];
  endCallInternal?: InputMaybe<Scalars['DateTime']>;
  endCycle: Scalars['DateTime'];
  endNotify: Scalars['DateTime'];
  endReview: Scalars['DateTime'];
  endSEPReview?: InputMaybe<Scalars['DateTime']>;
  esiTemplateId?: InputMaybe<Scalars['Int']>;
  id: Scalars['Int'];
  isActive?: InputMaybe<Scalars['Boolean']>;
  pdfTemplateId?: InputMaybe<Scalars['Int']>;
  proposalSequence?: InputMaybe<Scalars['Int']>;
  proposalWorkflowId: Scalars['Int'];
  referenceNumberFormat?: InputMaybe<Scalars['String']>;
  seps?: InputMaybe<Array<Scalars['Int']>>;
  shortCode: Scalars['String'];
  startCall: Scalars['DateTime'];
  startCycle: Scalars['DateTime'];
  startNotify: Scalars['DateTime'];
  startReview: Scalars['DateTime'];
  startSEPReview?: InputMaybe<Scalars['DateTime']>;
  submissionMessage?: InputMaybe<Scalars['String']>;
  surveyComment: Scalars['String'];
  templateId: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateFeaturesInput = {
  action: FeatureUpdateAction;
  featureIds: Array<FeatureId>;
};

export type UpdatePredefinedMessageInput = {
  id: Scalars['Int'];
  key: Scalars['String'];
  message: Scalars['String'];
  title: Scalars['String'];
};

export type UpdateProposalStatusInput = {
  description: Scalars['String'];
  id: Scalars['Int'];
  isDefault?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  shortCode?: InputMaybe<Scalars['String']>;
};

export type UpdateProposalWorkflowInput = {
  description: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type UpdateSettingsInput = {
  description?: InputMaybe<Scalars['String']>;
  settingsId: SettingsId;
  settingsValue?: InputMaybe<Scalars['String']>;
};

export type User = {
  birthdate: Scalars['DateTime'];
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
  oauthRefreshToken: Maybe<Scalars['String']>;
  oidcSub: Maybe<Scalars['String']>;
  organisation: Scalars['Int'];
  placeholder: Scalars['Boolean'];
  position: Scalars['String'];
  preferredname: Maybe<Scalars['String']>;
  proposals: Array<Proposal>;
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
  filter?: InputMaybe<UserProposalsFilter>;
};


export type UserReviewsArgs = {
  callId?: InputMaybe<Scalars['Int']>;
  instrumentId?: InputMaybe<Scalars['Int']>;
  reviewer?: InputMaybe<ReviewerFilter>;
  status?: InputMaybe<ReviewStatus>;
};

export type UserJwt = {
  created: Scalars['String'];
  email: Scalars['String'];
  firstname: Scalars['String'];
  id: Scalars['Int'];
  lastname: Scalars['String'];
  oidcSub: Maybe<Scalars['String']>;
  organisation: Scalars['Float'];
  placeholder: Scalars['Boolean'];
  position: Scalars['String'];
  preferredname: Maybe<Scalars['String']>;
};

export type UserProposalsFilter = {
  finalStatus?: InputMaybe<ProposalEndStatus>;
  instrumentId?: InputMaybe<Scalars['Int']>;
  managementDecisionSubmitted?: InputMaybe<Scalars['Boolean']>;
};

export type UserQueryResult = {
  totalCount: Scalars['Int'];
  users: Array<BasicUserDetails>;
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
  creatorId: Scalars['Int'];
  id: Scalars['Int'];
  proposal: Proposal;
  proposalPk: Scalars['Int'];
  registrations: Array<VisitRegistration>;
  samples: Array<Sample>;
  scheduledEventId: Scalars['Int'];
  status: VisitStatus;
  teamLead: BasicUserDetails;
  teamLeadUserId: Scalars['Int'];
};

export type VisitBasisConfig = {
  required: Scalars['Boolean'];
  small_label: Scalars['String'];
  tooltip: Scalars['String'];
};

export type VisitRegistration = {
  endsAt: Maybe<Scalars['DateTime']>;
  isRegistrationSubmitted: Scalars['Boolean'];
  questionary: Questionary;
  registrationQuestionaryId: Maybe<Scalars['Int']>;
  startsAt: Maybe<Scalars['DateTime']>;
  trainingExpiryDate: Maybe<Scalars['DateTime']>;
  trainingStatus: TrainingStatus;
  user: Maybe<BasicUserDetails>;
  userId: Scalars['Int'];
  visitId: Scalars['Int'];
};

export enum VisitStatus {
  ACCEPTED = 'ACCEPTED',
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED'
}

export type VisitsFilter = {
  creatorId?: InputMaybe<Scalars['Int']>;
  proposalPk?: InputMaybe<Scalars['Int']>;
  scheduledEventId?: InputMaybe<Scalars['Int']>;
};

export type _Entity = BasicUserDetails | Call | Instrument | Proposal | User;

export type _Service = {
  sdl: Maybe<Scalars['String']>;
};

export type GetAccessTokenAndPermissionsQueryVariables = Exact<{
  accessTokenId: Scalars['String'];
}>;


export type GetAccessTokenAndPermissionsQuery = { accessTokenAndPermissions: { id: string, accessPermissions: string } | null };

export type InstrumentScientistHasAccessQueryVariables = Exact<{
  proposalPk: Scalars['Int'];
  instrumentId: Scalars['Int'];
}>;


export type InstrumentScientistHasAccessQuery = { instrumentScientistHasAccess: boolean | null };

export type InstrumentScientistHasInstrumentQueryVariables = Exact<{
  instrumentId: Scalars['Int'];
}>;


export type InstrumentScientistHasInstrumentQuery = { instrumentScientistHasInstrument: boolean | null };

export type UserInstrumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserInstrumentsQuery = { userInstruments: { instruments: Array<{ id: number }> } | null };

export type UserHasAccessQueryVariables = Exact<{
  proposalPk: Scalars['Int'];
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
    getAccessTokenAndPermissions(variables: GetAccessTokenAndPermissionsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetAccessTokenAndPermissionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAccessTokenAndPermissionsQuery>(GetAccessTokenAndPermissionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAccessTokenAndPermissions', 'query');
    },
    instrumentScientistHasAccess(variables: InstrumentScientistHasAccessQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<InstrumentScientistHasAccessQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<InstrumentScientistHasAccessQuery>(InstrumentScientistHasAccessDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'instrumentScientistHasAccess', 'query');
    },
    instrumentScientistHasInstrument(variables: InstrumentScientistHasInstrumentQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<InstrumentScientistHasInstrumentQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<InstrumentScientistHasInstrumentQuery>(InstrumentScientistHasInstrumentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'instrumentScientistHasInstrument', 'query');
    },
    userInstruments(variables?: UserInstrumentsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserInstrumentsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserInstrumentsQuery>(UserInstrumentsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'userInstruments', 'query');
    },
    userHasAccess(variables: UserHasAccessQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserHasAccessQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserHasAccessQuery>(UserHasAccessDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'userHasAccess', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;