import UserModel from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import generateToken  from '../utils/jwtUtils.js';
import { sendResponse } from '../utils/responseHelper.js';
import {ERROR_CODE,SUCCESS_CODE,MESSAGES } from '../utils/constants.js';
import logger from "../configs/logger.js";
import HandleCustomError from "../errorhandlers/handleCustomError.js";

class UserController{
    //static means no object required to access userRegistration 
    static userRegistration = async(req,res,next) =>{
        const {fullname,username,email,password,password_confirmation,tc} = req.body;
        if (!fullname || !username || !email || !password || !password_confirmation || !tc) {
            return next(new HandleCustomError(MESSAGES.REQUIRED_FIELDS, ERROR_CODE));
        }
        if (password !== password_confirmation) {
            return next(new HandleCustomError(MESSAGES.PASSWORD_MISMATCH, ERROR_CODE));
        }
        const existingUser = await UserModel.findOne({ $or : [{email:email},{username:username}] });
        if (existingUser) {
            if (existingUser.email === email) {
                return next(new HandleCustomError(MESSAGES.EMAIL_EXISTS, ERROR_CODE));
            }
            if (existingUser.username === username) {
                return next(new HandleCustomError(MESSAGES.USERNAME_EXISTS, ERROR_CODE));
            }
        }
        try{
            const salt =  await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(password,salt);
            const newUser = new UserModel({
                fullname:fullname,
                username:username,
                email:email,
                password:secPass,
                tc:tc
            })     
            await newUser.save(); 
            return sendResponse(res,SUCCESS_CODE,true,MESSAGES.USER_REGISTER_SUCCESS );
        }catch(error){
            console.log(error);
            next(error);  // Pass error to centralized error handler
        }
    }

    static userLogin = async(req,res,next)=>{
        try{
            const {email,password} = req.body;
            if (!email || !password) {
                return next(new HandleCustomError(MESSAGES.REQUIRED_FIELDS, ERROR_CODE));
            }
            logger.info("Email and password id",{email:email,password:password});
            const user = await UserModel.findOne({ $or: [{ email: email }, { username: email }]});
            if(user == null){
                return next(new HandleCustomError(MESSAGES.USER_NOT_REGISTERED, ERROR_CODE))
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);    
            if (!isPasswordMatch) {
                return next(new HandleCustomError(MESSAGES.INVALID_CREDENTIALS, ERROR_CODE));
            }
            const token = generateToken({userId:user._id});
            const userDate = await UserModel.findById(user._id).select('-password -gender -dateOfBirth -tc -role -createdAt');

            return sendResponse(res,SUCCESS_CODE,true,MESSAGES.AUTH_SUCCESS,{access_token:token,user:userDate} );
        }catch(error){
            logger.error("Error in user login api",{error:error});
            next(error);  // Pass error to centralized error handler
        }
    }
    static changePassword = async (req, res,next) => {
        try {
            const { password, password_confirmation } = req.body;
            if (!password || !password_confirmation) {
                return next(new HandleCustomError(MESSAGES.REQUIRED_FIELDS, ERROR_CODE));
            }
            if (password !== password_confirmation) {
                return next(new HandleCustomError(MESSAGES.PASSWORD_MISMATCH, ERROR_CODE));
            }
            // Generate salt and hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await UserModel.findByIdAndUpdate(req.user,{$set:{password:hashedPassword}})
            return sendResponse(res,SUCCESS_CODE,true,MESSAGES.PASSWORD_UPDATE_SUCCESS );
            
        } catch (error) {
            logger.error("Error changing password:", {error:error});
            next(error);  // Pass error to centralized error handler
        }
    };
    static loggedInUser = async(req,res,next) =>{
        try{
            const user = await UserModel.findById(req.user).select('-password');
            if (!user) {
                return next(new HandleCustomError(MESSAGES.USER_NOT_FOUND, ERROR_CODE));
            }
            return res.send({ "user": user });
        }catch(error){
            next(error);
        }
    }
    static editUserProfile = async(req,res) =>{
        try{
            console.log("Hello World");
        }catch(error){
            next(error);
        }
    }
}
export default UserController;