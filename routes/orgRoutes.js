import express from "express";
const router = express.Router();
import OrgController from "../controllers/OrgController.js";
import validateToken from "../middlewares/authMiddleware.js";

// Apply middleware to all routes
router.use(validateToken);

router.post("/create", OrgController.createOrg);
router.get("/getOrganization", OrgController.getOrganization);

export default router;
