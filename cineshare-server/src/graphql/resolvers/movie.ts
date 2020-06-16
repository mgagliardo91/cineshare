import { Context, Pagination } from '../types';
import { findAllWithCursor } from './utils';

type unused = void;

export default {
  Query: {
    movies: async (_parent: unused, pagination: Pagination, { models }: Context) => {
      return await findAllWithCursor(models.Movie, pagination);
    },
    user: async (_parent: unused, { id }: { id: string }, { models }: Context) => {
      return await models.Movie.findByPk(id);
    }
  }
}