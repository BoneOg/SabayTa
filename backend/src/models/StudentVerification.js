import mongoose from 'mongoose';

const studentVerificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: String,
        required: true
    },
    yearLevel: {
        type: String,
        required: true
    },
    documents: {
        schoolId: {
            type: String,
            required: true
        },
        enrollmentProof: {
            type: String,
            required: true
        }
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const StudentVerification = mongoose.model('StudentVerification', studentVerificationSchema);
export default StudentVerification;
