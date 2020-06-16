import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users(limit: Int, cursor: String): UserConnection!
    user(id: ID!): User
  }

  type User {
    id: ID!
    movies(limit: Int, cursor: String): UserMovieConnection!
    email: String!
  }

  type UserConnection {
    edges: [User!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }
`;