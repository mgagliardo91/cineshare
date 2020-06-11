import { Model, DataTypes } from 'sequelize';
import generateId, { isValidId } from 'utils/generateId';

export default (sequelize) => {
  class User extends Model {}
  User.init({
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    underscored: true,
    modelName: 'user'
  });
  User.findByEmail = async email => {
    return await User.findOne({
      where: {
        email
      }
    });
  };

  return User;
};