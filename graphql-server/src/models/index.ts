import { Sequelize } from 'sequelize-typescript';
import { User } from './User';
import { Message } from './Message';

const sequelize = new Sequelize(
  'postgres',
  'postgres',
  'postgres',
  {
    dialect: 'postgres',
    port: 6000
  }
);
sequelize.addModels([Message, User]);

export { sequelize };

export default {
  User: sequelize.models['User'],
  Message: sequelize.models['Message']
}