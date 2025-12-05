import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, gender, password } = req.body;

        if (!name || !email || !phone || !gender || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const user = new User({
            name,
            email,
            phone,
            gender,
            password,
            role: "user" // default role
        });

        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
    try {
        let { emailOrPhone, password } = req.body;

        if (!emailOrPhone || !password) {
            return res.status(400).json({ message: "Email/Phone and password are required" });
        }

        // Clean input
        emailOrPhone = emailOrPhone.trim();

        // Helper to escape regex special characters for safe searching
        const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

        // Find user by email (case-insensitive) or phone
        const user = await User.findOne({
            $or: [
                { email: { $regex: new RegExp(`^${escapeRegex(emailOrPhone)}$`, 'i') } },
                { phone: emailOrPhone }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
