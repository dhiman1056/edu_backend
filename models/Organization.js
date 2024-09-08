import mongoose from "mongoose";
const OrganizationSchema = new mongoose.Schema({
    // General Information
    organizationName: { type: String, required: true },
    domain: { type: String, required: true, unique: true }, // Domain should be unique
    shortDescription: { type: String, required: true },
    // Detailed Information
    detailInfo: {
        orgType: { type: String, enum: ['School', 'Institute','College','Consultancy'], required: true }, // Enum for organization type
        orgCategory: { type: String, enum: ['Public', 'Private','Government'], required: true }, // Enum for organization category
        briefDescription: { type: String, required: true },
      },
    // Contact Information
    contactInfo: {
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        website: { type: String },
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        address: { type: String, required: true },
      },

      adminDetails: {
        fullName: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Reference to the User who created the organization
    createdAt: { type: Date, default: Date.now }   
})

const OrganizationModel = mongoose.model('organization',OrganizationSchema);
export default OrganizationModel;