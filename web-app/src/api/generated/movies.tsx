/* eslint-disable */
import * as Types from '../../interfaces/graphql';

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';

export type IMovieFragmentFragment = { __typename?: 'Movie' } & Pick<
  Types.IMovie,
  | 'title'
  | 'imdbId'
  | 'year'
  | 'rated'
  | 'releaseDate'
  | 'runTime'
  | 'genre'
  | 'director'
  | 'writer'
  | 'plot'
  | 'imdbRating'
  | 'rtRating'
  | 'mcRating'
>;

export type IGetMoviesQueryVariables = Types.Exact<{ [key: string]: never }>;

export type IGetMoviesQuery = { __typename?: 'Query' } & {
  movies: { __typename?: 'MovieConnection' } & {
    edges: Array<{ __typename?: 'Movie' } & IMovieFragmentFragment>;
  };
};

export const MovieFragmentFragmentDoc = gql`
  fragment MovieFragment on Movie {
    title
    imdbId
    year
    rated
    releaseDate
    runTime
    genre
    director
    writer
    plot
    imdbRating
    rtRating
    mcRating
  }
`;
export const GetMoviesDocument = gql`
  query GetMovies {
    movies {
      edges {
        ...MovieFragment
      }
    }
  }
  ${MovieFragmentFragmentDoc}
`;

/**
 * __useGetMoviesQuery__
 *
 * To run a query within a React component, call `useGetMoviesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMoviesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMoviesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMoviesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IGetMoviesQuery,
    IGetMoviesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<IGetMoviesQuery, IGetMoviesQueryVariables>(
    GetMoviesDocument,
    baseOptions
  );
}
export function useGetMoviesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IGetMoviesQuery,
    IGetMoviesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    IGetMoviesQuery,
    IGetMoviesQueryVariables
  >(GetMoviesDocument, baseOptions);
}
export type GetMoviesQueryHookResult = ReturnType<typeof useGetMoviesQuery>;
export type GetMoviesLazyQueryHookResult = ReturnType<
  typeof useGetMoviesLazyQuery
>;
export type GetMoviesQueryResult = ApolloReactCommon.QueryResult<
  IGetMoviesQuery,
  IGetMoviesQueryVariables
>;
