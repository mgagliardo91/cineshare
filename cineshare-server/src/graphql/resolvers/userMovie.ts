import { Context } from '../types';
import { UserMovie } from '../../models/userMovie';

type unused = void;

export default {
  UserMovie: {
    user: async (userMovie: UserMovie, _args: unused, { models }: Context) => {
      return await models.User.findByPk(userMovie.userId);
    },
    movie: async (userMovie: UserMovie, _args: unused, { models }: Context) => {
      return await models.Movie.findByPk(userMovie.movieId);
    }
  }
}