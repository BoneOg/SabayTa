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

// Get a specific booking by ID
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('userId', 'name phone gender')
            .populate('driverId', 'name phone vehicle');

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ booking });
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Accept a booking (driver accepts)
router.post('/:id/accept', async (req, res) => {
    try {
        const { driverId, driverLocation, acceptedAt } = req.body;

        console.log("📱 Accept booking request:", { bookingId: req.params.id, driverId, driverLocation });

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            console.warn("❌ Booking not found:", req.params.id);
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.status !== 'pending') {
            console.warn("⚠️ Booking not in pending status:", booking.status);
            return res.status(400).json({ message: "Booking is not available" });
        }

        // Update booking
        booking.status = 'accepted';
        booking.driverId = driverId || 'unknown-driver';
        booking.driverLocation = driverLocation || {};
        booking.acceptedAt = acceptedAt ? new Date(acceptedAt) : new Date();

        const updatedBooking = await booking.save();
        console.log("✅ Booking accepted successfully:", { id: updatedBooking._id, status: updatedBooking.status });

        res.status(200).json({ message: "Booking accepted", booking: updatedBooking });
    } catch (error) {
        console.error("❌ Error accepting booking:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Cancel a booking
router.post('/:id/cancel', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = 'cancelled';
        booking.updatedAt = new Date();
        await booking.save();

        res.status(200).json({ message: "Booking cancelled", booking });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Complete a booking
router.post('/:id/complete', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.status !== 'accepted') {
            return res.status(400).json({ message: "Only accepted bookings can be completed" });
        }

        booking.status = 'completed';
        booking.updatedAt = new Date();
        await booking.save();

        res.status(200).json({ message: "Booking completed", booking });
    } catch (error) {
        console.error("Error completing booking:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get user history (completed and cancelled bookings)
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const bookings = await Booking.find({
            userId,
            status: { $in: ['completed', 'cancelled'] }
        })
            .populate('userId', 'name phone gender')
            .sort({ updatedAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching user history:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get driver history (completed and cancelled bookings where they were the driver)
router.get('/driver-history/:driverId', async (req, res) => {
    try {
        const { driverId } = req.params;

        const bookings = await Booking.find({
            driverId,
            status: { $in: ['completed', 'cancelled'] }
        })
            .populate('userId', 'name phone gender')
            .sort({ updatedAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching driver history:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
