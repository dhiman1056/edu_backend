import express from "express";
import OrderController from "../controllers/OrderController.js";
const router = express.Router();

router.use("/checkout", OrderController.checkout);
router.use("/:orderId", OrderController.getOrderDetails);

router.post("/checkout", OrderController.checkout); // Checkout (create order)
router.get("/:orderId", OrderController.getOrderDetails); // Get order details by ID

export default router;
