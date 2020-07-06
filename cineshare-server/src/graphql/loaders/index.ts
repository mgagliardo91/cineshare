import DataLoader from "dataloader";
import { batchMovies } from "./movie";
import { batchUsers } from "./user";

const movieLoader = new DataLoader((keys: string[]) => batchMovies(keys));
const userLoader = new DataLoader((keys: string[]) => batchUsers(keys));

export default {
  movie: movieLoader,
  user: userLoader,
};
