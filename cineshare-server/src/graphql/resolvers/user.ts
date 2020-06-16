import { Context, Pagination } from '../types';
import { User } from '../../models/user';
import { findAllWithCursor } from './utils';

type unused = void;

export default {
  Query: {
    users: async (_parent: unused, pagination: Pagination, { models }: Context) => {
      return await findAllWithCursor(models.User, pagination);
    },
    user: async (_parent: unused, { id }: { id: string }, { models }: Context) => {
      return await models.User.findByPk(id);
    }
  },
  User: {
    movies: async (user: User, pagination: Pagination, { models }: Context) => {
      return await findAllWithCursor(models.UserMovie, pagination, { where: { userId: user.id }});
    }
  }
}