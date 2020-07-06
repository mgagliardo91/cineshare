import { Context, Pagination } from "../types";
import { findAllWithCursor } from "./utils";
import { Movie } from "../../models/movie";
type unused = void;

const dynamicFields = [
  "year",
  "rated",
  "releaseDate",
  "runTime",
  "genre",
  "director",
  "writer",
  "plot",
  "imdbRating",
  "rtRating",
  "mcRating",
];

const dynamicFieldResolvers = dynamicFields.reduce(
  (acc: { [key: string]: any }, field: string) => {
    acc[field] = (parent: Movie) => {
      return (parent.data as any)[field];
    };
    return acc;
  },
  {}
);

export default {
  Query: {
    movies: async (
      _parent: unused,
      pagination: Pagination,
      { models }: Context
    ) => {
      return await findAllWithCursor(models.Movie, pagination);
    },
    movie: async (
      _parent: unused,
      { id }: { id: string },
      { models }: Context
    ) => {
      return await models.Movie.findByPk(id);
    },
  },
  Movie: {
    ...dynamicFieldResolvers,
  },
};
