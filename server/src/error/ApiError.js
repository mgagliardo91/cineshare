export default class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    Error.captureStackTrace(this, ApiError);
  }
}