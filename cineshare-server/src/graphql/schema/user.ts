import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    users(limit: Int, cursor: String): UserConnection!
    user(id: ID!): User
    account: User!
  }

  extend type Mutation {
    signUp(email: String!, password: String!): UserToken!
    signIn(email: String!, password: String!): UserToken!
  }

  type User {
    id: ID!
    collection(limit: Int, cursor: String): UserMovieConnection!
    email: String!
  }

  type UserConnection {
    edges: [User!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  type UserToken {
    token: String!
  }
`;
