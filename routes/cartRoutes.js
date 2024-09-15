import express from 'express';
const router = express.Router();
import validateToken from '../middlewares/authMiddleware.js';
import ProductCartController from '../controllers/CartController.js';


// validate token
router.use("/add",  validateToken);       
router.use("/remove", validateToken);  
router.use("/getCart",  validateToken);                
router.use("/empty",  validateToken);        

//Protected Cart Routes
router.post("/add",  ProductCartController.addProductToCart);          // Add product to cart
router.post("/remove", ProductCartController.removeProductFromCart);  // Remove product from cart
router.get("/getCart",  ProductCartController.getCart);                 // Get cart details
router.post("/empty",  ProductCartController.emptyCart);        // Empty cart

export default router;