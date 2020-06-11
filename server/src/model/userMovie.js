import { Model, DataTypes } from 'sequelize';
import generateId, { isValidId } from 'utils/generateId';

export default (sequelize) => {
  class UserMovie extends Model {}
  UserMovie.init({
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      notNull: true
    },
    wishList: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      notNull: true
    }
  }, {
    sequelize,
    underscored: true,
    modelName: 'userMovie'
  });
  UserMovie.associate = (models) => {
    UserMovie.belongsTo(models.User, { foreignKeyConstraint: true });
    UserMovie.belongsTo(models.Movie, { foreignKeyConstraint: true });
    UserMovie.findByUserIdAndImdbId = async (userId, imdbId) => {
      return await UserMovie.findOne({
        where: {
          userId
        },
        include: {
          model: models.Movie,
          where: {
            imdbId
          }
        }
      });
    };
    UserMovie.findAllByUserId = async (userId) => {
      return await UserMovie.findAll({
        where: {
          userId
        },
        include: {
          model: models.Movie
        }
      });
    };
    UserMovie.findByUserIdAndId = async (userId, id) => {
      return await UserMovie.findOne({
        where: {
          id,
          userId
        },
        include: {
          model: models.Movie
        }
      });
    };
  };

  return UserMovie;
};