import { verifyJwt } from 'controller/auth';
import { isUndefined } from 'lodash/lang';
import { getUserById } from 'controller/user';
import NotAuthorizedError from 'error/NotAuthorizedError';

export const authorizeRoute = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization && /^Bearer/.test(authorization)) {
    const token = authorization.replace('Bearer ', '');
    const { id } = verifyJwt(token);
    if (!isUndefined(id)) {
      try {
        const user = await getUserById(id);
        req.user = user;
        return next();
      } catch(e) {
        // fall through
      }
    }
  }

  throw new NotAuthorizedError('You must be authenticated to use this route');
};