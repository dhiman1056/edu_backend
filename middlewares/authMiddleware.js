import jwt from "jsonwebtoken";
import { RESPONSE_CODE } from "../utils/constants.js";

// Middleware to check if the user is authenticated (for private routes)
export const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.userId = decoded.userId;
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

// Middleware to check if the user is an ADMINISTRATE
export const isAdministrate = (req, res, next) => {
  // if (!req.userId || req.user.role !== "ADMINISTRATE") {
  //   return res.status(403).json({ message: "Forbidden: ADMINISTRATE only" });
  // }
  next();
};

// Middleware for public access (you might not need this if routes are public by default)
export const isPublic = (req, res, next) => {
  // No checks needed for public routes
  next();
};
