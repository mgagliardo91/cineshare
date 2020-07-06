import gql from 'graphql-tag';

const IMovieFragment = gql`
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

export const IGetMovies = gql`
  query GetMovies {
    movies {
      edges {
        ...MovieFragment
      }
    }
  }
  ${IMovieFragment}
`;
