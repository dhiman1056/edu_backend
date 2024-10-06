import HandleCustomError from "../errorhandlers/handleCustomError.js";
import UserModel from "../models/User.js";
import { MESSAGES, RESPONSE_CODE } from "../utils/constants.js";
import { sendResponse } from "../utils/responseHelper.js";

class ProfileController {
  static updateProfile = async (req, res, next) => {
    try {
      const { fullname, email } = req.body;
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
      user.fullname = fullname || user.fullname;
      user.email = email || user.email;
      user.gender = gender || user.gender;
      user.dateOfBirth = dateOfBirth || user.dateOfBirth;

      await user.save();

      return sendResponse(
        res,
        RESPONSE_CODE.OK,
        MESSAGES.PROFILE_UPDATE_SUCCESS
      );
    } catch (error) {
      next(error); // Pass error to centralized error handler
    }
  };
  static deleteProfile = async (req, res) => {
    const userId = req.user;
    const user = await UserModel.findById(userId);
    if (!user) {
      return next(
        new HandleCustomError(MESSAGES.USER_NOT_FOUND, RESPONSE_CODE.NOT_FOUND)
      );
    }
    await UserModel.findByIdAndUpdate(userId, {
      $set: { isDeleted: true, deletedAt: new Date() },
    });
    return sendResponse(res, RESPONSE_CODE.OK, MESSAGES.PROFILE_DELETE_SUCCESS);
  };
}

export default ProfileController;
