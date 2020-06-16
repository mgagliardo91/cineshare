import { ForbiddenError } from 'apollo-server';
import { skip, combineResolvers } from 'graphql-resolvers';
import { Context } from './types';

export function isAuthenticated<TSource,TArgs>(parent: TSource, args: TArgs, { me }: Context) {
  return me ? skip : new ForbiddenError('Not authenticated as user.');
};

export async function isMessageOwner<TSource,TArgs>(
  parent: TSource,
  { id }: TArgs & { id: string },
  { controllers, me }: Context,
) {
  const message = await controllers.Message.model.findByPk(id, { raw: true });
 
  if (message.userId !== me.id) {
    throw new ForbiddenError('Not authenticated as owner.');
  }
 
  return skip;
};

export const isAdmin = combineResolvers(
  isAuthenticated,
  async function<TSource,TArgs>(parent: TSource, args: TArgs, { me: { role }}: Context) {
    return role === 'ADMIN' ? skip : new ForbiddenError('Not authorized as admin');
  }
)