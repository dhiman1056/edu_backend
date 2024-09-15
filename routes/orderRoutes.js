import express from 'express';
const router = express.Router();
import validateToken from '../middlewares/authMiddleware.js';
import OrderController from '../controllers/OrderController.js';

router.use("/checkout",OrderController.checkout);
router.use("/:orderId",OrderController.getOrderDetails);

router.post("/checkout", OrderController.checkout);     // Checkout (create order)
router.get("/:orderId", OrderController.getOrderDetails); // Get order details by ID

export default router;
