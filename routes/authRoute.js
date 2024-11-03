import express from "express";
import AuthController from "../controllers/AuthController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);

// Apply the isAuthenticated middleware to all subsequent routes
router.use(isAuthenticated);

// Protected routes
router.post("/change-password", AuthController.changePassword);
router.get("/authcheck", AuthController.authCheck);

export default router;
