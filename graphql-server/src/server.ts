import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
import 'dotenv/config';
import schema from './schema/index';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import controllers from './controllers';
import { UserToken } from './models/User';
import loaders from './loaders';

const getMe = async (req: { 'x-token'?: string }): Promise<UserToken|null> => {
  const token = req['x-token'];
  if (token) {
    try {
      const value = await jwt.verify(token as string, process.env.SECRET);
      return value as UserToken;
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }

  return undefined;
};

const app = express();
app.use('*', cors());
app.use(compression());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  validationRules: [depthLimit(7)],
  subscriptions: {
    onConnect: async (connectionParams) => {
      console.log(connectionParams);
      const me = await getMe(connectionParams);
      return {
        me,
        controllers,
        loaders: {
          user: new DataLoader((keys: number[]) =>
            loaders.user.batchUsers(keys),
          ),
        },
      }
    }
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        ...connection.context,
        controllers
      }
    }
    if (req) {
      const me = await getMe(req.headers as any);
      return {
        controllers,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new DataLoader((keys: number[]) => loaders.user.batchUsers(keys))
        },
      }
    }
  },
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');
 
    return {
      ...error,
      message,
    };
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

const eraseDatabaseOnSync = true;
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    await createUsersWithMessages(new Date());
  }

  httpServer.listen(
    { port: 3000 },
    (): void => console.log(`\n🚀      GraphQL is now running on http://localhost:3000/graphql`));
});

const createUsersWithMessages = async (date: Date) => {
  await models.User.create({
    username: 'mgagliardo',
    email: 'mgagliardo@gmail.com',
    password: 'mgagliardo',
    role: 'ADMIN',
    messages: [
      {
        text: 'Published the Road to learn React',
        createdAt: date.setSeconds(date.getSeconds() + 1)
      }
    ]
  }, {
    include: [models.Message]
  });

  await models.User.create({
    username: 'ddavids',
    email: 'ddavids@gmail.com',
    password: 'ddavids',
    messages: [
      {
        text: 'Happy to release...',
        createdAt: date.setSeconds(date.getSeconds() + 1)
      },
      {
        text: 'Published a complete ...',
        createdAt: date.setSeconds(date.getSeconds() + 1)
      }
    ]
  }, { 
    include: [models.Message]
  })
};