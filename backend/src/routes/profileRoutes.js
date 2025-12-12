import { v2 as cloudinary } from "cloudinary";
import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import Booking from "../models/Booking.js";
import Complaint from "../models/Complaint.js";
import DriverProfile from "../models/DriverProfile.js";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";

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

    // Get or create user profile
    let userProfile = await UserProfile.findOne({ userId: user._id });
    if (!userProfile) {
      userProfile = await UserProfile.create({ userId: user._id });
    }

    res.json({
      profile: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        street: userProfile.street,
        barangay: userProfile.barangay,
        city: userProfile.city,
        province: userProfile.province,
        postalCode: userProfile.postalCode,
        profileImage: userProfile.profileImage
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
    const profiles = await Promise.all(users.map(async (user) => {
      let userProfile = await UserProfile.findOne({ userId: user._id });
      if (!userProfile) {
        userProfile = { street: "", city: "", district: "", profileImage: "" };
      }

      let driverProfile = null;
      if (user.role === 'driver') {
        driverProfile = await DriverProfile.findOne({ userId: user._id });
      }

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role: user.role,
        status: user.status || 'Active',
        street: userProfile.street,
        city: userProfile.city,
        district: userProfile.district,
        profileImage: userProfile.profileImage,
        vehicleInfo: driverProfile ? `${driverProfile.vehicleType || ''} ${driverProfile.vehiclePlateNumber || ''}`.trim() : undefined,
        license: driverProfile ? driverProfile.licenseNumber : undefined,
        schoolId: 'Not uploaded', // Placeholder
        cor: 'Not uploaded', // Placeholder
        orCr: 'Not uploaded' // Placeholder
      };
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
    const { name, email, phone, street, barangay, city, province, postalCode } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email, and phone are required" });
    }

    let profileImageUrl;
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "SabayTa_Profiles",
      });
      profileImageUrl = uploaded.secure_url;
    }

    // Update User model (name, email, phone)
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone },
      { new: true }
    ).select("-password");

    // Update or create UserProfile
    const profileUpdateData = {
      street: street || "",
      barangay: barangay || "",
      city: city || "",
      province: province || "",
      postalCode: postalCode || ""
    };

    if (profileImageUrl) {
      profileUpdateData.profileImage = profileImageUrl;
    }

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      profileUpdateData,
      { new: true, upsert: true }
    );

    res.json({
      message: "Profile updated successfully",
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
        profileImage: updatedProfile.profileImage
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

    const updatedProfile = await UserProfile.findOneAndUpdate(
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
        profileImage: updatedProfile.profileImage
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

/* ================== ADMIN: UPDATE USER ================== */
router.patch("/admin/:userId", protect, adminProtect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, role, status } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email, and phone are required" });
    }

    // Validate role
    if (role && !['user', 'driver', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be 'user', 'driver', or 'admin'" });
    }

    // Validate status
    if (status && !['Active', 'Suspended'].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'Active' or 'Suspended'" });
    }

    // Build update object with only provided fields
    const updateData = { name, email, phone };
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    // Update user using findByIdAndUpdate to avoid password hashing middleware
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        status: updatedUser.status
      }
    });
  } catch (error) {
    console.error("Update user error:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Email or phone already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

/* ================== ADMIN: DELETE USER ================== */
router.delete("/admin/:userId", protect, adminProtect, async (req, res) => {
  try {
    const { userId } = req.params;

    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete associated profiles
    await UserProfile.findOneAndDelete({ userId });
    await DriverProfile.findOneAndDelete({ userId });

    res.json({
      message: "User deleted successfully",
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================== ADMIN DASHBOARD STATS ================== */
router.get("/admin/dashboard/stats", protect, adminProtect, async (req, res) => {
  try {
    // Total Users (all users regardless of role)
    const totalUsers = await User.countDocuments();

    // Active Drivers (users with role 'driver' and driverProfile.isApproved = true)
    const activeDrivers = await DriverProfile.countDocuments({
      isApproved: true
    });

    // Completed Rides
    const completedRides = await Booking.countDocuments({
      status: "completed"
    });

    // Pending Complaints
    const pendingComplaints = await Complaint.countDocuments({
      status: "Pending"
    });

    res.json({
      totalUsers,
      activeDrivers,
      completedRides,
      pendingComplaints
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
