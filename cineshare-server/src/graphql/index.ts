import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import schema from './schema';
import resolvers from './resolvers';
import models from '../models';

export default new ApolloServer({
  typeDefs: schema,
  resolvers,
  validationRules: [depthLimit(7)],
  context: async ({ req }) => {
    if (req) {
      return {
        models,
        secret: process.env.SECRET
      }
    }
  },
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');
 
    return {
      ...error,
      message,
    };
  },
});