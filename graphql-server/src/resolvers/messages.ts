import { combineResolvers } from 'graphql-resolvers';
import { Op } from 'sequelize';
import { Message } from "../models/Message";
import { Context, Pagination } from './types';
import { isAuthenticated, isMessageOwner } from './authorization';
import pubsub, { EVENTS } from '../subscription';
import { withFilter } from 'apollo-server';

const toCursorHash = (val: string) => Buffer.from(val).toString('base64');
const fromCursorHash = (val: string) => Buffer.from(val, 'base64').toString('ascii');

export default {
  Query: {
    messages: async (parent: void, { cursor, limit = 100 }: Pagination, { controllers }: Context) => { 
      const messages = await controllers.Message.model.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        where: cursor ? { createdAt: { [Op.lt]: fromCursorHash(cursor) }} : null });
      const hasNextPage = messages.length > limit;
      const nodes = hasNextPage ? messages.slice(0, -1) : messages;

      return {
        nodes,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(nodes[nodes.length - 1].createdAt.toString())
        }
      }
    },
    message: async (parent: void, { id }: { id: string }, { controllers }: Context) => {
      return await controllers.Message.findById(id);
    },
  },
  Message: {
    user: async (message: Message, args: void, { loaders }: Context) => {
      return await loaders.user.load(message.userId);
    }
  },
  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent: void, { text }: { text: string }, { me, controllers }: Context) => {
      try {
        const message =  await controllers.Message.model.create({
          text,
          userId: me.id
        });
        pubsub.publish(EVENTS.MESSAGE.CREATED, { messageCreated: { message }});
        return message;
      } catch (e) {
        throw new Error(e);
      }
    }),
    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent: void, { id }: { id: string}, { controllers }: Context) => {
      return await controllers.Message.model.destroy({
        where: {
          id
        }
      })
    }),
  },
  Subscription: {
    messageCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
        ({ messageCreated }: any, variables: any, { me }: Context) => {
          return messageCreated.message.userId === me.id;
        }
      )
    }
  }
}