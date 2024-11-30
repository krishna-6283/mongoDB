/**
 * Centralized error handler middleware
 * @param {Error} err - The error object
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @param {Function} next - The next middleware function
 */
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging purposes

    const statusCode = err.statusCode || 500; // Default to 500 (Internal Server Error)
    const message = err.message || 'Internal Server Error';

    // Check if it's a validation error (e.g., Mongoose validation)
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.errors,
        });
    }

    // Check if it's a MongoDB CastError (e.g., invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: 'Invalid ID format',
            details: `Invalid ${err.path}: ${err.value}`,
        });
    }

    // Handle JWT authentication errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid Token',
            message: 'Authentication failed',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token Expired',
            message: 'Please login again',
        });
    }

    // Default error response
    res.status(statusCode).json({
        error: message,
    });
};

module.exports = errorHandler;
