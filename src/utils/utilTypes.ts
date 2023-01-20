import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
  RequestDocument,
  Variables,
  RemoveIndex,
} from 'graphql-request/dist/types';
import * as Dom from 'graphql-request/dist/types.dom';

/**
 * This type is taken from the graphql-request package and used when extending the GraphQLClient
 */
export type RequestQuery<T, V extends Variables> =
  | RequestDocument
  | TypedDocumentNode<T, V>;

/**
 * This type is taken from the graphql-request package and used when extending the GraphQLClient
 */
export type VariablesAndRequestHeaders<V> = V extends Record<string, never>
  ? [variables?: V, requestHeaders?: Dom.RequestInit['headers']]
  : keyof RemoveIndex<V> extends never
  ? [variables?: V, requestHeaders?: Dom.RequestInit['headers']]
  : [variables: V, requestHeaders?: Dom.RequestInit['headers']];
