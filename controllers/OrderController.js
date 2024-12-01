import logger from "../configs/logger.js";
import HandleCustomError from "../errorhandlers/handleCustomError.js";
import OrderModel from "../models/Order.js";

class OrderController{
    // Checkout (create order)
    static checkout = async(req,res,next) =>{
        try{
            const cart = await CartModel.findOne({ user: req.user }).populate("products.product");
            if (!cart || cart.products.length === 0) {
                return res.status(400).json({ message: "Cart is empty" });
            }
            const order = new OrderModel({
                user: req.userId,
                products: cart.products,
                totalPrice: cart.totalPrice,
                status: 'pending',
                purchasedAt: new Date()
            });
            await order.save();

            // Clear cart after successful order
            cart.products = [];
            cart.totalPrice = 0;
            await cart.save();
            return res.status(200).json({ message: "Order placed successfully", order });
        }catch(error){
            next(error);
        }
    };
    static getOrderDetails = async(req,res,next) =>{
        try{
            const orderId  = req.params.orderId;
            const order = await OrderModel.findById(orderId).populate("products.product");
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }
            return res.status(200).json(order);
        }catch(error){
            next(error);
        }
    }
}
export default OrderController;