export const sendResponse = (res, statusCode, msg, payload = null) => {
  return res.status(statusCode).json({
    statusCode,
    msg,
    payload,
  });
};
