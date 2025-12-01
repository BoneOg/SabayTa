import { v2 as cloudinary } from "cloudinary";
import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import Profile from "../models/Profile.js";
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

/* ================== ADMIN CHECK MIDDLEWARE ================== */
const adminProtect = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

/* ================== GET PROFILE ================== */
router.get("/", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.user.email });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({
      profile,
      role: req.user.role, // return role for frontend navigation
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================== GET ALL PROFILES (ADMIN ONLY) ================== */
router.get("/all", protect, adminProtect, async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json({ profiles });
  } catch (error) {
    console.error("Get all profiles error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================== UPDATE PROFILE ================== */
router.put("/", protect, upload.single("profileImage"), async (req, res) => {
  try {
    const { name, email, phone, street, city, district } = req.body;

    if (!name || !email || !phone || !street || !city || !district) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let profileImageUrl;
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "SabayTa_Profiles",
      });
      profileImageUrl = uploaded.secure_url;
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { email: req.user.email },
      {
        name,
        email,
        phone,
        street,
        city,
        district,
        ...(profileImageUrl && { profileImage: profileImageUrl }),
      },
      { new: true, upsert: true }
    );

    res.json({
      message: "Profile updated successfully",
      profile: updatedProfile,
      role: req.user.role,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.http_code || error.message.includes("Cloudinary")) {
      return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
    }

    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate field value" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

/* ================== UPDATE PROFILE PHOTO ONLY ================== */
router.put("/photo", protect, upload.single("profileImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: "SabayTa_Profiles",
    });

    const updatedProfile = await Profile.findOneAndUpdate(
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
    console.error("Update profile photo error:", error);

    if (error.http_code || error.message.includes("Cloudinary")) {
      return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

export default router;
