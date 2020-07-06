import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    movies: MovieConnection!
    movie(id: ID!): Movie
  }

  type Movie {
    id: ID!
    title: String!
    imdbId: String!
    year: Int!
    rated: String!
    releaseDate: Date!
    runTime: Int!
    genre: [String!]!
    director: String!
    writer: String!
    plot: String!
    imdbRating: Float
    rtRating: Int
    mcRating: Int
  }

  type MovieConnection {
    edges: [Movie!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }
`;
