import HandleCustomError from "../errorhandlers/handleCustomError.js";
import ProductModel from "../models/Product.js";
import { sendResponse } from "../utils/responseHelper.js";
import { MESSAGES, RESPONSE_CODE } from "../utils/constants.js";
import CartModel from "../models/Cart.js";

class ProductCartController {
  static addProductToCart = async (req, res, next) => {
  
    
    const { userId, productId, quantity } = req.body;
    try {
      const product = await ProductModel.findById(productId);
      if (!product) {
        return next(
          new HandleCustomError(
            MESSAGES.PRODUCT_NOT_FOUND,
            RESPONSE_CODE.BAD_REQUEST
          )
        );
      }
      let cart = await CartModel.findOne({ user: userId });
      console.log(cart + "--------->");
      
      if (!cart) {
        cart = new CartModel({
          user: userId,
          products: [{ product: productId, quantity: quantity || 1 }],
          totalPrice: product.productPrice * (quantity || 1),
        });
      } else {
        const productInCart = cart.products.find((item) => item.product.toString() === productId);
        if (productInCart) {
          productInCart.quantity += quantity || 1;
        } else {
          cart.products.push({ product: productId, quantity: quantity || 1 });
        }
        cart.totalPrice += product.productPrice * (quantity || 1);
      } 
      await cart.save();
      return sendResponse(
        res,
        RESPONSE_CODE.OK,
        MESSAGES.CART_ADD_SUCCESS,
        cart
      );
    } catch (error) {
      next(error);
    }
  };
  static removeProductFromCart = async (req, res, next) => {
    const { userId, productId } = req.body;
    try {
      const cart = await CartModel.findOne({ user: userId });
      if (!cart) {
        return next(
          new HandleCustomError(
            MESSAGES.CART_NOT_FOUND,
            RESPONSE_CODE.BAD_REQUEST
          )
        );
      }
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );
      if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }

      // Update total price
      const productPrice = cart.products[productIndex].quantity * (await ProductModel.findById(productId)).productPrice;
      cart.totalPrice -= productPrice;

      // Remove product from cart
      cart.products.splice(productIndex, 1);
      await cart.save();
      return sendResponse(
        res,
        RESPONSE_CODE.OK,
        MESSAGES.CART_REMOVE_SUCCESS,
        cart
      );
    } catch (error) {
      next(error);
    }
  };
  static getCart = async (req, res, next) => {
    const userId = req.user;
    try {
      const cart = await CartModel.findOne({ user: userId }).populate(
        "products.product"
      );
      if (!cart) {
        return next(
          new HandleCustomError(
            MESSAGES.CART_NOT_FOUND,
            RESPONSE_CODE.BAD_REQUEST
          )
        );
      }
      return sendResponse(
        res,
        RESPONSE_CODE.OK,
        MESSAGES.CART_GET_SUCCESS,
        cart
      );
    } catch (error) {
      next(error);
    }
  };
  // Empty the cart after purchase
  static emptyCart = async (req, res, next) => {
    try {
      const userId = req.user;
      const cart = await CartModel.findOne({ user: userId });
      if (!cart) {
        return next(
          new HandleCustomError(
            MESSAGES.CART_NOT_FOUND,
            RESPONSE_CODE.BAD_REQUEST
          )
        );
      }
      // Clear cart
      cart.products = [];
      cart.totalPrice = 0;
      await cart.save();
      return sendResponse(res, RESPONSE_CODE.OK, MESSAGES.CART_EMPTY_SUCCESS, cart);

    } catch (error) {
      next(error);
    }
  };
}
export default ProductCartController;