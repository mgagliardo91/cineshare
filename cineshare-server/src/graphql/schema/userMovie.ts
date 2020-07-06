import { gql } from "apollo-server-express";

export default gql`
  extend type Mutation {
    addMovie(imdbId: String, id: String): UserMovie!
    deleteMovie(id: String!): Boolean!
  }

  extend type Query {
    collection(limit: Int, cursor: String): UserMovieConnection!
  }

  type UserMovie {
    id: ID!
    movie: Movie!
    user: User!
  }

  type UserMovieConnection {
    edges: [UserMovie!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }
`;
