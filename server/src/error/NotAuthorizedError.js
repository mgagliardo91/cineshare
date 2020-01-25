import ApiError from './ApiError';

export default class NotAuthorizedError extends ApiError {
  constructor(message) {
    super(message, 401);
    this.name = 'NotAuthorizedError'
    Error.captureStackTrace(this, NotAuthorizedError)
  }
}