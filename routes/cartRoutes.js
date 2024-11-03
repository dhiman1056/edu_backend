import express from "express";
import ProductCartController from "../controllers/CartController.js";
const router = express.Router();

//Protected Cart Routes
router.post("/add", ProductCartController.addProductToCart); // Add product to cart
router.post("/remove", ProductCartController.removeProductFromCart); // Remove product from cart
router.get("/getCart", ProductCartController.getCart); // Get cart details
router.post("/empty", ProductCartController.emptyCart); // Empty cart

export default router;
