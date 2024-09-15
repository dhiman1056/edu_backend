import mongoose from 'mongoose';
const orderProductSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});
const orderSchema  = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [orderProductSchema],  // List of products with quantity
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'canceled'],  // Order status
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    purchasedAt: {
        type: Date,
    }
});
const OrderModel = mongoose.model('order', orderSchema);
export default OrderModel;