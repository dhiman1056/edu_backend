import mongoose from "mongoose";
const productCartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  products: [productCartSchema], // Array of products with quantity
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'purchased', 'canceled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
// Mongoose middleware
cartSchema.pre('save', async function (next) { //Pre-save Hook:
  let total = 0;
  for (const item of this.products) {
      const product = await mongoose.model('product').findById(item.product);
      total += product.productPrice * item.quantity;
  }
  this.totalPrice = total;
  next();
})

const CartModel = mongoose.model("cart", cartSchema);
export default CartModel;
