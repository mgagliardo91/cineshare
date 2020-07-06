import { Movie } from "../../models/movie";
import models from "../../models";
import { batchId } from "./utils";

export const batchMovies = async (keys: string[]): Promise<Movie[]> => {
  return (await batchId(keys, models.Movie)) as Movie[];
};
