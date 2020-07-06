/* eslint-disable */
import * as Types from '../../interfaces/graphql';

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';

export type ISignInMutationVariables = Types.Exact<{
  email: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;

export type ISignInMutation = { __typename?: 'Mutation' } & {
  signIn: { __typename?: 'UserToken' } & Pick<Types.IUserToken, 'token'>;
};

export const SignInDocument = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
    }
  }
`;
export type ISignInMutationFn = ApolloReactCommon.MutationFunction<
  ISignInMutation,
  ISignInMutationVariables
>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignInMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ISignInMutation,
    ISignInMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ISignInMutation,
    ISignInMutationVariables
  >(SignInDocument, baseOptions);
}
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = ApolloReactCommon.MutationResult<
  ISignInMutation
>;
export type SignInMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ISignInMutation,
  ISignInMutationVariables
>;
