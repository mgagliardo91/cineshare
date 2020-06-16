import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    movies: MovieConnection!
    movie(id: ID!): Movie
  }

  type Movie {
    id: ID!
    title: String!
    imdbId: String!
  }

  type MovieConnection {
    edges: [Movie!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }
`;