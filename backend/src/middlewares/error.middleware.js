import ApiError from '../utils/ApiError.js';

export const notFound = (req, res, next) => next(ApiError.notFound(`Route not found: ${req.originalUrl}`));

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || null;

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An account with this ${field} already exists.`;
  }
  if (err.name === 'ValidationError') {
    statusCode = 400; message = 'Validation failed.';
    details = Object.values(err.errors).map((e) => e.message);
  }
  if (err.name === 'CastError') { statusCode = 400; message = `Invalid ${err.path}: ${err.value}`; }
  if (process.env.NODE_ENV !== 'production' && statusCode === 500) console.error('💥', err);

  res.status(statusCode).json({
    success: false, message,
    ...(details && { details }),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
