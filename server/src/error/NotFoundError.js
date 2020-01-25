import ApiError from './ApiError';

export default class NotFoundError extends ApiError {
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError'
    Error.captureStackTrace(this, NotFoundError)
  }
}