import express from "express";
import ProfileController from "../controllers/ProfileController.js";
const router = express.Router();

router.post("/update", ProfileController.updateProfile);
router.post("/delete", ProfileController.deleteProfile);

export default router;
