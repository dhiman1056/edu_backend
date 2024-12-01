import mongoose from "mongoose";

// Cart Item sub-schema to represent a product in the cart
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',  // Change to match the registered model name
    required: true,
  }
});

// Cart Schema
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',  // Reference to the Organization model
    required: true,
  },
  products: [cartItemSchema],  // List of products in the cart
  totalAmount: {
    type: Number,
    default: 0,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Middleware to update totalAmount before saving the cart
cartSchema.pre('save', function(next) {
  this.totalAmount = this.products.reduce((total, item) => total + item.price, 0);
  next();
});

const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;
