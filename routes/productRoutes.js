import express from "express";
const router = express.Router();
import ProductController from "../controllers/ProductController.js";

router.post("/create", ProductController.createProduct);
router.get("/getAllProducts", ProductController.getAllProducts);

export default router;
