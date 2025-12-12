import mongoose from "mongoose";

const driverProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    profileImage: {
        type: String,
        default: ""
    },

    street: {
        type: String,
        default: ""
    },

    barangay: {
        type: String,
        default: ""
    },

    city: {
        type: String,
        default: ""
    },

    province: {
        type: String,
        default: ""
    },

    postalCode: {
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
    },

    isApproved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const DriverProfile = mongoose.model("DriverProfile", driverProfileSchema);

export default DriverProfile;
