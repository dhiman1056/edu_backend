import mongoose from "mongoose";
import { validateUsername } from "../utils/validation.js";

const WorkspaceSchema = new mongoose.Schema(
  {
    // General Informationdo
    name: {
      type: String,
      required: [true, "Workspace name is required"],
      trim: true,
    },
    bitmap: {
      type: String,
      trim: true,
    },
    domain: {
      type: String,
      required: [true, "Domain is required"],
      unique: true,
      trim: true,
    },
    shortDesc: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },

    // Detailed Information
    detailInfo: {
      orgType: {
        type: String,
        enum: ["School", "Institute", "College", "Consultancy"],
        required: [true, "Workspace type is required"],
      },
      orgCategory: {
        type: String,
        enum: ["SemiGovt", "Private", "Government"],
        required: [true, "Workspace category is required"],
      },
      briefDescription: {
        type: String,
        required: [true, "Brief description is required"],
        trim: true,
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
        ],
        trim: true,
      },
      phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        match: [
          /^[0-9]{10}$/, // Example: 10-digit phone number
          "Invalid phone number format",
        ],
      },
      website: {
        type: String,
        match: [
          /^(https?:\/\/)?([a-z0-9]+[.])?[a-z0-9]+([.-_]*[a-z0-9])*\.([a-z]{2,})+$/i,
          "Invalid website format",
        ],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      postalCode: {
        type: String,
        required: [true, "Postal code is required"],
        trim: true,
      },
      address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
      },
    },

    // Admin Details
    adminDetails: {
      fullName: {
        type: String,
        required: [true, "Admin full name is required"],
        trim: true,
      },
      username: {
        type: String,
        required: [true, "Admin username is required"],
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
        required: [true, "Admin email is required"],
        match: [
          /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
          "Invalid email format",
        ],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Admin phone number is required"],
        match: [
          /^[0-9]{10}$/, // Example: 10-digit phone number
          "Invalid phone number format",
        ],
      },
    },
    state: {
      type: Number, 
      default: 0, 
    },
    payStatus: {
      type: Number,
      default: 0, 
    },
    // Workspace Creation Information
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Ensure the "User" model is referenced correctly
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
     // Products (referencing Product collection)
     products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "products" },
    ],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

// Add index on the `createdBy` field for better query performance
WorkspaceSchema.index({ domain: 1, createdBy: 1 }); // Index on both `domain` and `createdBy` fields

const WorkspaceModel = mongoose.model("workspaces", WorkspaceSchema);
export default WorkspaceModel;
