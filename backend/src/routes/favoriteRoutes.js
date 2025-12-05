import express from "express";
import jwt from "jsonwebtoken";
import FavoriteLocation from "../models/FavoriteLocation.js";
import User from "../models/User.js";

const router = express.Router();

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

/* ================== GET ALL FAVORITES ================== */
router.get("/", protect, async (req, res) => {
    try {
        const favorites = await FavoriteLocation.find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            favorites: favorites.map(fav => ({
                _id: fav._id,
                placeName: fav.placeName,
                placeAddress: fav.placeAddress,
                latitude: fav.latitude,
                longitude: fav.longitude,
                placeId: fav.placeId,
                customLabel: fav.customLabel,
                iconName: fav.iconName,
                createdAt: fav.createdAt
            }))
        });
    } catch (error) {
        console.error("Get favorites error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/* ================== ADD FAVORITE ================== */
router.post("/", protect, async (req, res) => {
    try {
        const { placeName, placeAddress, latitude, longitude, placeId, customLabel, iconName } = req.body;

        if (!placeName || !placeAddress || !latitude || !longitude) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if already favorited
        const existingFavorite = await FavoriteLocation.findOne({
            userId: req.user._id,
            placeId: placeId || placeAddress
        });

        if (existingFavorite) {
            return res.status(400).json({ message: "Location already in favorites" });
        }

        const favorite = await FavoriteLocation.create({
            userId: req.user._id,
            placeName,
            placeAddress,
            latitude,
            longitude,
            placeId: placeId || placeAddress,
            customLabel: customLabel || "",
            iconName: iconName || "location-sharp"
        });

        res.status(201).json({
            message: "Added to favorites",
            favorite: {
                _id: favorite._id,
                placeName: favorite.placeName,
                placeAddress: favorite.placeAddress,
                latitude: favorite.latitude,
                longitude: favorite.longitude,
                placeId: favorite.placeId,
                customLabel: favorite.customLabel,
                iconName: favorite.iconName,
                createdAt: favorite.createdAt
            }
        });
    } catch (error) {
        console.error("Add favorite error:", error);

        if (error.code === 11000) {
            return res.status(400).json({ message: "Location already in favorites" });
        }

        res.status(500).json({ message: "Server error" });
    }
});

/* ================== UPDATE FAVORITE ================== */
router.put("/:id", protect, async (req, res) => {
    try {
        const { customLabel, iconName } = req.body;

        const favorite = await FavoriteLocation.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!favorite) {
            return res.status(404).json({ message: "Favorite not found" });
        }

        if (customLabel !== undefined) favorite.customLabel = customLabel;
        if (iconName !== undefined) favorite.iconName = iconName;

        await favorite.save();

        res.json({
            message: "Favorite updated",
            favorite: {
                _id: favorite._id,
                placeName: favorite.placeName,
                placeAddress: favorite.placeAddress,
                latitude: favorite.latitude,
                longitude: favorite.longitude,
                placeId: favorite.placeId,
                customLabel: favorite.customLabel,
                iconName: favorite.iconName,
                createdAt: favorite.createdAt
            }
        });
    } catch (error) {
        console.error("Update favorite error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/* ================== REMOVE FAVORITE ================== */
router.delete("/:id", protect, async (req, res) => {
    try {
        const favorite = await FavoriteLocation.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!favorite) {
            return res.status(404).json({ message: "Favorite not found" });
        }

        await FavoriteLocation.deleteOne({ _id: req.params.id });

        res.json({ message: "Removed from favorites" });
    } catch (error) {
        console.error("Remove favorite error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/* ================== CHECK IF FAVORITED ================== */
router.post("/check", protect, async (req, res) => {
    try {
        const { placeId } = req.body;

        if (!placeId) {
            return res.status(400).json({ message: "Place ID is required" });
        }

        const favorite = await FavoriteLocation.findOne({
            userId: req.user._id,
            placeId: placeId
        });

        res.json({
            isFavorited: !!favorite,
            favoriteId: favorite?._id || null
        });
    } catch (error) {
        console.error("Check favorite error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
