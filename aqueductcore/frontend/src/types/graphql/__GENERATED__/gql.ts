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
    "\n  mutation addTagToExperiment($uuid: UUID!, $tag: String!) {\n    addTagToExperiment(experimentTagInput: { uuid: $uuid, tag: $tag }) {\n      uuid\n      tags\n    }\n  }\n": types.AddTagToExperimentDocument,
    "\n    mutation createExperiment($title: String!, $description: String!,  $tags: [String!]! ) {\n        createExperiment(createExperimentInput: { title: $title, description: $description, tags: $tags}) {\n            uuid\n            eid\n        }\n    }\n": types.CreateExperimentDocument,
    "\n    mutation removeExperiment($uuid: UUID!) {\n        removeExperiment(experimentRemoveInput: { uuid: $uuid})\n    }\n": types.RemoveExperimentDocument,
    "\n  mutation removeTagFromExperiment($uuid: UUID!, $tag: String!) {\n    removeTagFromExperiment(experimentTagInput: { uuid: $uuid, tag: $tag }) {\n      uuid\n      tags\n    }\n  }\n": types.RemoveTagFromExperimentDocument,
    "\n  mutation updateExperimentName(\n    $uuid: UUID!\n    $experimentUpdateInput: ExperimentUpdateInput!\n  ) {\n    updateExperiment(uuid: $uuid, experimentUpdateInput: $experimentUpdateInput) {\n      uuid\n      title\n      description\n      eid\n    }\n  }\n": types.UpdateExperimentNameDocument,
    "\n  mutation ExecuteExtension(\n    $extension: String!\n    $action: String!\n    $params: [[String!]!]!\n  ) {\n    executeExtension(extension: $extension, action: $action, params: $params) {\n      returnCode\n      stdErr\n      stdOut\n    }\n  }\n": types.ExecuteExtensionDocument,
    "\n  query getAllExperiments($offset: Int!, $limit: Int!, $filters: ExperimentFiltersInput) {\n    experiments(offset: $offset, limit: $limit, filters: $filters) {\n      experimentsData {\n        uuid\n        eid\n        title\n        description\n        tags\n        createdAt\n        createdBy\n      }\n      totalExperimentsCount\n    }\n  }\n": types.GetAllExperimentsDocument,
    "\n  query getAllTags {\n    tags {\n      tagsData\n    }\n  }\n": types.GetAllTagsDocument,
    "\n  query getExperimentById($experimentIdentifier: ExperimentIdentifierInput!) {\n    experiment(experimentIdentifier: $experimentIdentifier) {\n      uuid\n      title\n      description\n      tags\n      eid\n      createdAt\n      createdBy\n      files {\n        name\n        path\n        modifiedAt\n      }\n    }\n  }\n": types.GetExperimentByIdDocument,
    "\n  query getExperimentFilesById($experimentIdentifier: ExperimentIdentifierInput!) {\n    experiment(experimentIdentifier: $experimentIdentifier) {\n      uuid\n      files {\n        name\n        path\n        modifiedAt\n      }\n    }\n  }\n": types.GetExperimentFilesByIdDocument,
    "\n  query getAllExtensionNames {\n    extensions {\n      name\n    }\n  }\n": types.GetAllExtensionNamesDocument,
    "\n  query getAllExtensions {\n    extensions {\n        name\n        authors\n        description\n        actions {\n            description\n            experimentVariableName\n            name\n            parameters {\n                dataType\n                defaultValue\n                description\n                displayName\n                name\n                options\n            }\n        }\n    }\n  }\n": types.GetAllExtensionsDocument,
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
export function graphql(source: "\n  mutation addTagToExperiment($uuid: UUID!, $tag: String!) {\n    addTagToExperiment(experimentTagInput: { uuid: $uuid, tag: $tag }) {\n      uuid\n      tags\n    }\n  }\n"): (typeof documents)["\n  mutation addTagToExperiment($uuid: UUID!, $tag: String!) {\n    addTagToExperiment(experimentTagInput: { uuid: $uuid, tag: $tag }) {\n      uuid\n      tags\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createExperiment($title: String!, $description: String!,  $tags: [String!]! ) {\n        createExperiment(createExperimentInput: { title: $title, description: $description, tags: $tags}) {\n            uuid\n            eid\n        }\n    }\n"): (typeof documents)["\n    mutation createExperiment($title: String!, $description: String!,  $tags: [String!]! ) {\n        createExperiment(createExperimentInput: { title: $title, description: $description, tags: $tags}) {\n            uuid\n            eid\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation removeExperiment($uuid: UUID!) {\n        removeExperiment(experimentRemoveInput: { uuid: $uuid})\n    }\n"): (typeof documents)["\n    mutation removeExperiment($uuid: UUID!) {\n        removeExperiment(experimentRemoveInput: { uuid: $uuid})\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeTagFromExperiment($uuid: UUID!, $tag: String!) {\n    removeTagFromExperiment(experimentTagInput: { uuid: $uuid, tag: $tag }) {\n      uuid\n      tags\n    }\n  }\n"): (typeof documents)["\n  mutation removeTagFromExperiment($uuid: UUID!, $tag: String!) {\n    removeTagFromExperiment(experimentTagInput: { uuid: $uuid, tag: $tag }) {\n      uuid\n      tags\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateExperimentName(\n    $uuid: UUID!\n    $experimentUpdateInput: ExperimentUpdateInput!\n  ) {\n    updateExperiment(uuid: $uuid, experimentUpdateInput: $experimentUpdateInput) {\n      uuid\n      title\n      description\n      eid\n    }\n  }\n"): (typeof documents)["\n  mutation updateExperimentName(\n    $uuid: UUID!\n    $experimentUpdateInput: ExperimentUpdateInput!\n  ) {\n    updateExperiment(uuid: $uuid, experimentUpdateInput: $experimentUpdateInput) {\n      uuid\n      title\n      description\n      eid\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ExecuteExtension(\n    $extension: String!\n    $action: String!\n    $params: [[String!]!]!\n  ) {\n    executeExtension(extension: $extension, action: $action, params: $params) {\n      returnCode\n      stdErr\n      stdOut\n    }\n  }\n"): (typeof documents)["\n  mutation ExecuteExtension(\n    $extension: String!\n    $action: String!\n    $params: [[String!]!]!\n  ) {\n    executeExtension(extension: $extension, action: $action, params: $params) {\n      returnCode\n      stdErr\n      stdOut\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllExperiments($offset: Int!, $limit: Int!, $filters: ExperimentFiltersInput) {\n    experiments(offset: $offset, limit: $limit, filters: $filters) {\n      experimentsData {\n        uuid\n        eid\n        title\n        description\n        tags\n        createdAt\n        createdBy\n      }\n      totalExperimentsCount\n    }\n  }\n"): (typeof documents)["\n  query getAllExperiments($offset: Int!, $limit: Int!, $filters: ExperimentFiltersInput) {\n    experiments(offset: $offset, limit: $limit, filters: $filters) {\n      experimentsData {\n        uuid\n        eid\n        title\n        description\n        tags\n        createdAt\n        createdBy\n      }\n      totalExperimentsCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllTags {\n    tags {\n      tagsData\n    }\n  }\n"): (typeof documents)["\n  query getAllTags {\n    tags {\n      tagsData\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getExperimentById($experimentIdentifier: ExperimentIdentifierInput!) {\n    experiment(experimentIdentifier: $experimentIdentifier) {\n      uuid\n      title\n      description\n      tags\n      eid\n      createdAt\n      createdBy\n      files {\n        name\n        path\n        modifiedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query getExperimentById($experimentIdentifier: ExperimentIdentifierInput!) {\n    experiment(experimentIdentifier: $experimentIdentifier) {\n      uuid\n      title\n      description\n      tags\n      eid\n      createdAt\n      createdBy\n      files {\n        name\n        path\n        modifiedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getExperimentFilesById($experimentIdentifier: ExperimentIdentifierInput!) {\n    experiment(experimentIdentifier: $experimentIdentifier) {\n      uuid\n      files {\n        name\n        path\n        modifiedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query getExperimentFilesById($experimentIdentifier: ExperimentIdentifierInput!) {\n    experiment(experimentIdentifier: $experimentIdentifier) {\n      uuid\n      files {\n        name\n        path\n        modifiedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllExtensionNames {\n    extensions {\n      name\n    }\n  }\n"): (typeof documents)["\n  query getAllExtensionNames {\n    extensions {\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllExtensions {\n    extensions {\n        name\n        authors\n        description\n        actions {\n            description\n            experimentVariableName\n            name\n            parameters {\n                dataType\n                defaultValue\n                description\n                displayName\n                name\n                options\n            }\n        }\n    }\n  }\n"): (typeof documents)["\n  query getAllExtensions {\n    extensions {\n        name\n        authors\n        description\n        actions {\n            description\n            experimentVariableName\n            name\n            parameters {\n                dataType\n                defaultValue\n                description\n                displayName\n                name\n                options\n            }\n        }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCurrentUserInfo {\n    getCurrentUserInfo {\n      scopes\n      username\n    }\n  }\n"): (typeof documents)["\n  query getCurrentUserInfo {\n    getCurrentUserInfo {\n      scopes\n      username\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;