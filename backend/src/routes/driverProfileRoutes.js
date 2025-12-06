import { v2 as cloudinary } from "cloudinary";
import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import DriverProfile from "../models/DriverProfile.js";
import Rating from "../models/Rating.js";
import User from "../models/User.js";

const router = express.Router();

/* ================== CLOUDINARY CONFIG ================== */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ================== MULTER CONFIG ================== */
const storage = multer.diskStorage({});
const upload = multer({ storage });

/* ================== AUTH MIDDLEWARE ================== */
const protect = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

/* ================== GET DRIVER PROFILE ================== */
router.get("/", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        // Get or create driver profile
        let driverProfile = await DriverProfile.findOne({ userId: user._id });
        if (!driverProfile) {
            driverProfile = await DriverProfile.create({ userId: user._id });
        }

        // Calculate average rating
        const ratings = await Rating.find({ driverId: user._id });
        let averageRating = 0;
        if (ratings.length > 0) {
            const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
            averageRating = (sum / ratings.length).toFixed(1);
        }

        res.json({
            profile: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                street: driverProfile.street,
                barangay: driverProfile.barangay,
                city: driverProfile.city,
                province: driverProfile.province,
                postalCode: driverProfile.postalCode,
                profileImage: driverProfile.profileImage,
                licenseNumber: driverProfile.licenseNumber,
                vehicleType: driverProfile.vehicleType,
                vehiclePlateNumber: driverProfile.vehiclePlateNumber,
                averageRating: parseFloat(averageRating),
                totalRatings: ratings.length
            },
            role: user.role,
        });
    } catch (error) {
        console.error("Get driver profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/* ================== UPDATE DRIVER PROFILE ================== */
router.put("/", protect, upload.single("profileImage"), async (req, res) => {
    try {
        const { name, email, phone, street, barangay, city, province, postalCode, licenseNumber, vehicleType, vehiclePlateNumber } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ message: "Name, email, and phone are required" });
        }

        let profileImageUrl;
        if (req.file) {
            const uploaded = await cloudinary.uploader.upload(req.file.path, {
                folder: "SabayTa_Driver_Profiles",
            });
            profileImageUrl = uploaded.secure_url;
        }

        // Update User model (name, email, phone)
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { name, email, phone },
            { new: true }
        ).select("-password");

        // Update or create DriverProfile
        const profileUpdateData = {
            street: street || "",
            barangay: barangay || "",
            city: city || "",
            province: province || "",
            postalCode: postalCode || "",
            licenseNumber: licenseNumber || "",
            vehicleType: vehicleType || "",
            vehiclePlateNumber: vehiclePlateNumber || ""
        };

        if (profileImageUrl) {
            profileUpdateData.profileImage = profileImageUrl;
        }

        const updatedProfile = await DriverProfile.findOneAndUpdate(
            { userId: req.user._id },
            profileUpdateData,
            { new: true, upsert: true }
        );

        res.json({
            message: "Driver profile updated successfully",
            profile: {
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                gender: updatedUser.gender,
                street: updatedProfile.street,
                barangay: updatedProfile.barangay,
                city: updatedProfile.city,
                province: updatedProfile.province,
                postalCode: updatedProfile.postalCode,
                profileImage: updatedProfile.profileImage,
                licenseNumber: updatedProfile.licenseNumber,
                vehicleType: updatedProfile.vehicleType,
                vehiclePlateNumber: updatedProfile.vehiclePlateNumber
            },
            role: updatedUser.role,
        });
    } catch (error) {
        console.error("Update driver profile error:", error);

        if (error.http_code || error.message.includes("Cloudinary")) {
            return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
        }

        if (error.code === 11000) {
            return res.status(400).json({ message: "Duplicate field value" });
        }

        res.status(500).json({ message: "Server error" });
    }
});

/* ================== UPDATE DRIVER PROFILE PHOTO ONLY ================== */
router.put("/photo", protect, upload.single("profileImage"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        const uploaded = await cloudinary.uploader.upload(req.file.path, {
            folder: "SabayTa_Driver_Profiles",
        });

        const updatedProfile = await DriverProfile.findOneAndUpdate(
            { userId: req.user._id },
            { profileImage: uploaded.secure_url },
            { new: true, upsert: true }
        );

        const user = await User.findById(req.user._id).select("-password");

        res.json({
            message: "Profile photo updated successfully",
            profileImage: uploaded.secure_url,
            profile: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                street: updatedProfile.street,
                barangay: updatedProfile.barangay,
                city: updatedProfile.city,
                province: updatedProfile.province,
                postalCode: updatedProfile.postalCode,
                profileImage: updatedProfile.profileImage,
                licenseNumber: updatedProfile.licenseNumber,
                vehicleType: updatedProfile.vehicleType,
                vehiclePlateNumber: updatedProfile.vehiclePlateNumber
            },
        });
    } catch (error) {
        console.error("Update driver profile photo error:", error);

        if (error.http_code || error.message.includes("Cloudinary")) {
            return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
        }

        res.status(500).json({ message: "Server error" });
    }
});

export default router;
