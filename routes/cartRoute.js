import express from "express";
import CartController from "../controllers/CartController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply the isAuthenticated middleware to all routes in this router
router.use(isAuthenticated);

// Delete product from the cart
router.delete("/deleteProduct", CartController.deleteProductFromCart);

// Empty the cart
router.delete("/emptyCart", CartController.emptyCart);

router.post("/move-to-organization",CartController.moveCartToOrganization);

// Toggle product in the cart (add or remove)
router.post("/toggleProduct", CartController.toggleProductInCart);
    
// Toggle product in the cart (add or remove)
router.get("/getProducts", CartController.getProducts);

export default router;
