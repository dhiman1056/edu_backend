import mongoose from "mongoose";
import { ROLES_ENUM } from "../utils/enum.js";
import { validateUsername } from "../utils/validation.js";

const organizationSchema = new mongoose.Schema({
  org_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ROLES_ENUM.arr,
    default: "member",
  },
});

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please enter your full name"],
    trim: true,
    maxlength: [30, "Full name must be at most 30 characters long"],
  },
  username: {
    type: String,
    required: [true, "Please enter a username"],
    unique: true,
    trim: true,
    minlength: [1, "Username must be at least 1 character long"],
    maxlength: [30, "Username must be at most 30 characters long"],
    validate: {
      validator: validateUsername,
      message:
        "Username can only contain letters, numbers, underscores, periods (no consecutive periods or ending with a period), and must be 1-30 characters long",
    },
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format",
    ],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Your password must be longer than 6 characters"],
    trim: true,
  },
  tc: {
    type: Boolean,
    required: true,
  },
  role: {
    type: String,
    enum: ROLES_ENUM.arr,
    default: ROLES_ENUM.obj.USER,
  },
  avatar: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
  organizations: [organizationSchema],
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
