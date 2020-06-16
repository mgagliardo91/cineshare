import models from '../models';
import { User } from '../models/User';

const { User: UserModel } = models;

const findAll = async (): Promise<User[]> => await User.findAll();

const findById = async (id: number): Promise<User | null> => await User.findByPk(id);

const findByLogin = async (login: string): Promise<User | null> => {
  let user = await UserModel.findOne({
    where: { username: login },
  });

  if (!user) {
    user = await UserModel.findOne({
      where: { email: login },
    });
  }

  return user;
};

export default {
  findAll,
  findById,
  findByLogin,
  model: UserModel
};