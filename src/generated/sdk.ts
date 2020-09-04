import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  serverMessage: Maybe<Scalars['String']>;
};

export type GetServerMessageQueryVariables = Exact<{ [key: string]: never; }>;


export type GetServerMessageQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'serverMessage'>
);


export const GetServerMessageDocument = gql`
    query getServerMessage {
  serverMessage
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getServerMessage(variables?: GetServerMessageQueryVariables): Promise<GetServerMessageQuery> {
      return withWrapper(() => client.request<GetServerMessageQuery>(print(GetServerMessageDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;