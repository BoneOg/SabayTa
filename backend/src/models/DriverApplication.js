import mongoose from 'mongoose';

const driverApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plateNumber: {
        type: String,
        required: true
    },
    motorcycleModel: {
        type: String,
        required: true
    },
    documents: {
        driversLicense: {
            type: String,
            required: true
        },
        vehicleORCR: {
            type: String,
            required: true
        }
    },
    applicationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

export default mongoose.model('DriverApplication', driverApplicationSchema);
