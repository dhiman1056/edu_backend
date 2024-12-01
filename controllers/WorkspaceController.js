import HandleCustomError from "../errorhandlers/handleCustomError.js";
import UserModel from "../models/User.js";
import WorkspaceModel from "../models/Workspace.js";
import { MESSAGES, RESPONSE_CODE } from "../utils/constants.js";
import { sendResponse } from "../utils/responseHelper.js";

class WorkspaceController {
  static createWorkspace = async (req, res, next) => {
    try {
      const userId = req.userId;
      const user = await UserModel.findById(userId);

      if (!user) {
        return next(
          new HandleCustomError(
            MESSAGES.USER_NOT_FOUND,
            RESPONSE_CODE.NOT_FOUND
          )
        );
      }

      const newOrganization = new WorkspaceModel({
        ...req.body,
        createdBy: userId,
      });

      await newOrganization.save();

      return sendResponse(res, RESPONSE_CODE.OK, MESSAGES.ORG_REGISTER_SUCCESS);
    } catch (error) {
      if (error.name === "ValidationError" || error.code === 11000) {
        // Handle Mongoose validation errors
        return res.status(RESPONSE_CODE.UNPROCESSABLE_ENTITY).json({
          error: error.message,
          msg: error._message,
          error_code: error.code,
        });
      }

      next(error); // Forward unexpected errors to the error handler
    }
  };

  static editWorkspace = async (req, res, next) => {
    try {
      const { domain } = req.query; // Extract productId from query parameters

      // Fetch the product by ID
      const product = await WorkspaceModel.findOne({ domain });

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

  static updateWorkspace = async (req, res, next) => {
    try {
      const userId = req.userId;
      const { _id } = req.body;

      // Find the organization to update
      const organization = await WorkspaceModel.findById(_id);

      if (!organization) {
        return next(
          new HandleCustomError(MESSAGES.ORG_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
        );
      }

      // Check if the user is authorized to update this organization
      if (organization.createdBy.toString() !== userId) {
        return next(
          new HandleCustomError(MESSAGES.UNAUTHORIZED, RESPONSE_CODE.FORBIDDEN)
        );
      }

      // Update the organization with the new data
      Object.assign(organization, req.body);

      // Save the updated organization to the database
      await organization.save();

      return sendResponse(res, RESPONSE_CODE.OK, MESSAGES.ORG_UPDATE_SUCCESS);
    } catch (error) {
      if (error.name === "ValidationError" || error.code === 11000) {
        // Handle Mongoose validation errors
        return res.status(RESPONSE_CODE.UNPROCESSABLE_ENTITY).json({
          error: error.message,
          msg: error._message,
          error_code: error.code,
        });
      }

      next(error); // Forward unexpected errors to the error handler
    }
  };

  static getOrganization = async (req, res, next) => {
    try {
      const { id } = req.query;

      const organization = await WorkspaceModel.findById(id);
      if (!organization) {
        return next(
          new HandleCustomError(
            MESSAGES.ORGANIZATION_NOT_FOUND,
            RESPONSE_CODE.NOT_FOUND
          )
        );
      }

      return sendResponse(res, RESPONSE_CODE.OK, MESSAGES.ORGANIZATION_FOUND, {
        organization,
      });
    } catch (error) {
      next(error); // Forward any error to the error handler
    }
  };

  static ownsWorkspaces = async (req, res, next) => {
    try {
      // Assuming userId is stored in req.user (after user is authenticated)
      const userId = req.userId; // Adjust according to how the user ID is stored in your system

      const { page = 1, limit = 10 } = req.query; // Get page and limit from query parameters
      const skip = (page - 1) * limit; // Calculate how many records to skip

      // Ensure limit is within a reasonable range
      const maxLimit = 100; // Set a maximum limit to prevent excessive loading
      const validLimit = Math.min(parseInt(limit, 10) || 10, maxLimit);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Fetch products created by the logged-in user (filtered by createdBy)
      const products = await WorkspaceModel.find({ createdBy: userId })
        .skip(skip)
        .limit(validLimit);

      // Get total count of products for pagination
      const totalCount = await WorkspaceModel.countDocuments({
        createdBy: userId,
      });

      // Calculate total pages
      const totalPages = Math.ceil(totalCount / validLimit);

      // Build the next page URL if applicable
      const nextPage = page < totalPages ? parseInt(page, 10) + 1 : null;
      const nextPageUrl = nextPage
        ? `${req.baseUrl}?page=${nextPage}&limit=${validLimit}`
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

  static getWorkspacesByState = async (req, res, next) => {
    try {
      const { status, page = 1, limit = 10 } = req.query; // Extract status, page, and limit
      const skip = (page - 1) * limit; // Calculate how many records to skip

      // Ensure limit is within a reasonable range
      const maxLimit = 100; // Set a maximum limit to prevent excessive loading
      const validLimit = Math.min(parseInt(limit, 10) || 10, maxLimit);

      // Validate that status is a valid integer
      if (status === undefined) {
        return res.status(400).json({
          message: "Status parameter is required",
        });
      }

      // Convert status to integer (assuming state is an integer field)
      const statusInt = parseInt(status, 10);
      if (isNaN(statusInt)) {
        return res.status(400).json({
          message: "Status must be a valid integer",
        });
      }

      // Find workspaces matching the state (status) with pagination
      const workspaces = await WorkspaceModel.find({ state: statusInt })
        .skip(skip)
        .limit(validLimit);

      // Get total count of workspaces for pagination
      const totalCount = await WorkspaceModel.countDocuments({
        state: statusInt,
      });

      // Calculate total pages
      const totalPages = Math.ceil(totalCount / validLimit);

      // Build the next page URL if applicable
      const nextPage = page < totalPages ? parseInt(page, 10) + 1 : null;
      const nextPageUrl = nextPage
        ? `${req.baseUrl}?status=${status}&page=${nextPage}&limit=${validLimit}`
        : null;

      return sendResponse(res, RESPONSE_CODE.OK, null, {
        data: workspaces,
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

  static addUserToWorkspace = async (req, res, next) => {
    try {
      const { workspaceId, role, status } = req.body; // Extract data from the request body
      const userId = req.userId; // Assuming the user ID is available in the request (from auth middleware)
      const assignDt = new Date(); // Current date as assignment date
      const updateDt = new Date(); // Current date as update date

      // Validate if workspace exists
      const workspace = await WorkspaceModel.findById(workspaceId);
      if (!workspace) {
        return next(
          new HandleCustomError(
            MESSAGES.WORKSPACE_NOT_FOUND,
            RESPONSE_CODE.NOT_FOUND
          )
        );
      }

      // Find the user by userId
      const user = await UserModel.findById(userId);
      if (!user) {
        return next(
          new HandleCustomError(
            MESSAGES.USER_NOT_FOUND,
            RESPONSE_CODE.NOT_FOUND
          )
        );
      }

      // Check if the user already has the workspace in their 'workspaces' array
      const existingWorkspace = user.workspaces.find(
        (workspace) => workspace.workspaceId.toString() === workspaceId
      );

      if (existingWorkspace) {
        // If workspace exists, update the existing entry
        existingWorkspace.role = role;
        existingWorkspace.status = status;
        existingWorkspace.updateDt = updateDt;
      } else {
        // If workspace does not exist, add a new entry
        user.workspaces.push({
          workspaceId, // Workspace ID
          role, // Role (e.g., member, admin, etc.)
          status, // Status (e.g., active, inactive, etc.)
          assignDt, // Assignment date
          updateDt, // Update date
        });
      }

      // Save the updated user document
      await user.save();

      return sendResponse(
        res,
        RESPONSE_CODE.OK,
        "Request submitted successfully"
      );
    } catch (error) {
      next(error); // Forward errors to the error handler
    }
  };

  static getUserWorkspaces = async (req, res, next) => {
    try {
      const userId = req.userId; // Get userId from the request (assumed to be set by authentication middleware)
  
      // Find the user by userId and populate the 'workspaces' field with actual workspace objects
      const user = await UserModel.findById(userId)
        .populate({
          path: 'workspaces.workspaceId', // Populate the 'workspaceId' field in the 'workspaces' array
          model: 'workspaces', // Assuming 'Workspace' is the model for the workspace
        });
  
      if (!user) {
        return next(
          new HandleCustomError(
            MESSAGES.USER_NOT_FOUND,
            RESPONSE_CODE.NOT_FOUND
          )
        );
      }
  
      // Filter workspaces where status is 1 (active or whatever status means 1)
      const activeWorkspaces = user.workspaces.filter(
        (workspace) => workspace.status == 1
      );
  
      // Check if there are active workspaces
      if (activeWorkspaces.length === 0) {
        return sendResponse(
          res,
          RESPONSE_CODE.NOT_FOUND,
          "No active workspaces found."
        );
      }
  
      // Return the list of active workspaces
      return sendResponse(
        res,
        RESPONSE_CODE.OK,
        "Active workspaces fetched successfully",
        activeWorkspaces
      );
    } catch (error) {
      next(error); // Forward errors to the error handler
    }
  };
  
}

export default WorkspaceController;
