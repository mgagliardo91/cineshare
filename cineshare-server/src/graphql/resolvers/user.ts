import { UserInputError, AuthenticationError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";
import { Context, Pagination } from "../types";
import { User } from "../../models/user";
import { findAllWithCursor } from "./utils";
import { createUserToken } from "../authentication";
import { isAuthenticated } from "./authorization";

type unused = void;

interface SignUpParameters {
  email: string;
  password: string;
}

type SignInParameters = SignUpParameters;

export default {
  Mutation: {
    signUp: async (
      _parent: unused,
      { email, password }: SignUpParameters,
      { models }: Context
    ) => {
      const user = await models.User.create({ email, password });

      return {
        token: await createUserToken(user),
      };
    },
    signIn: async (
      _parent: unused,
      { email, password }: SignInParameters,
      { models }: Context
    ) => {
      const user = await models.User.findByEmail(email);
      if (!user) {
        throw new UserInputError("No user found with this login credentials.");
      }

      const isValid = await user.validatePassword(password);
      if (!isValid) {
        throw new AuthenticationError("Invalid password.");
      }

      return {
        token: createUserToken(user),
      };
    },
  },
  Query: {
    account: combineResolvers(
      isAuthenticated,
      async (_parent: unused, _args: {}, { models, user }: Context) => {
        return await models.User.findByPk(user.id);
      }
    ),
    users: combineResolvers(
      isAuthenticated,
      async (_parent: unused, pagination: Pagination, { models }: Context) => {
        return await findAllWithCursor(models.User, pagination);
      }
    ),
    user: combineResolvers(
      isAuthenticated,
      async (_parent: unused, { id }: { id: string }, { models }: Context) => {
        return await models.User.findByPk(id);
      }
    ),
  },
  User: {
    collection: async (
      user: User,
      pagination: Pagination,
      { models }: Context
    ) => {
      return await findAllWithCursor(models.UserMovie, pagination, {
        where: { userId: user.id },
      });
    },
  },
};
