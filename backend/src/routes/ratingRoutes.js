import express from 'express';
import Booking from '../models/Booking.js';
import Rating from '../models/Rating.js';

const router = express.Router();

// Submit a rating
router.post('/submit', async (req, res) => {
    try {
        const { bookingId, rating, review } = req.body;

        if (!bookingId || !rating) {
            return res.status(400).json({ message: "Booking ID and rating are required" });
        }

        // Find the booking to get driver and user details
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check if driverId exists on the booking
        if (!booking.driverId) {
            return res.status(400).json({ message: "This booking has no driver associated" });
        }

        // Check if rating already exists for this booking
        const existingRating = await Rating.findOne({ bookingId });
        if (existingRating) {
            return res.status(400).json({ message: "Rating already submitted for this booking" });
        }

        // Create new rating
        const newRating = new Rating({
            driverId: booking.driverId, // Assuming driverId in Booking is the User ObjectId of the driver
            userId: booking.userId,
            bookingId,
            rating,
            review
        });

        await newRating.save();

        res.status(201).json({ message: "Rating submitted successfully", rating: newRating });

    } catch (error) {
        console.error("Error submitting rating:", error);
        console.error("Error details:", error.message, error.stack);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get ratings for a driver
router.get('/driver/:driverId', async (req, res) => {
    try {
        const { driverId } = req.params;
        const ratings = await Rating.find({ driverId }).sort({ createdAt: -1 }).populate('userId', 'name');
        res.status(200).json(ratings);
    } catch (error) {
        console.error("Error fetching driver ratings:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
