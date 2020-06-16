
import { gql } from 'apollo-server-express';
 
export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(
      username: String!
      email: String!
      password: String!
    ): Token!
    signIn(login: String!, password: String!): Token!
    deleteUser(id: ID!): Boolean!
  }
 
  type Token {
    token: String!
  }
 
  type User {
    id: ID!
    role: String
    username: String!
    messages: [Message!]
    email: String!
  }
`;