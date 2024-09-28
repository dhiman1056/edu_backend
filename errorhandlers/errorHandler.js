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
    const statusCode = err.statusCode || 500;

    // Check if the error message is an object (for custom validation errors)
    let responseMessage;
    if (typeof err.message === 'string') {
        try {
            responseMessage = JSON.parse(err.message); // Try to parse the message as JSON
        } catch {
            responseMessage = {msg:err.message}; // Fallback to plain string if parsing fails
            responseMessage = {msg:err.message}; // Fallback to plain string if parsing fails
        }
    } else if (typeof err.message === 'object') {
        responseMessage = { msg: err.message }; // Directly use the object if it's already an object
        responseMessage = { msg: err.message }; // Directly use the object if it's already an object
    } else {
        responseMessage =  { msg: 'Internal Server Error' }; // Default message
        responseMessage =  { msg: 'Internal Server Error' }; // Default message
    }

    // Send a JSON response to the client
    res.status(statusCode).json({
      statusCode,
        ...responseMessage
    });
};
export default errorHandler;
