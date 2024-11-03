import express from "express";
import ProductController from "../controllers/ProductController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js"; // Make sure to import both middleware

const router = express.Router();

// Apply the isAuthenticated middleware to all routes in this router
router.use(isAuthenticated);

// Administrate Routes
router.post("/createOne", ProductController.createOne);
router.post("/updateOne", ProductController.updateOne);
router.get("/editOne", ProductController.editOne);
router.get("/fetchAll", ProductController.fetchAll);

// Private Routes (accessible to authenticated users)
router.get("/showCase", ProductController.showCase);

export default router;
