import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date },
    adminNotes: { type: String }
});

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
