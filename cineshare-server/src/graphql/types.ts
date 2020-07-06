import { Models } from "../models";
import loaders from "./loaders";

export interface Context {
  models: Models;
  user: UserToken;
  loaders: typeof loaders;
}

export interface Pagination {
  cursor?: string;
  limit?: number;
}

export interface UserToken {
  id?: string;
  email?: string;
}
