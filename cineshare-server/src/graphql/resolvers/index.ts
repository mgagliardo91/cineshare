import { GraphQLDateTime } from 'graphql-iso-date';
import userResolvers from './user';
import movieResolvers from './movie';
import userMovieResolvers from './userMovie';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [customScalarResolver, userResolvers, movieResolvers, userMovieResolvers];