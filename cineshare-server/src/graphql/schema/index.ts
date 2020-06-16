import { gql } from 'apollo-server-express';
import userSchema from './user';
import movieSchema from './movie';
import userMovieSchema from './userMovie';

const linkSchema = gql`
  scalar Date
  type Query {
    _: Boolean
  }
 
  type Mutation {
    _: Boolean
  }
 
  type Subscription {
    _: Boolean
  }

  type PageInfo {
    cursor: String
    hasNextPage: Boolean!
  }
`;

export default [linkSchema, userSchema, movieSchema, userMovieSchema];