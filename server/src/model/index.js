import Sequelize from 'sequelize';
import userModel from './user';
import movieModel from './movie';
import userMovieModel from './userMovie';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres'
  }
);

const modelGenerators = {
  User: userModel,
  Movie: movieModel,
  UserMovie: userMovieModel
};

const models = Object.keys(modelGenerators).reduce((acc, modelName) => {
  acc[modelName] = modelGenerators[modelName](sequelize);
  return acc;
}, {});

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    console.log('Associating ' + modelName)
    models[modelName].associate(models);
  }
});

export const User = models.User;
export const Movie = models.Movie;
export const UserMovie = models.UserMovie;
export { Sequelize };

export default sequelize;

