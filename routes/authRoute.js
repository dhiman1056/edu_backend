import express from "express";
import AuthController from "../controllers/AuthController.js";
import validateToken from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);

// Protected routes with token verification middleware
router.use(validateToken);
router.post("/change-password", AuthController.changePassword);
router.get("/authcheck", AuthController.authCheck);

export default router;
