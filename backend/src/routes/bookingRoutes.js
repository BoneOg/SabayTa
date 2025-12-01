import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

// Create a new booking
router.post('/create', async (req, res) => {
    try {
        const { userId, pickupLocation, dropoffLocation, distance, estimatedTime } = req.body;

        if (!userId || !pickupLocation || !dropoffLocation) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newBooking = new Booking({
            userId,
            pickupLocation,
            dropoffLocation,
            distance,
            estimatedTime,
            status: 'pending'
        });

        await newBooking.save();
        res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all pending bookings (for drivers)
router.get('/pending', async (req, res) => {
    try {
        const bookings = await Booking.find({ status: 'pending' })
            .populate('userId', 'name phone gender')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Cancel a booking
router.post('/:id/cancel', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ message: "Cannot cancel a booking that is not pending" });
        }

        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Booking cancelled and removed" });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
