import HandleCustomError from "../errorhandlers/handleCustomError.js";
import ProductModel from "../models/Product.js";
import { sendResponse } from "../utils/responseHelper.js";
import {
    MESSAGES,
    RESPONSE_CODE
  } from "../utils/constants.js";
class ProductController{
    static createProduct = async(req,res,next) =>{
        try{
            const { productName, productPrice } = req.body;
            const newProduct = new ProductModel({
                productName,
                productPrice
            });
            const savedProduct = await newProduct.save();
            return sendResponse(
                res,
                RESPONSE_CODE.OK,
                MESSAGES.PRODUCT_CREATED_SUCCESS
              );
        }catch(error){
            next(error);
        }
    }
    static getAllProducts = async(req,res,next)=>{
        try{
            const products = await ProductModel.find();
            console.log(products);
            return sendResponse(res,RESPONSE_CODE.OK,MESSAGES.PRODUCT_FETCH_SUCCESS,{products})
        }catch(error){
            next(error);
        }
    }
}
export default ProductController;