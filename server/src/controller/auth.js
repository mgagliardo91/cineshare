import jwt from 'jsonwebtoken';
import moment from 'moment';
import NotAuthorizedError from 'error/NotAuthorizedError';

export const createJwt = user => {
  const payload = {
    id: user.id,
    email: user.email
  };

  const options = {
    expiresIn: '1d',
    issuer: 'http://www.cineshare.io'
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  return {
    token,
    expires_at: moment().add(1, 'days').unix()
  };
};

export const verifyJwt = token => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    throw new NotAuthorizedError('Unable to validate provided JWT token.');
  }
};