/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  /** Date (isoformat) */
  Date: any;
  /** Date with time (isoformat) */
  DateTime: any;
  UUID: any;
};

export type ExperimentCreateInput = {
  description: Scalars['String'];
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
};

/** Single experiment with its data. */
export type ExperimentData = {
  __typename?: 'ExperimentData';
  /** Alias of the experiment. */
  alias: Scalars['String'];
  /** Creation date of the experiment. */
  createdAt: Scalars['DateTime'];
  /** Description of the experiment. */
  description?: Maybe<Scalars['String']>;
  /** List of files in an experiment. */
  files: Array<ExperimentFile>;
  /** Unique identifier of the experiment. */
  id: Scalars['UUID'];
  /** Tags of the experiment. */
  tags: Array<Scalars['String']>;
  /** Title of the experiment. */
  title: Scalars['String'];
  /** Last update date of the experiment. */
  updatedAt: Scalars['DateTime'];
};

/** Single file in an experiment */
export type ExperimentFile = {
  __typename?: 'ExperimentFile';
  /** Last modified date of the file. */
  modifiedAt: Scalars['DateTime'];
  /** Full name of the file. */
  name: Scalars['String'];
  /** Relative path of the file to the download route. */
  path: Scalars['String'];
};

export type ExperimentFiltersInput = {
  /** Filter experiments created after this date. */
  endDate?: InputMaybe<Scalars['Date']>;
  /** List of tags that should be present. */
  shouldIncludeTags?: InputMaybe<Array<Scalars['String']>>;
  /** Filter experiments created after this date. */
  startDate?: InputMaybe<Scalars['Date']>;
  /** List of tags to filter. */
  tags?: InputMaybe<Array<Scalars['String']>>;
  /** Search string for experiment title and alias. */
  title?: InputMaybe<Scalars['String']>;
};

export type ExperimentIdentifierInput = {
  type: IdType;
  value: Scalars['String'];
};

export type ExperimentTagInput = {
  experimentId: Scalars['UUID'];
  tag: Scalars['String'];
};

export type ExperimentUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

/** Paginated list of experiments */
export type Experiments = {
  __typename?: 'Experiments';
  /** The list of experiments in this page */
  experimentsData: Array<ExperimentData>;
  /** Total number of experiments in the filtered dataset */
  totalExperimentsCount: Scalars['Int'];
};

export enum IdType {
  Alias = 'ALIAS',
  Uuid = 'UUID'
}

export type Mutation = {
  __typename?: 'Mutation';
  addTagToExperiment: ExperimentData;
  createExperiment: ExperimentData;
  removeTagFromExperiment: ExperimentData;
  updateExperiment: ExperimentData;
};


export type MutationAddTagToExperimentArgs = {
  experimentTagInput: ExperimentTagInput;
};


export type MutationCreateExperimentArgs = {
  createExperimentInput: ExperimentCreateInput;
};


export type MutationRemoveTagFromExperimentArgs = {
  experimentTagInput: ExperimentTagInput;
};


export type MutationUpdateExperimentArgs = {
  experimentId: Scalars['UUID'];
  experimentUpdateInput: ExperimentUpdateInput;
};

export type Query = {
  __typename?: 'Query';
  experiment?: Maybe<ExperimentData>;
  experiments: Experiments;
  tags: Tags;
};


export type QueryExperimentArgs = {
  experimentIdentifier: ExperimentIdentifierInput;
};


export type QueryExperimentsArgs = {
  filters?: InputMaybe<ExperimentFiltersInput>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryTagsArgs = {
  filters?: InputMaybe<TagsFilters>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

/** Paginated list of experiments */
export type Tags = {
  __typename?: 'Tags';
  /** The list of tags. */
  tagsData: Array<Scalars['String']>;
  /** Total number of tags. */
  totalTagsCount: Scalars['Int'];
};

export type TagsFilters = {
  /** Include tags with no experiments linked. */
  includeDangling?: InputMaybe<Scalars['Boolean']>;
};

export type AddTagToExperimentMutationVariables = Exact<{
  experimentId: Scalars['UUID'];
  tag: Scalars['String'];
}>;


export type AddTagToExperimentMutation = { __typename?: 'Mutation', addTagToExperiment: { __typename?: 'ExperimentData', id: any, tags: Array<string> } };

export type RemoveTagFromExperimentMutationVariables = Exact<{
  experimentId: Scalars['UUID'];
  tag: Scalars['String'];
}>;


export type RemoveTagFromExperimentMutation = { __typename?: 'Mutation', removeTagFromExperiment: { __typename?: 'ExperimentData', id: any, tags: Array<string> } };

export type UpdateExperimentNameMutationVariables = Exact<{
  experimentId: Scalars['UUID'];
  experimentUpdateInput: ExperimentUpdateInput;
}>;


export type UpdateExperimentNameMutation = { __typename?: 'Mutation', updateExperiment: { __typename?: 'ExperimentData', id: any, title: string, description?: string | null, alias: string } };

export type GetAllExperimentsQueryVariables = Exact<{
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  filters?: InputMaybe<ExperimentFiltersInput>;
}>;


export type GetAllExperimentsQuery = { __typename?: 'Query', experiments: { __typename?: 'Experiments', totalExperimentsCount: number, experimentsData: Array<{ __typename?: 'ExperimentData', id: any, alias: string, title: string, description?: string | null, tags: Array<string>, createdAt: any }> } };

export type GetAllTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTagsQuery = { __typename?: 'Query', tags: { __typename?: 'Tags', tagsData: Array<string> } };

export type GetExperimentByIdQueryVariables = Exact<{
  experimentIdentifier: ExperimentIdentifierInput;
}>;


export type GetExperimentByIdQuery = { __typename?: 'Query', experiment?: { __typename?: 'ExperimentData', id: any, title: string, description?: string | null, tags: Array<string>, alias: string, createdAt: any, files: Array<{ __typename?: 'ExperimentFile', name: string, path: string, modifiedAt: any }> } | null };

export type GetExperimentFilesByIdQueryVariables = Exact<{
  experimentIdentifier: ExperimentIdentifierInput;
}>;


export type GetExperimentFilesByIdQuery = { __typename?: 'Query', experiment?: { __typename?: 'ExperimentData', files: Array<{ __typename?: 'ExperimentFile', name: string, path: string, modifiedAt: any }> } | null };


export const AddTagToExperimentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addTagToExperiment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"experimentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addTagToExperiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"experimentTagInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"experimentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"experimentId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"tag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tag"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}}]} as unknown as DocumentNode<AddTagToExperimentMutation, AddTagToExperimentMutationVariables>;
export const RemoveTagFromExperimentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeTagFromExperiment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"experimentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeTagFromExperiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"experimentTagInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"experimentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"experimentId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"tag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tag"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}}]} as unknown as DocumentNode<RemoveTagFromExperimentMutation, RemoveTagFromExperimentMutationVariables>;
export const UpdateExperimentNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateExperimentName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"experimentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"experimentUpdateInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExperimentUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateExperiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"experimentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"experimentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"experimentUpdateInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"experimentUpdateInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}}]}}]}}]} as unknown as DocumentNode<UpdateExperimentNameMutation, UpdateExperimentNameMutationVariables>;
export const GetAllExperimentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllExperiments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ExperimentFiltersInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"experiments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"experimentsData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalExperimentsCount"}}]}}]}}]} as unknown as DocumentNode<GetAllExperimentsQuery, GetAllExperimentsQueryVariables>;
export const GetAllTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllTags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tagsData"}}]}}]}}]} as unknown as DocumentNode<GetAllTagsQuery, GetAllTagsQueryVariables>;
export const GetExperimentByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getExperimentById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"experimentIdentifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExperimentIdentifierInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"experiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"experimentIdentifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"experimentIdentifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetExperimentByIdQuery, GetExperimentByIdQueryVariables>;
export const GetExperimentFilesByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getExperimentFilesById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"experimentIdentifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExperimentIdentifierInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"experiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"experimentIdentifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"experimentIdentifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetExperimentFilesByIdQuery, GetExperimentFilesByIdQueryVariables>;