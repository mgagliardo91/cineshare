import { Model, DataTypes } from 'sequelize';
import generateId, { isValidId } from 'utils/generateId';

const imdbIdRegex = /^tt\d+$/;

export default (sequelize) => {
  class Movie extends Model {}
  Movie.init({
    id: {
      type: DataTypes.STRING,
      notNull: true,
      primaryKey: true,
      validate: {
        isId(value) {
          return isValidId(value);
        }
      },
      defaultValue() {
        return generateId();
      }
    },
    title: {
      type: DataTypes.STRING,
      notNull: true
    },
    imdbId: {
      type: DataTypes.STRING,
      notNull: true,
      unique: true,
      validate: {
        isImdbId(value) {
          return imdbIdRegex.test(value);
        }
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    data: {
      type: DataTypes.JSONB,
      notNull: true
    }
  }, {
    sequelize,
    underscored: true,
    modelName: 'movie'
  });
  Movie.findByImdbId = async (value) => {
    return await Movie.findOne({ where: { imdbId: value }});
  }
  return Movie;
};
