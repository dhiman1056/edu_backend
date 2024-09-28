import jwt from "jsonwebtoken";
import {
  RESPONSE_CODE,
} from "../utils/constants.js";

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded.userId;
      next();
    } catch (err) {
      return res
        .status(RESPONSE_CODE.UNAUTHORIZED)
        .json({ statusCode: false, msg: "Invalid token." });
    }
  } else {
    res
      .status(RESPONSE_CODE.UNAUTHORIZED)
      .json({ statusCode: false, msg: "Authorization token is required." });
  }
};

export default validateToken;
