
import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { Context } from './types';
import { User } from '../models/User';
import controllers from '../controllers';
import { combineResolvers } from 'graphql-resolvers';
import { isAdmin } from './authorization';

const createToken = async (user: User, secret: string, expiresIn: string) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, { expiresIn });
};

export default {
  Query: {
    users: async (_: void, args: void, { controllers }: Context) => {
      return await controllers.User.findAll();
    },
    me: async (_: void, args: void, { me }: Context) => {
      return await controllers.User.findById(me.id);
    },
    user: async (_: void, { id }: { id: number }, { controllers }: Context) => {
      return await controllers.User.findById(id);
    }
  },
  Mutation: {
    signUp: async (parent: void, { username, email, password }: { username: string, email: string, password: string }, { controllers, secret}: Context) => {
      const user = await controllers.User.model.create({
        username,
        email,
        password
      });

      return { token: createToken(user, secret, '30m') };
    },
    signIn: async( parent: void, { login, password }: { login: string, password: string }, { controllers, secret }: Context) => {
      const user = await controllers.User.findByLogin(login);

      if (!user) {
        throw new UserInputError('No user found with this login credentials.');
      }

      const isValid = await user.validatePassword(password);
      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return {
        token: createToken(user, secret, '30m')
      }
    },
    deleteUser: combineResolvers(
      isAdmin,
      async (parent: void, { id }: { id: string }, { controllers }: Context) => {
      return await controllers.User.model.destroy({ where: { id }})
    })
  },
  User: {
    messages: async(user: User, args: void, { controllers }: Context) => {
      return await controllers.Message.findAllByUserId(user.id);
    }
  },
}