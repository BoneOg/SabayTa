import express from 'express';
import Booking from '../models/Booking.js';
import Rating from '../models/Rating.js';
import { createNotification } from './notificationRoutes.js';

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

        // Create notification for user
        await createNotification(
            userId,
            'booking_created',
            'Booking Created',
            `Your ride from ${pickupLocation.name} to ${dropoffLocation.name} has been booked. Searching for drivers...`,
            newBooking._id
        );

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

        // Calculate driver ratings if driver is assigned
        if (booking.driverId && booking.driverId._id) {
            const ratings = await Rating.find({ driverId: booking.driverId._id });
            let averageRating = 0;
            if (ratings.length > 0) {
                const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
                averageRating = parseFloat((sum / ratings.length).toFixed(1));
            }

            // Add rating data to the driver object
            booking.driverId = {
                ...booking.driverId.toObject(),
                averageRating: averageRating,
                totalRatings: ratings.length
            };
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

        // Create notification for user
        await createNotification(
            booking.userId,
            'booking_accepted',
            'Driver Found!',
            `A driver has accepted your booking. They're on their way to pick you up!`,
            booking._id
        );

        // Create notification for driver
        await createNotification(
            driverId,
            'booking_accepted',
            'Booking Confirmed',
            `You have successfully accepted a booking. Navigate to the pickup location.`,
            booking._id
        );

        res.status(200).json({ message: "Booking accepted", booking: updatedBooking });
    } catch (error) {
        console.error("❌ Error accepting booking:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update driver location (called periodically by driver app)
router.post('/:id/location', async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const bookingId = req.params.id;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Latitude and longitude are required" });
        }

        // We use findOneAndUpdate for efficiency, verifying status allows updates
        const updatedBooking = await Booking.findOneAndUpdate(
            { _id: bookingId, status: 'accepted' },
            {
                $set: {
                    'driverLocation.latitude': latitude,
                    'driverLocation.longitude': longitude,
                    updatedAt: new Date()
                }
            },
            { new: true } // Return updated document
        );

        if (!updatedBooking) {
            // It's possible the booking was cancelled or completed, or ID is wrong
            return res.status(404).json({ message: "Active booking not found" });
        }

        res.status(200).json({ message: "Location updated", location: updatedBooking.driverLocation });
    } catch (error) {
        console.error("Error updating driver location:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Cancel a booking
router.post('/:id/cancel', async (req, res) => {
    try {
        const { cancelledBy } = req.body; // 'user' or 'driver'
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Allow cancelling both pending and accepted bookings
        if (booking.status !== 'pending' && booking.status !== 'accepted') {
            return res.status(400).json({ message: "Cannot cancel a booking that is already completed or cancelled" });
        }

        const wasAccepted = booking.status === 'accepted';

        // Set status to cancelled instead of deleting
        booking.status = 'cancelled';
        booking.cancelledAt = new Date();
        await booking.save();

        // Create notifications based on who cancelled
        if (cancelledBy === 'user') {
            // Notify user
            await createNotification(
                booking.userId,
                'booking_cancelled_by_user',
                'Booking Cancelled',
                'You have cancelled your ride booking.',
                booking._id
            );

            // Notify driver if booking was accepted
            if (wasAccepted && booking.driverId) {
                await createNotification(
                    booking.driverId,
                    'booking_cancelled_by_user',
                    'Booking Cancelled',
                    'The customer has cancelled the ride.',
                    booking._id
                );
            }
        } else if (cancelledBy === 'driver') {
            // Notify driver
            await createNotification(
                booking.driverId,
                'booking_cancelled_by_driver',
                'Booking Cancelled',
                'You have cancelled this ride booking.',
                booking._id
            );

            // Notify user
            await createNotification(
                booking.userId,
                'booking_cancelled_by_driver',
                'Booking Cancelled',
                'Your driver has cancelled the ride. We\'re searching for another driver.',
                booking._id
            );
        }

        console.log(`✅ Booking ${req.params.id} cancelled successfully`);
        res.status(200).json({ message: "Booking cancelled successfully", booking });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Mark passenger as picked up
router.post('/:id/pickup', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.status !== 'accepted') {
            return res.status(400).json({ message: "Only accepted bookings can mark passenger as picked up" });
        }

        booking.passengerPickedUp = true;
        booking.updatedAt = new Date();
        await booking.save();

        console.log(`✅ Passenger picked up for booking ${req.params.id}`);
        res.status(200).json({ message: "Passenger picked up", booking });
    } catch (error) {
        console.error("Error marking passenger as picked up:", error);
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

        // Create notification for user
        await createNotification(
            booking.userId,
            'booking_completed',
            'Ride Completed',
            'Your ride has been completed successfully. Thank you for using SabayTa!',
            booking._id
        );

        // Create notification for driver
        await createNotification(
            booking.driverId,
            'booking_completed',
            'Ride Completed',
            'You have successfully completed the ride. Great job!',
            booking._id
        );

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
