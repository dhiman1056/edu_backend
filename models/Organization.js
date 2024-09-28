import mongoose from "mongoose";
import { validateUsername } from "../utils/validation.js";
const OrganizationSchema = new mongoose.Schema({
  // General Information
  organizationName: {
    type: String,
    required: [true, "Organization name is required"],
  },
  domain: {
    type: String,
    required: [true, "Domain is required"],
    unique: true,
  },
  shortDescription: { type: String, required: true },
  // Detailed Information
  detailInfo: {
    orgType: {
      type: String,
      enum: ["School", "Institute", "College", "Consultancy"],
      required: [true, "Organization type is required"],
    }, // Enum for organization type
    orgCategory: {
      type: String,
      enum: ["SemiGovt", "Private", "Government"],
      required: [true, "Organization category is required"],
    }, // Enum for organization category
    briefDescription: {
      type: String,
      required: [true, "Brief description is required"],
    },
  },
  // Contact Information
  contactInfo: {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
        "Invalid email format",
      ], // Custom message for invalid email format
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    website: {
      type: String,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
  },

  adminDetails: {
    fullName: {
      type: String,
      required: [true, "Admin full name is required"],
    },
    username: {
      type: String,
      required: [true, "Admin username is required"],
      // unique: true,
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
      required: [true,"Admin email is required"],
      unique: true,
      match: [ /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, "Invalid email format"], // Custom message for invalid email format
      trim: true,
    },
    phone: {
      type: String,
      required: [true,"Admin phone number is required"]
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  }, // Reference to the User who created the organization
  createdAt: { type: Date, default: Date.now },
});

const OrganizationModel = mongoose.model("organization", OrganizationSchema);
export default OrganizationModel;
