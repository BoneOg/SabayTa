import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

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
            password
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
                gender: user.gender
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });

    }
});

router.post("/login", async (req, res) => {
    res.send("login");
});

export default router;