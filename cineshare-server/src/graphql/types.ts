import { Models } from '../models';

export interface Context {
  models: Models;
}

export interface Pagination {
  cursor?: string;
  limit?: number;
}