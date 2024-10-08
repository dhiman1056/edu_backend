import HandleCustomError from "../errorhandlers/handleCustomError.js";
import OrganizationModel from "../models/Organization.js";
import UserModel from "../models/User.js";
import { MESSAGES, RESPONSE_CODE } from "../utils/constants.js";
import { sendResponse } from "../utils/responseHelper.js";

class OrgController {
  static createOrg = async (req, res, next) => {
    try {
      const userId = req.user;
      const user = await UserModel.findById(userId);

      if (!user) {
        return next(
          new HandleCustomError(
            MESSAGES.USER_NOT_FOUND,
            RESPONSE_CODE.NOT_FOUND
          )
        );
      }

      const newOrganization = new OrganizationModel({
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

  static getOrganization = async (req, res, next) => {
    try {
      const { id } = req.query;

      const organization = await OrganizationModel.findById(id);
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
}

export default OrgController;
