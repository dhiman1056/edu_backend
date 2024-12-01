import express from "express";
import WorkspaceController from "../controllers/WorkspaceController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Apply the isAuthenticated middleware to all subsequent routes
router.use(isAuthenticated);

router.post("/create", WorkspaceController.createWorkspace);
router.post("/update", WorkspaceController.updateWorkspace);
router.get("/edit", WorkspaceController.editWorkspace);
router.get("/getOrganization", WorkspaceController.getOrganization);
router.get("/owns", WorkspaceController.ownsWorkspaces);
router.get("/fetch-stats", WorkspaceController.getWorkspacesByState);
// Route for adding a user to a workspace and updating the workspaces array in the User collection
router.post("/add-user-to-workspace", WorkspaceController.addUserToWorkspace);
router.get("/fetch-assign-workspace", WorkspaceController.getUserWorkspaces);

export default router;
