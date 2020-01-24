import ApiError from './ApiError';

export default class ValidationError extends ApiError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError'
    Error.captureStackTrace(this, ValidationError)
  }
}