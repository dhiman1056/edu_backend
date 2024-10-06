import express from "express";
const router = express.Router();
import ProfileController from "../controllers/ProfileController.js";
import validateToken from "../middlewares/authMiddleware.js";

// Apply middleware to all routes
router.use(validateToken);

router.post("/update", ProfileController.updateProfile);
router.post("/delete", ProfileController.deleteProfile);

export default router;
