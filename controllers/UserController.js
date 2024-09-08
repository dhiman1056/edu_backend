import bcrypt from "bcrypt";
import logger from "../configs/logger.js";
import HandleCustomError from "../errorhandlers/handleCustomError.js";
import UserModel from "../models/User.js";
import {
  ERROR_CODE,
  MESSAGES,
  RESPONSE_CODE,
  SUCCESS_CODE,
} from "../utils/constants.js";
import generateToken from "../utils/jwtUtils.js";
import { sendResponse } from "../utils/responseHelper.js";

class UserController {
  //static means no object required to access userRegistration
  static userRegistration = async (req, res, next) => {
    const { fullname, username, email, password, tc } = req.body;
    if (!fullname || !username || !email || !password || !tc) {
      return next(
        new HandleCustomError(
          MESSAGES.REQUIRED_FIELDS,
          RESPONSE_CODE.NOT_ACCEPTABLE
        )
      );
    }

    const existingUser = await UserModel.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (existingUser) {
      if (existingUser.email === email) {
        return next(new HandleCustomError(MESSAGES.EMAIL_EXISTS, ERROR_CODE));
      }
      if (existingUser.username === username) {
        return next(
          new HandleCustomError(MESSAGES.USERNAME_EXISTS, ERROR_CODE)
        );
      }
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);
      const newUser = new UserModel({
        fullname: fullname,
        username: username,
        email: email,
        password: secPass,
        tc: tc,
      });
      await newUser.save();
      return sendResponse(
        res,
        RESPONSE_CODE.OK,
        MESSAGES.USER_REGISTER_SUCCESS
      );
    } catch (error) {
      console.log(error);
      next(error); // Pass error to centralized error handler
    }
  };

  static userLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(
          new HandleCustomError(MESSAGES.REQUIRED_FIELDS, ERROR_CODE)
        );
      }
      logger.info("Email and password id", {
        email: email,
        password: password,
      });
      const user = await UserModel.findOne({
        $or: [{ email: email }, { username: email }],
      });
      if (user == null) {
        return next(
          new HandleCustomError(MESSAGES.USER_NOT_REGISTERED, ERROR_CODE)
        );
      }
      if(user.isDeleted){
        return next(
          new HandleCustomError(
            MESSAGES.INACTIVE_USER_ERROR,
            RESPONSE_CODE.NOT_FOUND
          )
        );
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return next(
          new HandleCustomError(MESSAGES.INVALID_CREDENTIALS, ERROR_CODE)
        );
      }
      const token = generateToken({ userId: user._id });
      const userDate = await UserModel.findById(user._id).select(
        "-password -gender -dateOfBirth -tc -role -createdAt"
      );

      return sendResponse(res, RESPONSE_CODE.OK, MESSAGES.AUTH_SUCCESS, {
        access_token: token,
        user: userDate,
      });
    } catch (error) {
      logger.error("Error in user login api", { error: error });
      next(error); // Pass error to centralized error handler
    }
  };
  static changePassword = async (req, res, next) => {
    try {
      const {old_password, password, password_confirmation } = req.body;
      if (!old_password || !password || !password_confirmation) {
        return next(
          new HandleCustomError(MESSAGES.REQUIRED_FIELDS, ERROR_CODE)
        );
      }
      if (password !== password_confirmation) {
        return next(
          new HandleCustomError(MESSAGES.PASSWORD_MISMATCH, ERROR_CODE)
        );
      }
      //match old password with db password
      const user = await UserModel.findById(req.user);
      const isMatch = await bcrypt.compare(old_password, user.password);
      if (!isMatch) {
        return next(
          new HandleCustomError(MESSAGES.OLD_PASSWORD_INCORRECT, RESPONSE_CODE.NOT_ACCEPTABLE)
        );
      }
      // Generate salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await UserModel.findByIdAndUpdate(req.user, {
        $set: { password: hashedPassword },
      });
      return sendResponse(
        res,
        SUCCESS_CODE,
        true,
        MESSAGES.PASSWORD_UPDATE_SUCCESS
      );
    } catch (error) {
      logger.error("Error changing password:", { error: error });
      next(error); // Pass error to centralized error handler
    }
  };
  static loggedInUser = async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.user).select(
        "-password -gender -dateOfBirth -tc -role -createdAt"
      );
      if (!user) {
        return next(
          new HandleCustomError(
            MESSAGES.USER_NOT_FOUND,
            RESPONSE_CODE.UNAUTHORIZED
          )
        );
      }
      return sendResponse(res, RESPONSE_CODE.OK, null, {
        user,
      });
      //  return res.send({ user: user });
    } catch (error) {
      next(error);
    }
  };
  static deleteUserProfile = async (req, res) => {
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
    await UserModel.findByIdAndUpdate(userId, {$set: { isDeleted: true, deletedAt: new Date()}})
    return sendResponse(
      res,
      RESPONSE_CODE.OK,
      MESSAGES.PROFILE_DELETE_SUCCESS
    );
  };

  static updateUserProfile = async (req, res, next) => {
    try {
      const { fullname, email, gender, dateOfBirth } = req.body;
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
        MESSAGES.PROFILE_UPDATE_SUCCESS,
        {
          user: user,
        }
      );
    } catch (error) {
      next(error); // Pass error to centralized error handler
    }
  };
}
export default UserController;
