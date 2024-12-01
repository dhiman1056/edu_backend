import HandleCustomError from "../errorhandlers/handleCustomError.js";
import CartModel from "../models/Cart.js";
import OrganizationModel from "../models/Workspace.js";
import ProductModel from "../models/Product.js";
import { MESSAGES, RESPONSE_CODE } from "../utils/constants.js";
import { sendResponse } from "../utils/responseHelper.js";

class CartController {
  // Delete product from the cart
  static deleteProductFromCart = async (req, res, next) => {
    try {
      const { cartId, productId } = req.body;

      if (!cartId || !productId) {
        return next(
          new HandleCustomError(
            "Cart ID and Product ID are required",
            RESPONSE_CODE.BAD_REQUEST
          )
        );
      }

      // Step 1: Find the cart by ID
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        return next(
          new HandleCustomError(MESSAGES.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        );
      }

      // Step 2: Remove the product from the cart's items array
      const productIndex = cart.products.findIndex(
        (item) => item.products.toString() === productId
      );
      if (productIndex === -1) {
        return next(
          new HandleCustomError(
            "Product not found in the cart",
            RESPONSE_CODE.NOT_FOUND
          )
        );
      }

      // Remove the product from the cart's items
      cart.products.splice(productIndex, 1);

      // Recalculate totalAmount
      cart.totalAmount = cart.products.reduce(
        (total, item) => total + item.totalPrice,
        0
      );

      // Save the updated cart
      await cart.save();

      return sendResponse(
        res,
        RESPONSE_CODE.OK,
        MESSAGES.PRODUCT_REMOVED_SUCCESS
      );
    } catch (error) {
      next(error);
    }
  };

  // Empty cart (remove all products)
  static emptyCart = async (req, res, next) => {
    try {
      const { domain } = req.body; // Retrieve domain from request body
      const userId = req.userId; // Assuming `userId` is retrieved from middleware (e.g., JWT)
  
      // Step 1: Validate input
      if (!domain) {
        return next(
          new HandleCustomError("Domain is required", RESPONSE_CODE.BAD_REQUEST)
        );
      }
  
      // Step 2: Find the organization by domain
      const organization = await OrganizationModel.findOne({ domain });
      if (!organization) {
        return next(
          new HandleCustomError(
            "Organization not found with the provided domain",
            RESPONSE_CODE.NOT_FOUND
          )
        );
      }
  
      // Step 3: Find the user's cart for the given organization
      const cart = await CartModel.findOne({
        user: userId,
        organization: organization._id,
      });
  
      if (!cart) {
        return next(
          new HandleCustomError("Cart not found", RESPONSE_CODE.NOT_FOUND)
        );
      }
  
      // Step 4: Clear the cart
      cart.products = []; // Remove all products
      cart.totalAmount = 0; // Reset the total amount
  
      // Save the updated cart
      await cart.save();
  
      // Step 5: Send response
      return sendResponse(
        res,
        RESPONSE_CODE.OK,
        "Cart has been emptied successfully",
        {}
      );
    } catch (error) {
      next(error); // Pass error to error-handling middleware
    }
  };

  // Move cart products to organization products array
  static moveCartToOrganization = async (req, res, next) => {
    try {
      const { domain } = req.body; // Organization domain
      const userId = req.userId; // Assuming userId is extracted from auth middleware
  
      // Validate input
      if (!domain) {
        return next(
          new HandleCustomError("Domain is required", RESPONSE_CODE.BAD_REQUEST)
        );
      }
  
      // Find the organization by domain
      const organization = await OrganizationModel.findOne({ domain });
      if (!organization) {
        return next(
          new HandleCustomError(
            "Organization not found",
            RESPONSE_CODE.NOT_FOUND
          )
        );
      }
  
      // Find the user's cart for the organization
      const cart = await CartModel.findOne({
        user: userId,
        organization: organization._id,
      }).populate("products.product");
  
      if (!cart || cart.products.length === 0) {
        return next(
          new HandleCustomError(
            "Cart is empty or not found",
            RESPONSE_CODE.NOT_FOUND
          )
        );
      }
  
      // Add products to the organization's products collection
      const productIds = cart.products.map((item) => item.product._id);
      organization.products.push(...productIds);
  
      // Save the updated organization
      await organization.save();
  
      // Clear the user's cart
      cart.products = [];
      cart.totalAmount = 0;
      await cart.save();
  
      // Respond with success
      res.status(RESPONSE_CODE.OK).json({
        message: MESSAGES.ORDER_PLACED_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  };
  

  static toggleProductInCart = async (req, res, next) => {
    try {
      const { domain, productId, toggleStatus } = req.body;
      const userId = req.userId; // Assuming userId is added to the request via middleware

      // Validate input
      if (!domain || !productId || toggleStatus === undefined) {
        return next(
          new HandleCustomError(
            "Domain, Product ID, and Toggle Status are required",
            RESPONSE_CODE.BAD_REQUEST
          )
        );
      }

      // Find organization
      const organization = await OrganizationModel.findOne({ domain });
      if (!organization) {
        return next(
          new HandleCustomError(
            "Organization not found with the provided domain",
            RESPONSE_CODE.NOT_FOUND
          )
        );
      }

      // Find or create the cart for the user
      let cart = await CartModel.findOne({
        user: userId,
        organization: organization._id,
      });

      if (!cart) {
        cart = new CartModel({
          user: userId,
          organization: organization._id,
          products: [], // Initialize products array
        });
      }

      // Find the product
      const product = await ProductModel.findById(productId);
      if (!product) {
        return next(
          new HandleCustomError("Product not found", RESPONSE_CODE.NOT_FOUND)
        );
      }

      // Toggle product in cart
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (toggleStatus) {
        // Add product to cart
        if (productIndex === -1) {
          cart.products.push({ product });
        }
      } else {
        // Remove product from cart
        if (productIndex !== -1) {
          cart.products.splice(productIndex, 1);
        } else {
          return next(
            new HandleCustomError(
              "Product not found in the cart",
              RESPONSE_CODE.NOT_FOUND
            )
          );
        }
      }

      // Save the cart
      await cart.save();

      // Response
      const message = toggleStatus
        ? MESSAGES.PRODUCT_ADDED_SUCCESS
        : MESSAGES.PRODUCT_REMOVED_SUCCESS;

      return res.status(RESPONSE_CODE.OK).json({
        status: RESPONSE_CODE.OK,
        message: message,
        data: {
          cartId: cart._id,
          products: cart.products,
          totalAmount: cart.totalAmount,
        },
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  static getProducts = async (req, res, next) => {
    try {
      const { domain } = req.query; // Assume domain is passed in the request body
      const userId = req.userId; // Assuming `userId` is available in the request (from JWT or session)

      // Step 1: Validate input
      if (!domain) {
        return next(
          new HandleCustomError("Domain is required", RESPONSE_CODE.BAD_REQUEST)
        );
      }

      // Step 2: Find the organization by domain
      const organization = await OrganizationModel.findOne({ domain });
      if (!organization) {
        return next(
          new HandleCustomError(
            "Organization not found with the provided domain",
            RESPONSE_CODE.NOT_FOUND
          )
        );
      }

      // Step 3: Find the user's cart for the organization
      const cartItems = await CartModel.findOne({
        user: userId,
        organization: organization._id,
      }); // Populate product details

      // Step 4: Fetch "DEFAULT" products from ProductModel
      const defaultProducts = await ProductModel.find({ type: "DEFAULT" });

      // Step 5: Combine data for response
      const responseData = {
        cartItems: cartItems,
        defaultProducts: defaultProducts, // Include "DEFAULT" products
      };

      return sendResponse(
        res,
        RESPONSE_CODE.OK,
        MESSAGES.SUCCESS,
        responseData
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default CartController;
