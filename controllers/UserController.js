import bcrypt from "bcrypt";
import HandleCustomError from "../errorhandlers/handleCustomError.js";
import UserModel from "../models/User.js";
import { MESSAGES, RESPONSE_CODE, SUCCESS_CODE } from "../utils/constants.js";
import generateToken from "../utils/jwtUtils.js";
import { sendResponse } from "../utils/responseHelper.js";

class UserController {
  //static means no object required to access userRegistration
  static userRegistration = async (req, res, next) => {
    const { fullname, username, email, password, tc } = req.body;
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
      if (error.name === "ValidationError" || error.code === 11000) {
        // Handle Mongoose validation errors
        return res.status(RESPONSE_CODE.UNPROCESSABLE_ENTITY).json({
          error: error.message,
          msg: error._message,
          error_code: error.code,
        });
      }

      // Pass other errors to centralized error handler
      next(error);
    }
  };

  static authCheck = async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.user).select(
        "-password -gender -dateOfBirth -tc -role -createdAt"
      );

      if (!user) {
        return next(
          new HandleCustomError(
            MESSAGES.UNAUTHORIZED,
            RESPONSE_CODE.UNAUTHORIZED
          )
        );
      }
      return sendResponse(res, RESPONSE_CODE.OK, null, {
        user,
      });
    } catch (error) {
      next(error); // Pass error to centralized error handler
    }
  };

  static userLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({
        $or: [{ email: email }, { username: email }],
      });

      if (user == null) {
        return next(
          new HandleCustomError(
            MESSAGES.USER_NOT_REGISTERED,
            RESPONSE_CODE.BAD_REQUEST
          )
        );
      }
      if (user.isDeleted) {
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
          new HandleCustomError(
            MESSAGES.INVALID_CREDENTIALS,
            RESPONSE_CODE.BAD_REQUEST
          )
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
      next(error); // Pass error to centralized error handler
    }
  };
  static changePassword = async (req, res, next) => {
    try {
      const { oldpassword, password } = req.body;
      //match old password with db password
      const user = await UserModel.findById(req.user);
      const isMatch = await bcrypt.compare(oldpassword, user.password);

      if (!isMatch) {
        return next(
          new HandleCustomError(
            MESSAGES.OLD_PASSWORD_INCORRECT,
            RESPONSE_CODE.NOT_ACCEPTABLE
          )
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
      next(error); // Pass error to centralized error handler
    }
  };
}
export default UserController;
