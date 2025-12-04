import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
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
    }
}, { timestamps: true });

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
