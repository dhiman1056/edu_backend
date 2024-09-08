import logger from "../configs/logger.js";
import HandleCustomError from "../errorhandlers/handleCustomError.js";
import OrganizationModel from "../models/Organization.js";
import {
  ERROR_CODE,
  MESSAGES,
  RESPONSE_CODE,
  SUCCESS_CODE,
} from "../utils/constants.js";
import { sendResponse } from "../utils/responseHelper.js";
import UserModel from "../models/User.js";

const validateOrganizationFields = ({ organizationName, domain, shortDescription, detailInfo, contactInfo, adminDetails }) => {
    if (!organizationName || !domain || !shortDescription) return false;
    if (!detailInfo || !detailInfo.orgType || !detailInfo.orgCategory || !detailInfo.briefDescription) return false;
    if (!contactInfo || !contactInfo.email || !contactInfo.phoneNumber || !contactInfo.country || !contactInfo.state || !contactInfo.city || !contactInfo.postalCode || !contactInfo.address) return false;
    if (!adminDetails || !adminDetails.fullName || !adminDetails.username || !adminDetails.email || !adminDetails.phone) return false;
    return true;
  }


class OrgController {
  static createOrganization = async (req, res,next) => {
    try {
      const userId  = req.user;  
      const user = await UserModel.findById(userId);
      if (!user) {
        return next(
          new HandleCustomError(
            MESSAGES.USER_NOT_FOUND,
            RESPONSE_CODE.NOT_FOUND
          )
        );
      }
      const {
        organizationName,
        domain,
        shortDescription,
        detailInfo,
        contactInfo,
        adminDetails
      } = req.body
      if (!validateOrganizationFields({ organizationName, domain, shortDescription, detailInfo, contactInfo, adminDetails })) {
        return next(new HandleCustomError(MESSAGES.REQUIRED_FIELDS, RESPONSE_CODE.BAD_REQUEST));
      }
      const newOrganization = new OrganizationModel({
        organizationName,
        domain,
        shortDescription,
        detailInfo,
        contactInfo,
        adminDetails,
        createdBy: userId,
      });
      await newOrganization.save();
      // Optionally, add the organization to the user's organizations array
      user.organizations.push(newOrganization._id);
      await user.save(); //save user document also
      return sendResponse(
        res,
        RESPONSE_CODE.OK,
        MESSAGES.ORG_REGISTER_SUCCESS
      )
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  static getOrganization = async(req,res,next) =>{
    try{
      const { id } = req.query;
      const organization = await OrganizationModel.findById(id);
      if (!organization) {
        return next(new HandleCustomError(MESSAGES.ORGANIZATION_NOT_FOUND, RESPONSE_CODE.NOT_FOUND));
      }
      return sendResponse(
        res,
        RESPONSE_CODE.OK,
        MESSAGES.ORGANIZATION_FOUND,
        { organization }
      );
    }catch(error){
      next(error);
    }
  }
}
export default OrgController;