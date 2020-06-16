import { Sequelize } from 'sequelize-typescript';
import { User } from './user';
import { UserMovie } from './userMovie';
import { Movie } from './movie';
import { ModelCtor, Model } from 'sequelize';

const sequelize = new Sequelize(
  'postgres',
  'postgres',
  'postgres',
  {
    dialect: 'postgres',
    port: 6000
  }
);
sequelize.addModels([User, Movie, UserMovie]);

export { sequelize };

export interface Models {
  User: ModelCtor<Model<any, any>>;
  Movie: ModelCtor<Model<any, any>>;
  UserMovie: ModelCtor<Model<any, any>>; 
}

const models: Models = {
  User: sequelize.models['user'],
  Movie: sequelize.models['movie'],
  UserMovie: sequelize.models['userMovie']
}

export default models;