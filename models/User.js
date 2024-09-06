import mongoose from "mongoose";
import validateUsername from '../utils/helper.js';

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please enter your full name"],
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    required: [true, "Please enter username"],
    trim: true,
    minlength: [1, "Username must be at least 1 character long"],
    maxlength: [30, "Username must be at most 30 characters long"],
    validate: {
      validator: validateUsername,
      message: "Username can only contain letters, numbers, underscores, periods (no consecutive periods or ending with a period), and must be 1-30 characters long",
    }
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Your password must be longer than 6 characters"],
    trim: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"], // You can adjust these values as per your needs
    default: "other",
    required: [true, "Please select your gender"],
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Please enter your date of birth"],
    default: new Date('2000-01-01'),
    validate: {
      validator: function (value) {
        // Check if the date is in the past
        return value <= new Date();
      },
      message: "Date of birth cannot be in the future",
    }
  },
  tc: { type: Boolean, required: true },
  avatar: { type: String, default: '' },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
