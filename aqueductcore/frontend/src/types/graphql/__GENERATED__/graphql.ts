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
  /** Date (isoformat) */
  Date: { input: any; output: any; }
  /** Date with time (isoformat) */
  DateTime: { input: any; output: any; }
  UUID: { input: any; output: any; }
  /** Represents NULL values */
  Void: { input: any; output: any; }
};

export type ExperimentCreateInput = {
  description: Scalars['String']['input'];
  tags: Array<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

/** Single experiment with its data. */
export type ExperimentData = {
  __typename?: 'ExperimentData';
  /** Alias of the experiment. */
  alias: Scalars['String']['output'];
  /** Creation date of the experiment. */
  createdAt: Scalars['DateTime']['output'];
  /** Creator of the experiment */
  createdBy: Scalars['String']['output'];
  /** Description of the experiment. */
  description?: Maybe<Scalars['String']['output']>;
  /** List of files in an experiment. */
  files: Array<ExperimentFile>;
  /** Unique identifier of the experiment. */
  id: Scalars['UUID']['output'];
  /** Tags of the experiment. */
  tags: Array<Scalars['String']['output']>;
  /** Title of the experiment. */
  title: Scalars['String']['output'];
  /** Last update date of the experiment. */
  updatedAt: Scalars['DateTime']['output'];
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
  endDate?: InputMaybe<Scalars['Date']['input']>;
  /** List of tags that should be present. */
  shouldIncludeTags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Filter experiments created after this date. */
  startDate?: InputMaybe<Scalars['Date']['input']>;
  /** List of tags to filter. */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Search string for experiment title and alias. */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ExperimentIdentifierInput = {
  type: IdType;
  value: Scalars['String']['input'];
};

export type ExperimentRemoveInput = {
  experimentId: Scalars['UUID']['input'];
};

export type ExperimentTagInput = {
  experimentId: Scalars['UUID']['input'];
  tag: Scalars['String']['input'];
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

export enum IdType {
  Alias = 'ALIAS',
  Uuid = 'UUID'
}

export type Mutation = {
  __typename?: 'Mutation';
  addTagToExperiment: ExperimentData;
  createExperiment: ExperimentData;
  removeExperiment?: Maybe<Scalars['Void']['output']>;
  removeTagFromExperiment: ExperimentData;
  updateExperiment: ExperimentData;
};


export type MutationAddTagToExperimentArgs = {
  experimentTagInput: ExperimentTagInput;
};


export type MutationCreateExperimentArgs = {
  createExperimentInput: ExperimentCreateInput;
};


export type MutationRemoveExperimentArgs = {
  experimentRemoveInput: ExperimentRemoveInput;
};


export type MutationRemoveTagFromExperimentArgs = {
  experimentTagInput: ExperimentTagInput;
};


export type MutationUpdateExperimentArgs = {
  experimentId: Scalars['UUID']['input'];
  experimentUpdateInput: ExperimentUpdateInput;
};

export type Query = {
  __typename?: 'Query';
  experiment?: Maybe<ExperimentData>;
  experiments: Experiments;
  getCurrentUserInfo: UserInfo;
  tags: Tags;
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

/** Current user information */
export type UserInfo = {
  __typename?: 'UserInfo';
  /** List of scopes available to the user. */
  scopes: Array<Scalars['String']['output']>;
  /** Username. */
  username: Scalars['String']['output'];
};

export type AddTagToExperimentMutationVariables = Exact<{
  experimentId: Scalars['UUID']['input'];
  tag: Scalars['String']['input'];
}>;


export type AddTagToExperimentMutation = { __typename?: 'Mutation', addTagToExperiment: { __typename?: 'ExperimentData', id: any, tags: Array<string> } };

export type RemoveTagFromExperimentMutationVariables = Exact<{
  experimentId: Scalars['UUID']['input'];
  tag: Scalars['String']['input'];
}>;


export type RemoveTagFromExperimentMutation = { __typename?: 'Mutation', removeTagFromExperiment: { __typename?: 'ExperimentData', id: any, tags: Array<string> } };

export type UpdateExperimentNameMutationVariables = Exact<{
  experimentId: Scalars['UUID']['input'];
  experimentUpdateInput: ExperimentUpdateInput;
}>;


export type UpdateExperimentNameMutation = { __typename?: 'Mutation', updateExperiment: { __typename?: 'ExperimentData', id: any, title: string, description?: string | null, alias: string } };

export type GetAllExperimentsQueryVariables = Exact<{
  offset: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  filters?: InputMaybe<ExperimentFiltersInput>;
}>;


export type GetAllExperimentsQuery = { __typename?: 'Query', experiments: { __typename?: 'Experiments', totalExperimentsCount: number, experimentsData: Array<{ __typename?: 'ExperimentData', id: any, alias: string, title: string, description?: string | null, tags: Array<string>, createdAt: any, createdBy: string }> } };

export type GetAllTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTagsQuery = { __typename?: 'Query', tags: { __typename?: 'Tags', tagsData: Array<string> } };

export type GetExperimentByIdQueryVariables = Exact<{
  experimentIdentifier: ExperimentIdentifierInput;
}>;


export type GetExperimentByIdQuery = { __typename?: 'Query', experiment?: { __typename?: 'ExperimentData', id: any, title: string, description?: string | null, tags: Array<string>, alias: string, createdAt: any, createdBy: string, files: Array<{ __typename?: 'ExperimentFile', name: string, path: string, modifiedAt: any }> } | null };

export type GetExperimentFilesByIdQueryVariables = Exact<{
  experimentIdentifier: ExperimentIdentifierInput;
}>;


export type GetExperimentFilesByIdQuery = { __typename?: 'Query', experiment?: { __typename?: 'ExperimentData', files: Array<{ __typename?: 'ExperimentFile', name: string, path: string, modifiedAt: any }> } | null };


export const AddTagToExperimentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addTagToExperiment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"experimentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addTagToExperiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"experimentTagInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"experimentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"experimentId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"tag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tag"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}}]} as unknown as DocumentNode<AddTagToExperimentMutation, AddTagToExperimentMutationVariables>;
export const RemoveTagFromExperimentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeTagFromExperiment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"experimentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeTagFromExperiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"experimentTagInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"experimentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"experimentId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"tag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tag"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}}]} as unknown as DocumentNode<RemoveTagFromExperimentMutation, RemoveTagFromExperimentMutationVariables>;
export const UpdateExperimentNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateExperimentName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"experimentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"experimentUpdateInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExperimentUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateExperiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"experimentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"experimentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"experimentUpdateInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"experimentUpdateInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}}]}}]}}]} as unknown as DocumentNode<UpdateExperimentNameMutation, UpdateExperimentNameMutationVariables>;
export const GetAllExperimentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllExperiments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ExperimentFiltersInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"experiments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"experimentsData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalExperimentsCount"}}]}}]}}]} as unknown as DocumentNode<GetAllExperimentsQuery, GetAllExperimentsQueryVariables>;
export const GetAllTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllTags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tagsData"}}]}}]}}]} as unknown as DocumentNode<GetAllTagsQuery, GetAllTagsQueryVariables>;
export const GetExperimentByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getExperimentById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"experimentIdentifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExperimentIdentifierInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"experiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"experimentIdentifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"experimentIdentifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetExperimentByIdQuery, GetExperimentByIdQueryVariables>;
export const GetExperimentFilesByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getExperimentFilesById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"experimentIdentifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExperimentIdentifierInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"experiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"experimentIdentifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"experimentIdentifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetExperimentFilesByIdQuery, GetExperimentFilesByIdQueryVariables>;