/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation addTagToExperiment($experimentId: UUID!, $tag: String!) {\n    addTagToExperiment(experimentTagInput: { experimentId: $experimentId, tag: $tag }) {\n      id\n      tags\n    }\n  }\n": types.AddTagToExperimentDocument,
    "\n    mutation removeExperiment($experimentId: UUID!) {\n        removeExperiment(experimentRemoveInput: { experimentId: $experimentId})\n    }\n": types.RemoveExperimentDocument,
    "\n  mutation removeTagFromExperiment($experimentId: UUID!, $tag: String!) {\n    removeTagFromExperiment(experimentTagInput: { experimentId: $experimentId, tag: $tag }) {\n      id\n      tags\n    }\n  }\n": types.RemoveTagFromExperimentDocument,
    "\n  mutation updateExperimentName(\n    $experimentId: UUID!\n    $experimentUpdateInput: ExperimentUpdateInput!\n  ) {\n    updateExperiment(experimentId: $experimentId, experimentUpdateInput: $experimentUpdateInput) {\n      id\n      title\n      description\n      alias\n    }\n  }\n": types.UpdateExperimentNameDocument,
    "\n  query getAllExperiments($offset: Int!, $limit: Int!, $filters: ExperimentFiltersInput) {\n    experiments(offset: $offset, limit: $limit, filters: $filters) {\n      experimentsData {\n        id\n        alias\n        title\n        description\n        tags\n        createdAt\n        createdBy\n      }\n      totalExperimentsCount\n    }\n  }\n": types.GetAllExperimentsDocument,
    "\n  query getAllTags {\n    tags {\n      tagsData\n    }\n  }\n": types.GetAllTagsDocument,
    "\n  query getExperimentById($experimentIdentifier: ExperimentIdentifierInput!) {\n    experiment(experimentIdentifier: $experimentIdentifier) {\n      id\n      title\n      description\n      tags\n      alias\n      createdAt\n      createdBy\n      files {\n        name\n        path\n        modifiedAt\n      }\n    }\n  }\n": types.GetExperimentByIdDocument,
    "\n  query getExperimentFilesById($experimentIdentifier: ExperimentIdentifierInput!) {\n    experiment(experimentIdentifier: $experimentIdentifier) {\n      files {\n        name\n        path\n        modifiedAt\n      }\n    }\n  }\n": types.GetExperimentFilesByIdDocument,
    "\n  query getCurrentUserInfo {\n    getCurrentUserInfo {\n      scopes\n      username\n    }\n  }\n": types.GetCurrentUserInfoDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addTagToExperiment($experimentId: UUID!, $tag: String!) {\n    addTagToExperiment(experimentTagInput: { experimentId: $experimentId, tag: $tag }) {\n      id\n      tags\n    }\n  }\n"): (typeof documents)["\n  mutation addTagToExperiment($experimentId: UUID!, $tag: String!) {\n    addTagToExperiment(experimentTagInput: { experimentId: $experimentId, tag: $tag }) {\n      id\n      tags\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation removeExperiment($experimentId: UUID!) {\n        removeExperiment(experimentRemoveInput: { experimentId: $experimentId})\n    }\n"): (typeof documents)["\n    mutation removeExperiment($experimentId: UUID!) {\n        removeExperiment(experimentRemoveInput: { experimentId: $experimentId})\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeTagFromExperiment($experimentId: UUID!, $tag: String!) {\n    removeTagFromExperiment(experimentTagInput: { experimentId: $experimentId, tag: $tag }) {\n      id\n      tags\n    }\n  }\n"): (typeof documents)["\n  mutation removeTagFromExperiment($experimentId: UUID!, $tag: String!) {\n    removeTagFromExperiment(experimentTagInput: { experimentId: $experimentId, tag: $tag }) {\n      id\n      tags\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateExperimentName(\n    $experimentId: UUID!\n    $experimentUpdateInput: ExperimentUpdateInput!\n  ) {\n    updateExperiment(experimentId: $experimentId, experimentUpdateInput: $experimentUpdateInput) {\n      id\n      title\n      description\n      alias\n    }\n  }\n"): (typeof documents)["\n  mutation updateExperimentName(\n    $experimentId: UUID!\n    $experimentUpdateInput: ExperimentUpdateInput!\n  ) {\n    updateExperiment(experimentId: $experimentId, experimentUpdateInput: $experimentUpdateInput) {\n      id\n      title\n      description\n      alias\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllExperiments($offset: Int!, $limit: Int!, $filters: ExperimentFiltersInput) {\n    experiments(offset: $offset, limit: $limit, filters: $filters) {\n      experimentsData {\n        id\n        alias\n        title\n        description\n        tags\n        createdAt\n        createdBy\n      }\n      totalExperimentsCount\n    }\n  }\n"): (typeof documents)["\n  query getAllExperiments($offset: Int!, $limit: Int!, $filters: ExperimentFiltersInput) {\n    experiments(offset: $offset, limit: $limit, filters: $filters) {\n      experimentsData {\n        id\n        alias\n        title\n        description\n        tags\n        createdAt\n        createdBy\n      }\n      totalExperimentsCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllTags {\n    tags {\n      tagsData\n    }\n  }\n"): (typeof documents)["\n  query getAllTags {\n    tags {\n      tagsData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getExperimentById($experimentIdentifier: ExperimentIdentifierInput!) {\n    experiment(experimentIdentifier: $experimentIdentifier) {\n      id\n      title\n      description\n      tags\n      alias\n      createdAt\n      createdBy\n      files {\n        name\n        path\n        modifiedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query getExperimentById($experimentIdentifier: ExperimentIdentifierInput!) {\n    experiment(experimentIdentifier: $experimentIdentifier) {\n      id\n      title\n      description\n      tags\n      alias\n      createdAt\n      createdBy\n      files {\n        name\n        path\n        modifiedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getExperimentFilesById($experimentIdentifier: ExperimentIdentifierInput!) {\n    experiment(experimentIdentifier: $experimentIdentifier) {\n      files {\n        name\n        path\n        modifiedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query getExperimentFilesById($experimentIdentifier: ExperimentIdentifierInput!) {\n    experiment(experimentIdentifier: $experimentIdentifier) {\n      files {\n        name\n        path\n        modifiedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCurrentUserInfo {\n    getCurrentUserInfo {\n      scopes\n      username\n    }\n  }\n"): (typeof documents)["\n  query getCurrentUserInfo {\n    getCurrentUserInfo {\n      scopes\n      username\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;