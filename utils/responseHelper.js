export const sendResponse = (res, statusCode, msg, data = null) => {
    return res.status(statusCode).json({
        statusCode,
        msg,
        data
    });
};
