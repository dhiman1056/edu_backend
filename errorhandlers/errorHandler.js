import logger from "../configs/logger.js";

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    // Log the error details
    logger.error('An error occurred', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Determine error status code (default to 500 if not specified)
    const statusCode = err.status || 500;

    // Send a JSON response to the client
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
}
export default errorHandler;
