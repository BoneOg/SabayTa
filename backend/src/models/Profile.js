// backend/models/Profile.js

import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
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
    }
});

// Register the model and export it
const Profile = mongoose.model("Profile", profileSchema);

export default Profile; // Exporting the actual Model