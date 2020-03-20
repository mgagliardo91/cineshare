import ApiError from './ApiError';

export default class BadRequestError extends ApiError {
  constructor(message) {
    super(message, 400);
    this.name = 'BadRequestError'
    Error.captureStackTrace(this, BadRequestError)
  }
}