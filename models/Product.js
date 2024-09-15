import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
      },
    productPrice:{
        type:Number,
        required: [true, "Please enter product price"],
        min: [0, "Product price must be a positive number"], // Optional: ensures price is not negative
    }  
})
const ProductModel = mongoose.model("product", productSchema);
export default ProductModel;