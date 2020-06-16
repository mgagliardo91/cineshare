import { User } from "../models/User";
import { Op } from 'sequelize';
import models from '../models';

export const batchUsers = async (keys: number[]): Promise<User[]> => {
  const users = await models.User.findAll({
    where: {
      id: {
        [Op.in]: keys,
      },
    },
  });
 
  return keys.map(key => users.find((user: User) => user.id === key));
};