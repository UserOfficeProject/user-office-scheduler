import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { RequestDocument, Variables } from 'graphql-request';

/**
 * This type is taken from the graphql-request package and used when extending the GraphQLClient
 */
export type RequestQuery<T, V extends Variables> =
  | RequestDocument
  | TypedDocumentNode<T, V>;
