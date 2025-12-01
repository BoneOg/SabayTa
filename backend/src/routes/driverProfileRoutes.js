import { v2 as cloudinary } from "cloudinary";
import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import DriverProfile from "../models/DriverProfile.js";
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
        const profile = await DriverProfile.findOne({ email: req.user.email });
        if (!profile) return res.status(404).json({ message: "Driver profile not found" });

        res.json({
            profile,
            role: req.user.role,
        });
    } catch (error) {
        console.error("Get driver profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/* ================== UPDATE DRIVER PROFILE ================== */
router.put("/", protect, upload.single("profileImage"), async (req, res) => {
    try {
        const { name, email, phone, street, city, district, licenseNumber, vehicleType, vehiclePlateNumber } = req.body;

        if (!name || !email || !phone || !street || !city || !district) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        let profileImageUrl;
        if (req.file) {
            const uploaded = await cloudinary.uploader.upload(req.file.path, {
                folder: "SabayTa_Driver_Profiles",
            });
            profileImageUrl = uploaded.secure_url;
        }

        const updatedProfile = await DriverProfile.findOneAndUpdate(
            { email: req.user.email },
            {
                name,
                email,
                phone,
                street,
                city,
                district,
                licenseNumber,
                vehicleType,
                vehiclePlateNumber,
                ...(profileImageUrl && { profileImage: profileImageUrl }),
            },
            { new: true, upsert: true }
        );

        res.json({
            message: "Driver profile updated successfully",
            profile: updatedProfile,
            role: req.user.role,
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
            { email: req.user.email },
            { profileImage: uploaded.secure_url },
            { new: true, upsert: true }
        );

        res.json({
            message: "Profile photo updated successfully",
            profileImage: uploaded.secure_url,
            profile: updatedProfile,
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
