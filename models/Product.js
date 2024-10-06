import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },
  uuid: {
    type: String,
    required: [true, "Please enter uuid"],
    trim: true,
  },
  currency: {
    type: String,
    required: [true, "Please enter currency"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    min: [0, "Product price must be a positive number"], // Optional: ensures price is not negative
  },
});
const ProductModel = mongoose.model("products", productSchema);
export default ProductModel;
