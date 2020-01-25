import { verifyJwt } from '../controller/auth';
import NotAuthorizedError from '../error/NotAuthorizedError';

export const authorizeRoute = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization && /^Bearer/.test(authorization)) {
    const token = authorization.replace('Bearer ', '');
    const { id, email } = verifyJwt(token);
    req.user = { id, email };
    return next();
  }

  console.log('NotAuthorizedError');
  throw new NotAuthorizedError('You must be authenticated to use this route');
};