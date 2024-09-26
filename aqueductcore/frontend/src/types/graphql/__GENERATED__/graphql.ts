/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  /** Date with time (isoformat) */
  DateTime: { input: any; output: any; }
  UUID: { input: any; output: any; }
  /** Represents NULL values */
  Void: { input: any; output: any; }
};

export type CancelTaskInput = {
  taskId: Scalars['UUID']['input'];
};

export type ExecuteExtensionInput = {
  action: Scalars['String']['input'];
  experimentUuid: Scalars['UUID']['input'];
  extension: Scalars['String']['input'];
  params: Array<Array<Scalars['String']['input']>>;
};

export type ExperimentCreateInput = {
  description: Scalars['String']['input'];
  tags: Array<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

/** Single experiment with its data. */
export type ExperimentData = {
  __typename?: 'ExperimentData';
  /** Creation date of the experiment. */
  createdAt: Scalars['DateTime']['output'];
  /** Creator of the experiment */
  createdBy: Scalars['String']['output'];
  /** Description of the experiment. */
  description?: Maybe<Scalars['String']['output']>;
  /** EID of the experiment. */
  eid: Scalars['String']['output'];
  /** List of files in an experiment. */
  files: Array<ExperimentFile>;
  /** Tags of the experiment. */
  tags: Array<Scalars['String']['output']>;
  /** List of tasks for this experiment. */
  tasks: Array<TaskData>;
  /** Title of the experiment. */
  title: Scalars['String']['output'];
  /** Last update date of the experiment. */
  updatedAt: Scalars['DateTime']['output'];
  /** Unique identifier of the experiment. */
  uuid: Scalars['UUID']['output'];
};

/** Single file in an experiment */
export type ExperimentFile = {
  __typename?: 'ExperimentFile';
  /** Last modified date of the file. */
  modifiedAt: Scalars['DateTime']['output'];
  /** Full name of the file. */
  name: Scalars['String']['output'];
  /** Relative path of the file to the download route. */
  path: Scalars['String']['output'];
};

export type ExperimentFiltersInput = {
  /** Filter experiments created after this date. */
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** List of tags that should be present. */
  shouldIncludeTags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Filter experiments created after this date. */
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** List of tags to filter. */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Search string for experiment title and EID. */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ExperimentIdentifierInput = {
  type: IdType;
  value: Scalars['String']['input'];
};

export type ExperimentRemoveInput = {
  uuid: Scalars['UUID']['input'];
};

export type ExperimentTagInput = {
  tag: Scalars['String']['input'];
  uuid: Scalars['UUID']['input'];
};

export type ExperimentTagsInput = {
  tags: Array<Scalars['String']['input']>;
  uuid: Scalars['UUID']['input'];
};

export type ExperimentUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** Paginated list of experiments */
export type Experiments = {
  __typename?: 'Experiments';
  /** The list of experiments in this page */
  experimentsData: Array<ExperimentData>;
  /** Total number of experiments in the filtered dataset */
  totalExperimentsCount: Scalars['Int']['output'];
};

export type ExtensionActionInfo = {
  __typename?: 'ExtensionActionInfo';
  description?: Maybe<Scalars['String']['output']>;
  experimentVariableName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  parameters: Array<ExtensionParameterType>;
};

export type ExtensionInfo = {
  __typename?: 'ExtensionInfo';
  actions: Array<ExtensionActionInfo>;
  /** Extension authors' emails */
  authors: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type ExtensionParameterType = {
  __typename?: 'ExtensionParameterType';
  dataType: Scalars['String']['output'];
  defaultValue?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  options?: Maybe<Array<Scalars['String']['output']>>;
};

export enum IdType {
  Eid = 'EID',
  Uuid = 'UUID'
}

export type KeyValuePair = {
  __typename?: 'KeyValuePair';
  key: ExtensionParameterType;
  value?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addTagToExperiment: ExperimentData;
  addTagsToExperiment: ExperimentData;
  cancelTask: TaskData;
  createExperiment: ExperimentData;
  executeExtension: TaskData;
  removeExperiment?: Maybe<Scalars['Void']['output']>;
  removeTagFromExperiment: ExperimentData;
  updateExperiment: ExperimentData;
};


export type MutationAddTagToExperimentArgs = {
  experimentTagInput: ExperimentTagInput;
};


export type MutationAddTagsToExperimentArgs = {
  experimentTagsInput: ExperimentTagsInput;
};


export type MutationCancelTaskArgs = {
  cancelTaskInput: CancelTaskInput;
};


export type MutationCreateExperimentArgs = {
  createExperimentInput: ExperimentCreateInput;
};


export type MutationExecuteExtensionArgs = {
  executeExtensionInput: ExecuteExtensionInput;
};


export type MutationRemoveExperimentArgs = {
  experimentRemoveInput: ExperimentRemoveInput;
};


export type MutationRemoveTagFromExperimentArgs = {
  experimentTagInput: ExperimentTagInput;
};


export type MutationUpdateExperimentArgs = {
  experimentUpdateInput: ExperimentUpdateInput;
  uuid: Scalars['UUID']['input'];
};

export type Query = {
  __typename?: 'Query';
  experiment?: Maybe<ExperimentData>;
  experiments: Experiments;
  extensions: Array<ExtensionInfo>;
  getCurrentUserInfo: UserInfo;
  tags: Tags;
  task?: Maybe<TaskData>;
  tasks: Tasks;
};


export type QueryExperimentArgs = {
  experimentIdentifier: ExperimentIdentifierInput;
};


export type QueryExperimentsArgs = {
  filters?: InputMaybe<ExperimentFiltersInput>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


export type QueryTagsArgs = {
  filters?: InputMaybe<TagsFilters>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTaskArgs = {
  taskId: Scalars['UUID']['input'];
};


export type QueryTasksArgs = {
  filters?: InputMaybe<TasksFilterInput>;
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

/** Paginated list of experiments */
export type Tags = {
  __typename?: 'Tags';
  /** The list of tags. */
  tagsData: Array<Scalars['String']['output']>;
  /** Total number of tags. */
  totalTagsCount: Scalars['Int']['output'];
};

export type TagsFilters = {
  /** Include tags with no experiments linked. */
  includeDangling?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TaskData = {
  __typename?: 'TaskData';
  /** Name of the extension action. */
  actionName: Scalars['String']['output'];
  /** Creator of the task. */
  createdBy: Scalars['String']['output'];
  /** Time task was completed. */
  endedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Experiment the task is associated with. */
  experiment: ExperimentData;
  /** Name of the extension. */
  extensionName: Scalars['String']['output'];
  /** List of task parameters and their values. */
  parameters: Array<KeyValuePair>;
  /** Time task was submitted. */
  receivedAt: Scalars['DateTime']['output'];
  /** Process result code. */
  resultCode?: Maybe<Scalars['Int']['output']>;
  /** Content of task stderr. */
  stdErr?: Maybe<Scalars['String']['output']>;
  /** Content of task stdout. */
  stdOut?: Maybe<Scalars['String']['output']>;
  /** Unique identifier of the task. */
  taskId: Scalars['UUID']['output'];
  /** Status of the task execution. */
  taskStatus: TaskStatus;
};

export enum TaskStatus {
  Failure = 'FAILURE',
  Pending = 'PENDING',
  Received = 'RECEIVED',
  Revoked = 'REVOKED',
  Started = 'STARTED',
  Success = 'SUCCESS'
}

/** Paginated list of tasks. */
export type Tasks = {
  __typename?: 'Tasks';
  /** The list of tasks in this page */
  tasksData: Array<TaskData>;
  /** Total number of tasks in the filtered dataset */
  totalTasksCount: Scalars['Int']['output'];
};

export type TasksFilterInput = {
  actionName?: InputMaybe<Scalars['String']['input']>;
  experiment?: InputMaybe<ExperimentIdentifierInput>;
  extensionName?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

/** Current user information */
export type UserInfo = {
  __typename?: 'UserInfo';
  /** List of scopes available to the user. */
  scopes: Array<Scalars['String']['output']>;
  /** Username. */
  username: Scalars['String']['output'];
};

export type AddTagToExperimentMutationVariables = Exact<{
  uuid: Scalars['UUID']['input'];
  tag: Scalars['String']['input'];
}>;


export type AddTagToExperimentMutation = { __typename?: 'Mutation', addTagToExperiment: { __typename?: 'ExperimentData', uuid: any, tags: Array<string> } };

export type CreateExperimentMutationVariables = Exact<{
  title: Scalars['String']['input'];
  description: Scalars['String']['input'];
  tags: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type CreateExperimentMutation = { __typename?: 'Mutation', createExperiment: { __typename?: 'ExperimentData', uuid: any, eid: string } };

export type RemoveExperimentMutationVariables = Exact<{
  uuid: Scalars['UUID']['input'];
}>;


export type RemoveExperimentMutation = { __typename?: 'Mutation', removeExperiment?: any | null };

export type RemoveTagFromExperimentMutationVariables = Exact<{
  uuid: Scalars['UUID']['input'];
  tag: Scalars['String']['input'];
}>;


export type RemoveTagFromExperimentMutation = { __typename?: 'Mutation', removeTagFromExperiment: { __typename?: 'ExperimentData', uuid: any, tags: Array<string> } };

export type UpdateExperimentNameMutationVariables = Exact<{
  uuid: Scalars['UUID']['input'];
  experimentUpdateInput: ExperimentUpdateInput;
}>;


export type UpdateExperimentNameMutation = { __typename?: 'Mutation', updateExperiment: { __typename?: 'ExperimentData', uuid: any, title: string, description?: string | null, eid: string } };

export type CancelTaskMutationVariables = Exact<{
  taskId: Scalars['UUID']['input'];
}>;


export type CancelTaskMutation = { __typename?: 'Mutation', cancelTask: { __typename?: 'TaskData', createdBy: string, taskId: any, resultCode?: number | null, taskStatus: TaskStatus } };

export type ExecuteExtensionMutationVariables = Exact<{
  experimentUuid: Scalars['UUID']['input'];
  extension: Scalars['String']['input'];
  action: Scalars['String']['input'];
  params: Array<Array<Scalars['String']['input']> | Scalars['String']['input']> | Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ExecuteExtensionMutation = { __typename?: 'Mutation', executeExtension: { __typename?: 'TaskData', resultCode?: number | null, stdErr?: string | null, stdOut?: string | null } };

export type GetAllExperimentsQueryVariables = Exact<{
  offset: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  filters?: InputMaybe<ExperimentFiltersInput>;
}>;


export type GetAllExperimentsQuery = { __typename?: 'Query', experiments: { __typename?: 'Experiments', totalExperimentsCount: number, experimentsData: Array<{ __typename?: 'ExperimentData', uuid: any, eid: string, title: string, description?: string | null, tags: Array<string>, createdAt: any, createdBy: string }> } };

export type GetAllTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTagsQuery = { __typename?: 'Query', tags: { __typename?: 'Tags', tagsData: Array<string> } };

export type GetExperimentByIdQueryVariables = Exact<{
  experimentIdentifier: ExperimentIdentifierInput;
}>;


export type GetExperimentByIdQuery = { __typename?: 'Query', experiment?: { __typename?: 'ExperimentData', uuid: any, title: string, description?: string | null, tags: Array<string>, eid: string, createdAt: any, createdBy: string, files: Array<{ __typename?: 'ExperimentFile', name: string, path: string, modifiedAt: any }> } | null };

export type GetExperimentFilesByIdQueryVariables = Exact<{
  experimentIdentifier: ExperimentIdentifierInput;
}>;


export type GetExperimentFilesByIdQuery = { __typename?: 'Query', experiment?: { __typename?: 'ExperimentData', uuid: any, files: Array<{ __typename?: 'ExperimentFile', name: string, path: string, modifiedAt: any }> } | null };

export type GetAllExtensionNamesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllExtensionNamesQuery = { __typename?: 'Query', extensions: Array<{ __typename?: 'ExtensionInfo', name: string }> };

export type GetAllExtensionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllExtensionsQuery = { __typename?: 'Query', extensions: Array<{ __typename?: 'ExtensionInfo', name: string, authors: string, description?: string | null, actions: Array<{ __typename?: 'ExtensionActionInfo', description?: string | null, experimentVariableName?: string | null, name: string, parameters: Array<{ __typename?: 'ExtensionParameterType', dataType: string, defaultValue?: string | null, description?: string | null, displayName?: string | null, name: string, options?: Array<string> | null }> }> }> };

export type GetAllTasksQueryVariables = Exact<{
  offset: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  filters?: InputMaybe<TasksFilterInput>;
}>;


export type GetAllTasksQuery = { __typename?: 'Query', tasks: { __typename?: 'Tasks', totalTasksCount: number, tasksData: Array<{ __typename?: 'TaskData', extensionName: string, actionName: string, taskStatus: TaskStatus, receivedAt: any, resultCode?: number | null, stdOut?: string | null, stdErr?: string | null, taskId: any, experiment: { __typename?: 'ExperimentData', createdBy: string, uuid: any, title: string, eid: string } }> } };

export type GetTaskQueryVariables = Exact<{
  taskId: Scalars['UUID']['input'];
}>;


export type GetTaskQuery = { __typename?: 'Query', task?: { __typename?: 'TaskData', extensionName: string, actionName: string, taskStatus: TaskStatus, receivedAt: any, resultCode?: number | null, stdOut?: string | null, stdErr?: string | null, taskId: any, experiment: { __typename?: 'ExperimentData', createdBy: string, uuid: any, title: string, eid: string }, parameters: Array<{ __typename?: 'KeyValuePair', value?: string | null, key: { __typename?: 'ExtensionParameterType', dataType: string, name: string, displayName?: string | null, defaultValue?: string | null, description?: string | null, options?: Array<string> | null } }> } | null };

export type GetCurrentUserInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserInfoQuery = { __typename?: 'Query', getCurrentUserInfo: { __typename?: 'UserInfo', scopes: Array<string>, username: string } };


export const AddTagToExperimentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addTagToExperiment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addTagToExperiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"experimentTagInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"tag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tag"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}}]} as unknown as DocumentNode<AddTagToExperimentMutation, AddTagToExperimentMutationVariables>;
export const CreateExperimentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createExperiment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tags"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createExperiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createExperimentInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"tags"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tags"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"eid"}}]}}]}}]} as unknown as DocumentNode<CreateExperimentMutation, CreateExperimentMutationVariables>;
export const RemoveExperimentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeExperiment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeExperiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"experimentRemoveInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}]}}]}]}}]} as unknown as DocumentNode<RemoveExperimentMutation, RemoveExperimentMutationVariables>;
export const RemoveTagFromExperimentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeTagFromExperiment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeTagFromExperiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"experimentTagInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"tag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tag"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}}]} as unknown as DocumentNode<RemoveTagFromExperimentMutation, RemoveTagFromExperimentMutationVariables>;
export const UpdateExperimentNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateExperimentName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"experimentUpdateInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExperimentUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateExperiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"experimentUpdateInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"experimentUpdateInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eid"}}]}}]}}]} as unknown as DocumentNode<UpdateExperimentNameMutation, UpdateExperimentNameMutationVariables>;
export const CancelTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cancelTaskInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"resultCode"}},{"kind":"Field","name":{"kind":"Name","value":"taskStatus"}}]}}]}}]} as unknown as DocumentNode<CancelTaskMutation, CancelTaskMutationVariables>;
export const ExecuteExtensionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ExecuteExtension"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"experimentUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"extension"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"action"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"params"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"executeExtension"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"executeExtensionInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"experimentUuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"experimentUuid"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"extension"},"value":{"kind":"Variable","name":{"kind":"Name","value":"extension"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"action"},"value":{"kind":"Variable","name":{"kind":"Name","value":"action"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"params"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resultCode"}},{"kind":"Field","name":{"kind":"Name","value":"stdErr"}},{"kind":"Field","name":{"kind":"Name","value":"stdOut"}}]}}]}}]} as unknown as DocumentNode<ExecuteExtensionMutation, ExecuteExtensionMutationVariables>;
export const GetAllExperimentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllExperiments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ExperimentFiltersInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"experiments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"experimentsData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"eid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalExperimentsCount"}}]}}]}}]} as unknown as DocumentNode<GetAllExperimentsQuery, GetAllExperimentsQueryVariables>;
export const GetAllTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllTags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tagsData"}}]}}]}}]} as unknown as DocumentNode<GetAllTagsQuery, GetAllTagsQueryVariables>;
export const GetExperimentByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getExperimentById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"experimentIdentifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExperimentIdentifierInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"experiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"experimentIdentifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"experimentIdentifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"eid"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetExperimentByIdQuery, GetExperimentByIdQueryVariables>;
export const GetExperimentFilesByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getExperimentFilesById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"experimentIdentifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExperimentIdentifierInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"experiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"experimentIdentifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"experimentIdentifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetExperimentFilesByIdQuery, GetExperimentFilesByIdQueryVariables>;
export const GetAllExtensionNamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllExtensionNames"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"extensions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetAllExtensionNamesQuery, GetAllExtensionNamesQueryVariables>;
export const GetAllExtensionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllExtensions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"extensions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"experimentVariableName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parameters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataType"}},{"kind":"Field","name":{"kind":"Name","value":"defaultValue"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"options"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllExtensionsQuery, GetAllExtensionsQueryVariables>;
export const GetAllTasksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllTasks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TasksFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tasks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tasksData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"extensionName"}},{"kind":"Field","name":{"kind":"Name","value":"actionName"}},{"kind":"Field","name":{"kind":"Name","value":"taskStatus"}},{"kind":"Field","name":{"kind":"Name","value":"receivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resultCode"}},{"kind":"Field","name":{"kind":"Name","value":"stdOut"}},{"kind":"Field","name":{"kind":"Name","value":"stdErr"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"experiment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"eid"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalTasksCount"}}]}}]}}]} as unknown as DocumentNode<GetAllTasksQuery, GetAllTasksQueryVariables>;
export const GetTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"task"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"extensionName"}},{"kind":"Field","name":{"kind":"Name","value":"actionName"}},{"kind":"Field","name":{"kind":"Name","value":"taskStatus"}},{"kind":"Field","name":{"kind":"Name","value":"receivedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resultCode"}},{"kind":"Field","name":{"kind":"Name","value":"stdOut"}},{"kind":"Field","name":{"kind":"Name","value":"stdErr"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"experiment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"eid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parameters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dataType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"defaultValue"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"options"}}]}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<GetTaskQuery, GetTaskQueryVariables>;
export const GetCurrentUserInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCurrentUserInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUserInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<GetCurrentUserInfoQuery, GetCurrentUserInfoQueryVariables>;