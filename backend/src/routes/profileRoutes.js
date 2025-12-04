import { v2 as cloudinary } from "cloudinary";
import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
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
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      profile: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        street: user.street,
        city: user.city,
        district: user.district,
        profileImage: user.profileImage
      },
      role: user.role,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================== GET ALL PROFILES (ADMIN ONLY) ================== */
router.get("/all", protect, adminProtect, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const profiles = users.map(user => ({
      name: user.name,
      email: user.email,
      phone: user.phone,
      street: user.street,
      city: user.city,
      district: user.district,
      profileImage: user.profileImage
    }));
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

    const updateData = {
      name,
      email,
      phone,
      street,
      city,
      district,
    };

    if (profileImageUrl) {
      updateData.profileImage = profileImageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      profile: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        street: updatedUser.street,
        city: updatedUser.city,
        district: updatedUser.district,
        profileImage: updatedUser.profileImage
      },
      role: updatedUser.role,
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

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: uploaded.secure_url },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile photo updated successfully",
      profileImage: uploaded.secure_url,
      profile: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        street: updatedUser.street,
        city: updatedUser.city,
        district: updatedUser.district,
        profileImage: updatedUser.profileImage
      },
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
