import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pickupLocation: {
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
        name: { type: String, required: true }
    },
    dropoffLocation: {
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
        name: { type: String, required: true }
    },
    distance: { type: String, required: true },
    estimatedTime: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'completed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
