import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: String },
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
    driverLocation: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
    passengerPickedUp: { type: Boolean, default: false },
    acceptedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
