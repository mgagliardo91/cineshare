import DataLoader from 'dataloader';
import { UserToken, User } from '../models/User';
import controllers from '../controllers';

export interface Pagination {
  cursor?: string;
  limit?: number;
}

export interface Context {
  me: UserToken;
  controllers: typeof controllers;
  secret: string;
  loaders: {
    user: DataLoader<number, User, number>;
  }
}