import express from "express";
import jwt from "jsonwebtoken";
import Profile from "../models/Profile.js";
import User from "../models/User.js"; // Import User model to get email from token

const router = express.Router();

// Inline auth middleware
const protect = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password"); // Fetch user without password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user; // Attach user to req
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// GET /api/profile - Fetch profile for authenticated user
router.get("/", protect, async (req, res) => {
    try {
        const profile = await Profile.findOne({ email: req.user.email });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT /api/profile - Update or create profile for authenticated user
router.put("/", protect, async (req, res) => {
    try {
        const { name, email, phone, street, city, district } = req.body;

        // Validation
        if (!name || !email || !phone || !street || !city || !district) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find and update profile, or create if it doesn't exist
        const profile = await Profile.findOneAndUpdate(
            { email: req.user.email },
            { name, email, phone, street, city, district },
            { new: true, runValidators: true, upsert: true } // Added upsert: true to create if not found
        );

        res.json({ message: "Profile updated successfully", profile });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) { // Duplicate key error (e.g., unique email)
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Server error" });
    }
});

export default router;