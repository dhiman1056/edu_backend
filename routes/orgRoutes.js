import express from "express";
import OrgController from "../controllers/OrgController.js";
const router = express.Router();

router.post("/create", OrgController.createOrg);
router.get("/getOrganization", OrgController.getOrganization);

export default router;
