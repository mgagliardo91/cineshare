import models from '../models';

const { Message } = models;

const findAll = async () => await Message.findAll();

const findById = async (id: string) => await Message.findByPk(id);

const findAllByUserId = async (userId: string) => {
  return await Message.findAll({
    where: {
      userId
    }
  });
}

export default {
  findAll,
  findById,
  findAllByUserId,
  model: Message
};