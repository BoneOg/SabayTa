import mongoose from "mongoose";

const driverProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: String,
        required: true
    },

    street: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    district: {
        type: String,
        required: true
    },

    // Field to store Cloudinary Image URL
    profileImage: {
        type: String,
        default: ""
    },

    // Driver specific fields
    licenseNumber: {
        type: String,
        default: ""
    },

    vehicleType: {
        type: String,
        default: ""
    },

    vehiclePlateNumber: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const DriverProfile = mongoose.model("DriverProfile", driverProfileSchema);

export default DriverProfile;
