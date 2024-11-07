import ProductModel from "../models/Product.js";
import { MESSAGES, RESPONSE_CODE } from "../utils/constants.js";
import { sendResponse } from "../utils/responseHelper.js";
import HandleCustomError from "../errorhandlers/handleCustomError.js";

class ProductController {
  static createOne = async (req, res, next) => {
    try {
      const { name, price, currency, uuid, type } = req.body;

      // Create a new product instance
      const newProduct = new ProductModel({
        name,
        price,
        currency,
        uuid,
        type, // Include type in the product model
      });

      // Save the product to the database
      const savedProduct = await newProduct.save();

      return sendResponse(
        res,
        RESPONSE_CODE.OK,
        MESSAGES.PRODUCT_CREATED_SUCCESS,
        { product: savedProduct } // Return the created product details
      );
    } catch (error) {
      // Log the error for debugging
      console.error("Error creating product:", error);
      next(error);
    }
  };

  static editOne = async (req, res, next) => {
    try {
      const { productId } = req.query; // Extract productId from query parameters

      // Fetch the product by ID
      const product = await ProductModel.findById(productId);

      if (!product) {
        // Handle not found error
        return next(
          new HandleCustomError(MESSAGES.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        );
      }

      // Send the fetched product in the response
      return sendResponse(
        res, // Ensure you pass the response object
        RESPONSE_CODE.OK,
        MESSAGES.PRODUCT_FETCHED_SUCCESS, // Update message to reflect fetching
        product // Include the product data in the response
      );
    } catch (error) {
      next(error); // Pass any errors to the error handler
    }
  };

  static updateOne = async (req, res, next) => {
    try {
      const { id, ...updateData } = req.body; // Extract ID and the rest of the data from the body

      // Validate the incoming data here if necessary

      // Update the product by ID
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        updateData,
        { runValidators: true } // Only run validators
      );

      if (!updatedProduct) {
        return next(
          new HandleCustomError(MESSAGES.NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        ); // Handle not found error
      }

      // Send a success response without the updated product
      return sendResponse(
        res,
        RESPONSE_CODE.OK,
        MESSAGES.PRODUCT_UPDATED_SUCCESS // Success message for updating
      );
    } catch (error) {
      next(error); // Pass any errors to the error handler
    }
  };

  static fetchAll = async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Get page and limit from query parameters
      const skip = (page - 1) * limit; // Calculate how many records to skip

      // Fetch products with pagination
      const products = await ProductModel.find().skip(skip).limit(limit);

      // Get total count of products for pagination
      const totalCount = await ProductModel.countDocuments();

      // Calculate total pages
      const totalPages = Math.ceil(totalCount / limit);

      // Build the next page URL if applicable
      const nextPage = page < totalPages ? parseInt(page) + 1 : null;
      const nextPageUrl = nextPage
        ? `${req.baseUrl}?page=${nextPage}&limit=${limit}`
        : null;

      return sendResponse(res, RESPONSE_CODE.OK, null, {
        data: products,
        info: {
          totalCount,
          currentPage: Number(page),
          totalPages,
          next_page_url: nextPageUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  static showCase = async (req, res, next) => {
    try {
      const { type = "GENERAL", page = 1, limit = 10 } = req.query; // Get type, page, and limit from query parameters
      const skip = (page - 1) * limit; // Calculate how many records to skip

      // Ensure limit is within a reasonable range
      const maxLimit = 100; // Set a maximum limit to prevent excessive loading
      const validLimit = Math.min(parseInt(limit, 10) || 10, maxLimit);

      // Fetch products with pagination
      const products = await ProductModel.find({ type })
        .skip(skip)
        .limit(validLimit);

      // Get total count of products for pagination
      const totalCount = await ProductModel.countDocuments({ type });

      // Calculate total pages
      const totalPages = Math.ceil(totalCount / validLimit);

      // Build the next page URL if applicable
      const nextPage = page < totalPages ? parseInt(page, 10) + 1 : null;
      const nextPageUrl = nextPage
        ? `${req.baseUrl}?type=${type}&page=${nextPage}&limit=${validLimit}`
        : null;

      return sendResponse(res, RESPONSE_CODE.OK, null, {
        data: products,
        info: {
          totalCount,
          currentPage: parseInt(page, 10),
          totalPages,
          next_page_url: nextPageUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
export default ProductController;
