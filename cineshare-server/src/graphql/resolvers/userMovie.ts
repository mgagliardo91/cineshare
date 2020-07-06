import { Context, Pagination } from "../types";
import { UserMovie } from "../../models/userMovie";
import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./authorization";
import { findOrCreateMovie } from "../../controllers/movie";
import { findAllWithCursor } from "./utils";
import { UserInputError } from "apollo-server-express";
import { NotFoundError } from "../../error/NotFoundError";

type unused = void;

export default {
  Query: {
    collection: combineResolvers(
      isAuthenticated,
      async (
        _parent: unused,
        pagination: Pagination,
        { models, user }: Context
      ) => {
        return await findAllWithCursor(models.UserMovie, pagination, {
          where: { userId: user.id },
        });
      }
    ),
  },
  Mutation: {
    addMovie: combineResolvers(
      isAuthenticated,
      async (
        _parent: unused,
        { imdbId, id }: { imdbId?: string; id?: string },
        { models, user }: Context
      ) => {
        let movie;
        if (id) {
          movie = await models.Movie.findByPk(id);

          if (!movie) {
            throw new NotFoundError(`Unable to locate movie with id ${id}`);
          }
        } else if (imdbId) {
          movie = await findOrCreateMovie(imdbId, models);
        } else {
          throw new UserInputError(`Id or IMDb ID is required`);
        }

        const [userMovie] = await models.UserMovie.findOrCreate({
          where: {
            movieId: movie.id,
            userId: user.id,
          },
          defaults: {
            movieId: movie.id,
            userId: user.id,
          },
        });

        return userMovie;
      }
    ),
    deleteMovie: combineResolvers(
      isAuthenticated,
      async (
        _parent: unused,
        { id }: { id: string },
        { models, user }: Context
      ) => {
        return await models.UserMovie.destroy({
          where: {
            id: id,
            userId: user.id,
          },
        });
      }
    ),
  },
  UserMovie: {
    user: async (userMovie: UserMovie, _args: unused, { loaders }: Context) => {
      return await loaders.user.load(userMovie.userId);
    },
    movie: async (
      userMovie: UserMovie,
      _args: unused,
      { loaders }: Context
    ) => {
      return await loaders.movie.load(userMovie.movieId);
    },
  },
};
